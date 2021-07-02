<script lang="ts" context="module">
  export type FileAdded = {
    files: FileList
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";

  type FileAddedEvent = { FileAdded: FileAdded };
  const dispatchFileAdded = createEventDispatcher<FileAddedEvent>();

  let highlighted: boolean = false;
  let fileInputValue:FileList;
  let fileUploader: HTMLInputElement;

  function handleFiles(fileList: FileList){
    highlighted = false;
    dispatchFileAdded("FileAdded", {files:fileList});
  }
</script>

<div
  class="rounded  p-4 flex flex-col justify-center items-center {highlighted? "bg-gray-100":"bg-gray-50"}"
  on:drop|preventDefault={e=>handleFiles(e.dataTransfer.files)}
  on:dragover|preventDefault={()=>{ }}
  on:dragenter|preventDefault={() => (highlighted = true)}
  on:dragleave|preventDefault={() => (highlighted = false)}
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 my-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
  </svg>
  <form class="text-center button">
    <label for="fileElem" class="flex-1">Add files</label>
    <input
      bind:this={fileUploader}
      type="file"
      id="fileElem"
      multiple
      accept="image/*"
      class="hidden"
      bind:files={fileInputValue}
      on:change|preventDefault={ e => handleFiles(fileInputValue) }
    />
  </form>
</div>
