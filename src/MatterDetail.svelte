<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import DocumentationView from "./DocumentationView.svelte";
  import type { Matter, MatterDeleted } from "./Type";

  export let matter: Matter;
  export let encryptionKey: string;
  let isContextMenuVisible: boolean = false;
  
  type MatterDeletedEvent = { MatterDeleted: MatterDeleted };
  const dispatchDeletion = createEventDispatcher<MatterDeletedEvent>();
  const deleteMatter = () =>
    confirm(`You are about to delete ${matter.title}`)
      ? dispatchDeletion("MatterDeleted", {
          matter: matter,
          type: "MatterDeleted",
        })
      : null;
  const moreButtonClicked = () =>
    (isContextMenuVisible = !isContextMenuVisible);
  
  
</script>

<section class="flex-1 p-4 md:p-6 lg:p-8 relative overflow-hidden">
  <header class="mb-8 flex justify-between w-full">
    <div>
      <span class="text-ml font-bold uppercase">Matter</span><br />
      <input
        type="text"
        bind:value={matter.title}
        class="font-serif text-4xl font-semibold"
      />
    </div>
    <div>
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
          class="rounded bg-white shadow-lg absolute z-10 flex flex-col border w-40 right-4"
        >
          <button
            class="py-2 px-4 text-red-500 text-left flex items-center"
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
  
  <DocumentationView encryptionKey={encryptionKey}/>
</section>
