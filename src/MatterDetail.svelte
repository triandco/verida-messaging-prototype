<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { Matter, FileType, MatterDeleted } from "./Type";

  export let matter: Matter;
  let isContextMenuVisible: boolean = false;
  function getIcon(type: FileType): string {
    return `images/icon-${type}.png`;
  }
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
  const requestDocumentationClicked = () => alert("click");
</script>

<section class="flex-1 p-4 md:p-6 lg:p-8">
  <header class="mb-8 flex justify-between w-full">
    <div>
      <span class="text-ml font-bold uppercase">Matter</span>
      <h1 class="font-serif text-4xl font-semibold">{matter.title}</h1>
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
            class="py-2 px-4 text-red-500 text-left"
            on:click={deleteMatter}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 inline-block align-top"
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

  <section>
    <h2 class="text-ml font-bold uppercase border-b pb-2">Documentation</h2>
    {#if matter.documentation.length == 0}
      <img src="images/character-decoration.jpg" alt="Request dodcument" class="h-96 block mx-auto"/>
      <p class="mt-16 mb-8 text-center">
        No documentation available. <br />
        Request some from your client.
      </p>
      <button
        class="mx-auto button block"
        on:click={requestDocumentationClicked}>Request documentation</button
      >
    {:else}
      <ul>
        {#each matter.documentation as documentation}
          <li>
            <img
              src={getIcon(documentation.fileType)}
              alt={documentation.fileType}
            />
            <span>{documentation.title}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</section>
