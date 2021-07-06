<script lang="ts">
  import { v4 as uuid } from "uuid";
  import { fly, fade } from "svelte/transition";
  import RequestDocumentation from "./RequestDocumentation.svelte";
  import type { Documentation, FileType } from "./Types/Type";
  import { toCommonFileName, parseFileType } from "./Types/Helper";
  import { mockStoreFile as storeFile } from "./Persistence";
  import { writable } from "svelte/store";
  import type { Writable } from "svelte/store";
  import { prevent_default } from "svelte/internal";

  type UploadRequest = { file: File; id: string; type: "UploadRequest" };
  type AvailableDocumentation = {
    documentation: Documentation;
    id: string;
    type: "AvailableDocumentation";
  };
  type UploadFail = {
    file: File;
    id: string;
    error: string;
    type: "UploadFail";
  };
  type ListItem = UploadRequest | AvailableDocumentation | UploadFail;

  const isUploadRequest = (doc: ListItem): doc is UploadRequest =>
    doc.type === "UploadRequest";
  const isAvailableDocumentation = (
    doc: ListItem
  ): doc is AvailableDocumentation => doc.type === "AvailableDocumentation";
  const isUploadFail = (doc: ListItem): doc is UploadFail =>
    doc.type === "UploadFail";

  export let encryptionKey: string;
  export let documentation: Writable<Documentation[]> = writable<
    Documentation[]
  >([]);
  let listItems: ListItem[] = [];
  let fileInputValue: FileList;
  let isDropzoneHighlighted: boolean = false;

  let isShowingDocumentationRequest: boolean = false;
  documentation.subscribe((x) => {
    isShowingDocumentationRequest = x.length === 0;
    listItems = x.map((y) => ({
      documentation: y,
      id: uuid(),
      type: "AvailableDocumentation",
    }));
  });

  function requestDocumentationCancelled() {
    isShowingDocumentationRequest = false;
  }

  function isSupported(x: File): Promise<FileType> {
    const fileType = parseFileType(x.type);
    if (fileType) {
      return Promise.resolve(fileType);
    } else {
      return Promise.reject({ message: "Unsupported file format" });
    }
  }
  function updateListItems(item: ListItem): ListItem {
    listItems = listItems.map((y) => (y.id === item.id ? item : y));
    return item;
  }
  function dispatchDocumentUploadedEvent(item: AvailableDocumentation) {
    return true;
  }

  async function fileAdded(fileList: FileList) {
    const requests: UploadRequest[] = Array.from(fileList).map((file) => ({
      file: file,
      id: uuid(),
      type: "UploadRequest",
    }));

    listItems = (requests as ListItem[]).concat(listItems);
    await Promise.all(
      requests.map((x) =>
        isSupported(x.file)
          .then((fileType) =>
            storeFile(x.file, encryptionKey).then(
              (storageId: string): AvailableDocumentation => ({
                documentation: {
                  preview:
                    fileType === "image/jpeg" || fileType === "image/png"
                      ? URL.createObjectURL(x.file)
                      : null,
                  id: storageId,
                  title: x.file.name.split(".").shift().concat(""),
                  fileType: fileType,
                },
                id: x.id,
                type: "AvailableDocumentation",
              })
            )
          )
          .catch(
            (e): UploadFail => ({
              file: x.file,
              id: x.id,
              error: e.message,
              type: "UploadFail",
            })
          )
          .then(updateListItems)
          .then((x) =>
            isAvailableDocumentation(x)
              ? dispatchDocumentUploadedEvent(x)
              : false
          )
      )
    );
  }
  function requestDocumentationButtonClicked() {
    isShowingDocumentationRequest = !isShowingDocumentationRequest;
  }
  function cleanUpFailUpload(item: UploadFail){
    listItems = listItems.filter(x => x.id !== item.id);
  }
</script>

<section class="flex flex-col flex-1">
  <header class="flex border-b pb-2 items-center mx-4 md:mx-6 lg:mx-8">
    <h2 class="text-ml font-bold uppercase mr-auto">Documentation</h2>
    <form class="button icon">
      <label for="fileElem" class="flex-1" aria-label="Upload documents">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </label>
      <input
        type="file"
        id="fileElem"
        multiple
        accept="image/*"
        class="hidden"
        bind:files={fileInputValue}
        on:change|preventDefault={(e) => fileAdded(fileInputValue)}
      />
    </form>
    <button
      aria-label="Request Documentation"
      class="button icon border-b-2 {isShowingDocumentationRequest
        ? 'border-gray-300'
        : 'border-transparent'}"
      on:click={requestDocumentationButtonClicked}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg></button
    >
  </header>
  <div class="relative flex flex-1">
    {#if isShowingDocumentationRequest}
      <div
        class="md:absolute flex-1 w-full h-full box-border z-10 top-0 left-0 bg-white bg-opacity-80"
        on:click={() => (isShowingDocumentationRequest = false)}
      >
        <div
          on:click={(e) => {
            e.stopPropagation();
            e.preventDefault(); /**stop click propagrate to overlay */
          }}
          class="w-full md:w-96 bg-white md:shadow-xl md:right-4 md:absolute md:border rounded"
          transition:fly={{ duration: 200, y: -100 }}
        >
          <RequestDocumentation
            on:RequestDocumentationCancelled={requestDocumentationCancelled}
          />
        </div>
      </div>
    {/if}
    <div
      class="{isShowingDocumentationRequest
        ? 'hidden'
        : ''} md:block md:bg-dotted flex-1 mt-4 mx-2 md:mx-4 lg:mx-6"
      on:drop|preventDefault={(e) => fileAdded(e.dataTransfer.files)}
      on:dragover|preventDefault={() => {}}
      on:dragenter|preventDefault={() => (isDropzoneHighlighted = true)}
      on:dragleave|preventDefault={() => (isDropzoneHighlighted = false)}
    >
      <ul class="flex flex-wrap" transition:fade>
        {#each listItems as uploadItem}
          <li
            class="border bg-white rounded px-4 py-2 w-60 h-32 flex flex-col shadow-md hover:shadow-xl transition m-2 relative"
          >
            {#if isUploadRequest(uploadItem)}
              <div
                aria-label="Processing file. Please wait"
                class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"
              />
              <span>{uploadItem.file.name}</span>
            {:else if isUploadFail(uploadItem)}
              <svg
                aria-label="Warning"
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12 text-red-500 mt-2 mb-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span class="font-bold">{uploadItem.error}</span>
              <span class="font-semibold">{uploadItem.file.name}</span>
              <button aria-label="Clean up" class="absolute right-2 top-2" on:click={()=> cleanUpFailUpload(uploadItem)}
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            {:else}
              <img
                class="h12 w-12 mt-2 mb-auto"
                src="images/icon-{toCommonFileName(
                  uploadItem.documentation.fileType
                )}.svg"
                alt="File format {toCommonFileName(
                  uploadItem.documentation.fileType
                )}"
              />
              <span class="font-semibold">{uploadItem.documentation.title}</span>
            {/if}
          </li>
        {/each}
        <li
          class="flex flex-col items-center justify-center border bg-white rounded px-4 py-2 w-60 h-32 italic text-center transition m-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Drag and drop documents to add them to this matter.</span>
        </li>
      </ul>
    </div>
  </div>
</section>
