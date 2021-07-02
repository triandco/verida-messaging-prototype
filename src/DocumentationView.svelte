<script lang="ts">
  import { v4 as uuid } from "uuid";
  import { fly, fade } from "svelte/transition";
  import RequestDocumentation from "./RequestDocumentation.svelte";
  import Dropzone, { FileAdded } from "./Dropzone.svelte";
  import { Documentation, FileType, parseFileType, toCommonFileName } from "./Type";
  import { mockStoreFile, StoreFile } from "./FileStorage";

  type UploadRequest = { file: File; id: string; type: "UploadRequest" };
  type UploadSuccess = {
    documentation: Documentation;
    id: string;
    type: "UploadSuccess";
  };
  type UploadFail = {
    file: File;
    id: string;
    error: string;
    type: "UploadFail";
  };
  type Upload = UploadRequest | UploadSuccess | UploadFail;

  const isUploadRequest = (doc: Upload): doc is UploadRequest =>
    doc.type === "UploadRequest";
  const isUploadSuccess = (doc: Upload): doc is UploadSuccess =>
    doc.type === "UploadSuccess";
  const isUploadFail = (doc: Upload): doc is UploadFail =>
    doc.type === "UploadFail";

  export let encryptionKey: string;
  let documentation: Documentation[] = [];
  let uploads: Upload[] = [];

  let isShowingDocumentationRequest: boolean = false;
  const storeFile: StoreFile = mockStoreFile;

  function requestDocumentationClicked() {
    isShowingDocumentationRequest = true;
  }
  function requestDocumentationCancelled() {
    isShowingDocumentationRequest = false;
  }

  function isSupported(x: File): Promise<FileType> {
    const fileType = parseFileType(x.type);
    if (fileType) {
      return Promise.resolve(fileType);
    } else {
      return Promise.reject({ message: "Unsupported file type" });
    }
  }

  function clearButtonClicked() {
    uploads = uploads.filter((x) => x.type === "UploadRequest");
  }
  function updateUploadQueue(item: Upload): Upload {
    uploads = uploads.map((y) => (y.id === item.id ? item : y));
    return item;
  }
  function updateDocumentationList(item: UploadSuccess) {
    documentation = documentation.concat([item.documentation]);
    return true;
  }

  async function fileAdded(e: FileAdded) {
    const requests: UploadRequest[] = Array.from(e.files).map((file) => ({
      file: file,
      id: uuid(),
      type: "UploadRequest",
    }));

    uploads = (requests as Upload[]).concat(uploads);
    await Promise.all(
      requests.map((x) =>
        isSupported(x.file)
          .then((fileType) =>
            storeFile(x.file, encryptionKey).then(
              (storageId: string): UploadSuccess => ({
                documentation: {
                  id: storageId,
                  title: x.file.name.split(".").shift().concat(""),
                  fileType: fileType,
                },
                id: x.id,
                type: "UploadSuccess",
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
          .then(updateUploadQueue)
          .then((x) =>
            isUploadSuccess(x) ? updateDocumentationList(x) : false
          )
      )
    );
  }
</script>
<style>
  .file-doc{
    border-left-color: #007bb4;
  }
  .file-pdf{
    border-left-color: #9c221b;
  }
</style>
<section>
  <h2 class="text-ml font-bold uppercase border-b pb-2 mb-4">Documentation</h2>
  {#if documentation.length != 0}
  <div class="flex overflow-x-auto pb-2 mb-4 bg-gray-50">
    <ul class="flex flex-nowrap">
      {#each documentation as documentation}
        <li class="inline-block p-3 ">
          <div class="flex flex-col justify-between file-{toCommonFileName(documentation.fileType)} w-32 h-44 max-w-xs border-l-8 overflow-hidden rounded-r-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <img
              class="h-8 w-8 ml-auto m-2"
              src={`images/icon-${toCommonFileName(documentation.fileType)}.svg`}
              alt={documentation.fileType}
            />
            <span class="m-2 text-md block font-bold">{documentation.title}</span>
          </div>
        </li>
      {/each}
    </ul>
  </div>
  {/if}
  {#if uploads.length !== 0}
    <div class="bg-gray-50 rounded border">
      <ul class="divide-y max-h-48 overflow-y-auto border-b" transition:fade>
        {#each uploads as uploadItem}
          <li class="p-2 flex items-center">
            {#if isUploadRequest(uploadItem)}
              <div
                class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"
              />
              <span>{uploadItem.file.name}</span>
            {:else if isUploadFail(uploadItem)}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 mr-2 text-red-500"
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
              <span class="mr-2 font-bold ">{uploadItem.error}</span>
              <span>{uploadItem.file.name}</span>
            {:else}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{uploadItem.documentation.title}</span>
            {/if}
          </li>
        {/each}
      </ul>
      <button
        class="ml-auto mb-4 mr-4 mt-4 block"
        on:click|preventDefault={clearButtonClicked}
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </div>
  {/if}
  <Dropzone on:FileAdded={(e) => fileAdded(e.detail)} />
  <button
    class="mx-auto mt-4 button block"
    on:click={requestDocumentationClicked}>Request documentation</button
  >
</section>

{#if isShowingDocumentationRequest}
  <section
    class="absolute flex-1 w-full h-full bg-gray-50 bg-opacity-50 backdrop-blur-md flex justify-center align-center md:p-8 box-border z-10 top-0 left-0"
    transition:fly={{ duration: 200, y: 100 }}
  >
    <div class="bg-white shadow-md w-full max-w-3xl min-h-max">
      <RequestDocumentation
        on:RequestDocumentationCancelled={requestDocumentationCancelled}
      />
    </div>
  </section>
{/if}
