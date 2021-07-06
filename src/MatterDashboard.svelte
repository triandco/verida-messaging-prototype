<script lang="ts">
  import MatterDetail from "./MatterDetail.svelte";
  import {
    deleteMatterById,
    getApplicationData,
    listMatter,
    putMatter,
  } from "./SimplePersistence";
  import type {Matter,
    MatterCreated,
    MatterDeleted,
    } from "./Types/Type";
  import {
    initial,
    isSuccess,
    isFailure,
    failure,
    success,
    mapRemoteSuccess
  } from "./Types/Helper";
  import MatterCreation from "./MatterCreation.svelte";
  import { fade, fly } from "svelte/transition";
  import Footer from "./Footer.svelte";
  import { createEventDispatcher, onMount } from "svelte";
import type { Remote } from "./Types/FunctionalType";

  let did: string = getApplicationData("Did");
  const encryptionKey = "bleh";
  const dispatch = createEventDispatcher();

  let matters: Remote<Matter[], Error> = initial;
  let focusMatter: Matter;
  type DisplayMode = "list" | "create";
  let displayMode: DisplayMode = "list";
  let isSideBarFocused: boolean = true;
  $: displayMode =
    isSuccess(matters) && matters.value.length == 0 ? "create" : "list";
  function matterCreated(e: MatterCreated) {
    putMatter(e.matter).then((newMatter) => {
      matters = mapRemoteSuccess(matters, (m) => m.concat(newMatter));
      focusMatter = e.matter;
    });
  }
  function matterClicked(matter: Matter) {
    focusMatter = matter;
    isSideBarFocused = false;
  }
  function matterDeleted(deleted: MatterDeleted) {
    deleteMatterById(deleted.matter.id).then((d) => {
      matters = mapRemoteSuccess(matters, (m) =>
        m.filter((x) => x.id !== d.id)
      );
      if (d.id === focusMatter.id && isSuccess(matters)) {
        focusMatter = matters.value[0];
      }
    });
  }
  function createButtonClicked() {
    displayMode = "create";
  }
  function showSideBarButtonClicked() {
    isSideBarFocused = true;
  }
  function logoutButtonClicked() {
    dispatch("routeEvent", { type: "UserLoggedOut" });
  }
  onMount(load);
  async function load() {
    matters = await listMatter()
      .then(success)
      .catch((_) => failure(new Error("fail to load matters")));
    if (isSuccess(matters)) {
      focusMatter = matters.value[0];
    }
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
        <header class="px-4 md:px-6 lg:px-8 flex">
          <h1 class="font-serif font-semibold text-xl py-4">Desca</h1>
          <button class="ml-auto" on:click|preventDefault={logoutButtonClicked}>
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
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </button>
        </header>
        <section id="sidebarContent" class="flex-1 mt-0 md:mt-4 lg:mt-6">
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
          {#if isSuccess(matters)}
            <ul class="border-b">
              {#each matters.value as matter}
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
          {:else if isFailure(matters)}
            <div class="flex flex-col items-center">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span> Unable to load matters. Please try again later. </span>
            </div>
          {:else}
            <div
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"
            />
          {/if}
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
      {#if focusMatter !== null && focusMatter !== undefined}
        <MatterDetail
          {encryptionKey}
          matter={focusMatter}
          on:MatterDeleted={(e) => matterDeleted(e.detail)}
        >
          <button
            slot="LeftButton"
            class="md:hidden button icon"
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
        </MatterDetail>
      {:else}
        <section
          class="w-full bg-no-repeat bg-center"
          style="background-image:url(images/background-decoration.jpg)"
          transition:fade
        />
      {/if}
      </section>
    </div>
  {/if}
</main>
