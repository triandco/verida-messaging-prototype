<script lang="ts">
  import MatterDetail from "./MatterDetail.svelte";
  import { getApplicationData } from "./SimplePersistence";
  import type { Matter, MatterCreated, MatterDeleted } from "./Type";
  import MatterCreation from "./MatterCreation.svelte";
  import { fly, fade } from "svelte/transition";

  let did: string = getApplicationData("Did");
  let profile: string = "";
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
        class="{isSideBarFocused
          ? 'flex'
          : 'hidden'} w-full md:flex md:w-96 flex-col overflow-hidden shadow-md"
      >
        <header class="px-4 md:px-6 lg:px-8">
          <h1 class="font-serif font-semibold text-xl py-4">Desca</h1>
        </header>
        <div class="relative flex-1 flex">
          <section class="absolute flex flex-1 flex-col h-full w-full">
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
        </div>
        <div class="text-sm border-t mt-2 md:mt-4 py-2 md:py-4 px-4 md:px-6 lg:px-8 flex">
          <a href="https://onpoint-compliance.com/privacy-policy">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </a>
          <a class="ml-2" href="https://onpoint-compliance.com">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              class="h-6 w-6"
              viewBox="0 0 24 24"
              width="24pt"
              height="24pt"
            >
              <path
                d=" M 12 1 C 6.601 1 2.228 5.375 2.228 10.772 C 2.224 13.713 3.549 16.499 5.832 18.352 L 5.832 10.772 C 5.833 7.367 8.594 4.606 12 4.606 C 15.406 4.606 18.167 7.367 18.167 10.773 C 18.167 14.179 15.406 16.94 12 16.94 L 12 13.37 C 13.435 13.37 14.598 12.207 14.598 10.772 C 14.598 9.338 13.435 8.174 12 8.174 C 10.565 8.174 9.402 9.338 9.402 10.772 L 9.402 23 L 11.394 20.524 C 11.548 20.533 11.702 20.54 11.858 20.542 C 11.905 20.542 11.952 20.542 12 20.542 C 17.399 20.542 21.772 16.167 21.772 10.77 C 21.772 5.372 17.397 1 12 1 Z "
                fill="currentColor"
              />
            </svg>
          </a>
          <a class="ml-auto" href="https://desca.com/privacy-policy">
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
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </a>
        </div>
      </section>
      <section
        class="{isSideBarFocused
          ? 'hidden'
          : ''} md:block flex-1 bg-center bg-no-repeat bg-half relative"
      >
        <header class="max-w-full border-b flex items-center px-4 md:px-6 lg:px-8">
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
          <h1 class="font-serif font-semibold text-xl py-4 text-transparent">Desca</h1>
          <div class="h-4 w-4 rounded-full bg-green-500 ml-auto" />
        </header>
        {#if focusMatter !== null && focusMatter !== undefined}
          <section class="absolute w-full" transition:fly>
            <MatterDetail
              matter={focusMatter}
              on:MatterDeleted={(e) => matterDeleted(e.detail)}
            />
          </section>
        {:else}
          <section class="absolute w-full" transition:fly>
            <img
              src="images/character-decoration.jpg"
              alt="Create something new"
              class="max-h-screen"
            />
          </section>
        {/if}
      </section>
    </div>
  {/if}
</main>
