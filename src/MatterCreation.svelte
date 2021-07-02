<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { MatterCreated } from "./Type";
  import { v4 as uuid } from "uuid";
  import Footer from "./Footer.svelte";

  let matterName: string = "";
  type MatterCreatedEvent = { MatterCreated: MatterCreated };
  const dispatch = createEventDispatcher<MatterCreatedEvent>();
  const formSubmitted = () =>
    dispatch("MatterCreated", {
      matter: { title: matterName, id: uuid(), documentation: [] },
      type: "MatterCreated",
    });
</script>

<div class="flex w-full h-full">
  <form
    class="flex w-full md:w-96 flex-col px-4 md:px-6 lg:px-8 overflow-y-auto shadow-md"
    on:submit|preventDefault={formSubmitted}
  >
    <h1 class="font-serif font-semibold text-xl py-4">Desca</h1>
    <div class="flex-1 flex flex-col justify-center">
      <div class="w-full h-1/4 md:hidden bg-contain bg-no-repeat bg-top mb-8" style="background-image:url(images/character-decoration.jpg)"></div>
      <label class="text-3xl font-serif mb-2" for="matterName">
        What's the matter?
      </label>
      <input
        class="text-xl border-b p-2 mb-6 bg-transparent"
        placeholder="Enter matter name"
        type="text"
        id="matterName"
        required
        bind:value={matterName}
      />
      <button type="submit" class="button">Create</button>
    </div>
    <p class="text-lg text-gray-400 font-semibold">Organise work, focus on things that matter</p>
    <div class="text-sm border-t mt-2 md:mt-4 py-2 md:py-4 flex">
      <Footer />
    </div>
  </form>
  <div class="flex-1 justify-center bg-no-repeat bg-center bg-cover" style="background-image:url(images/background-decoration.jpg)">
  </div>
</div>
