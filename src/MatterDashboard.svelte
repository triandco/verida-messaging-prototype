<script lang="ts">
  import MatterList from "./MatterList.svelte";
  import MatterDetail from "./MatterDetail.svelte";
  import { getApplicationData } from "./SimplePersistence";
  import type { Matter, MatterCreated } from "./Type";
  import MatterCreation from "./MatterCreation.svelte";

  let did: string = getApplicationData("Did");
  let profile: string = "";
  let currentIndex = 0;
  let matters: Matter[] = [];

  const matterCreated = (e: MatterCreated) => matters = matters.concat(e.matter);
</script>

<main class="flex justify-items-stretch h-screen bg-cover bg-right bg-no-repeat">
  <section class="w-full flex flex-col md:w-96 overflow-hidden bg-glass">
    <header class="max-w-full">
      <nav class="flex w-100 p-2 md:p-4 mb-4 border-b">
        <h1 class="text-lg font-semibold font-serif">Desca</h1>
        <img alt={profile} src="fun" />
      </nav>
    </header>
  {#if matters.length == 0}
      <MatterCreation on:MatterCreated={(e) => matterCreated(e.detail)} />
  {:else}
      <MatterList {matters} />
  {/if}
    <footer class="border-t p-2 md:p-4 text-sm">Desca</footer>
  </section>
  <section class="flex-1 bg-center bg-no-repeat bg-half" >
    {#if matters[currentIndex] !== null && matters[currentIndex] !== undefined}
      <MatterDetail matter={matters[currentIndex]} />
    {:else}
      <img src="images/character-decoration.jpg" alt="Create something new" class="max-h-screen" />
    {/if}

  </section>
</main>
