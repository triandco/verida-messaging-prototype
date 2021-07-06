<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import DocumentationList from "./DocumentationList.svelte";
  import type { Matter, MatterDeleted } from "./Types/Type";
  import {fly} from "svelte/transition";
  export let matter: Matter;
  export let encryptionKey: string;
  let isContextMenuVisible: boolean = false;
  let contextMenu: HTMLElement;
  
  type MatterDeletedEvent = { MatterDeleted: MatterDeleted };
  const dispatchDeletion = createEventDispatcher<MatterDeletedEvent>();
  const deleteMatter = () =>
    confirm(`You are about to delete ${matter.title}`)
      ? dispatchDeletion("MatterDeleted", {
          matter: matter,
          type: "MatterDeleted",
        })
      : null;
  function moreButtonClicked(){
    isContextMenuVisible = !isContextMenuVisible;
    if(isContextMenuVisible){
      window.setTimeout(()=>{
        const firstButton:HTMLElement = contextMenu.querySelector("#matterContextMenu button");
        if(firstButton){firstButton.focus();}
      },200);
    }
  }
  function contextMenuBlurred(){
    const focusItem = Array.from(contextMenu.querySelectorAll("#matterContextMenu button")).find(x => x == document.activeElement);
    if(focusItem === undefined){isContextMenuVisible=false;}
  }
  
</script>

<section class="flex-1 relative overflow-hidden flex flex-col">
  <header class="flex border-b mb-4">
    <slot name="LeftButton"></slot>
    <h1 class="font-serif font-semibold text-xl py-4 md:ml-6 lg:ml-8">{matter.title}</h1>
    <div bind:this={contextMenu} class="flex ml-auto">
      <button class="button icon" on:click={moreButtonClicked}>
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
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>
      {#if isContextMenuVisible}
        <div
          id="matterContextMenu"
          class="rounded bg-white shadow-lg absolute z-10 flex flex-col border w-40 right-4 top-16"
          transition:fly={{y:-10}}
        >
          <button
            class="py-2 px-4 text-red-500 text-left flex items-center"
            on:blur={contextMenuBlurred}
            on:click={deleteMatter}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Matter</button
          >
        </div>
      {/if}
    </div>
  </header>
  <div class="flex-1 flex flex-col">
    <DocumentationList encryptionKey={encryptionKey}/>
  </div>
</section>
