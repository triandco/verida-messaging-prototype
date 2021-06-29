<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { MatterCreated } from "./Type";
  import { v4 as uuid } from "uuid";

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
  </form>
  <div class="flex-1 justify-center bg-no-repeat bg-center bg-contain" style="background-image:url(images/character-decoration.jpg)">
  </div>
</div>
