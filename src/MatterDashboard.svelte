<script lang="ts">
  import MatterDetail from "./MatterDetail.svelte";
  import { getApplicationData } from "./SimplePersistence";
  import type { Matter, MatterCreated, MatterDeleted } from "./Type";
  import MatterCreation from "./MatterCreation.svelte";
  import { fly } from "svelte/transition";
  import Footer from "./Footer.svelte";

  let did: string = getApplicationData("Did");
  let profile: string = "";
  const encryptionKey = "bleh";
  
  let matters: Matter[] = [];
  let focusMatter: Matter;
  type DisplayMode = "list" | "create";
  let displayMode: DisplayMode = "list";
  let isSideBarFocused: boolean = true;
  $: displayMode = matters.length == 0 ? "create" : "list";
  function matterCreated(e: MatterCreated) {
    matters = matters.concat(e.matter);
    focusMatter = e.matter;
  }
  function matterClicked(matter: Matter) {
    focusMatter = matter;
    isSideBarFocused = false;
  }
  function matterDeleted(deleted: MatterDeleted) {
    matters = matters.filter((x) => x.id !== deleted.matter.id);
    if (deleted.matter.id === focusMatter.id) {
      focusMatter = matters[0];
    }
  }
  function createButtonClicked() {
    displayMode = "create";
  }
  function showSideBarButtonClicked() {
    isSideBarFocused = true;
  }
</script>

<main
  class="flex justify-items-stretch h-screen bg-cover bg-right bg-no-repeat overflow-hidden"
>
  {#if displayMode === "create"}
    <div class="absolute w-full h-full z-10 bg-white" transition:fly>
      <MatterCreation on:MatterCreated={(e) => matterCreated(e.detail)} />
    </div>
  {:else}
    <div class="absolute w-full h-full flex" transition:fly>
      <section
        id="sidebar"
        style="min-width:24em;"
        class="{isSideBarFocused
          ? 'flex'
          : 'hidden'} w-full md:flex md:w-96 flex-col overflow-hidden shadow-md"
      >
        <header class="px-4 md:px-6 lg:px-8">
          <h1 class="font-serif font-semibold text-xl py-4">Desca</h1>
        </header>
        <section class="flex-1 mt-0 md:mt-4 lg:mt-6">
          <header
            class="flex justify-between align-center px-4 md:px-6 lg:px-8 h-10 leading-10"
          >
            <h2 class="text-ml font-bold uppercase">Matter</h2>
            <button on:click={createButtonClicked}>
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
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </header>
          <ul class="border-b">
            {#each matters as matter}
              <li
                in:fly={{ x: -100, duration: 200 }}
                out:fly={{ x: 100 }}
                class="py-4 px-4 md:px-6 lg:px-8 border-t cursor-pointer"
                on:click={() => matterClicked(matter)}
              >
                {matter.title}
              </li>
            {/each}
          </ul>
        </section>
        <div
          class="text-sm border-t mt-2 md:mt-4 py-2 md:py-4 px-4 md:px-6 lg:px-8 flex"
        >
          <Footer />
        </div>
      </section>
      <section
        id="main"
        class="{isSideBarFocused
          ? 'hidden'
          : ''} md:flex flex-col flex-1 bg-center bg-no-repeat overflow-hidden"
      >
        <header
          class="max-w-full border-b flex items-center px-4 md:px-6 lg:px-8"
        >
          <button
            class="md:hidden flex justify-center align-center h-4 w-4"
            on:click={showSideBarButtonClicked}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 class="font-serif font-semibold text-xl py-4 text-transparent">
            Matter details
          </h1>
          <div class="h-4 w-4 rounded-full bg-green-500 ml-auto" />
        </header>
        <div class="flex-1 flex">
          {#if focusMatter !== null && focusMatter !== undefined}
            <MatterDetail
              encryptionKey={encryptionKey}
              matter={focusMatter}
              on:MatterDeleted={(e) => matterDeleted(e.detail)}
            />
          {:else}
            <section class="w-full" transition:fly>
              <img
                src="images/character-decoration.jpg"
                alt="Create something new"
                class="max-h-screen"
              />
            </section>
          {/if}
        </div>
      </section>
    </div>
  {/if}
</main>
