<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { MatterCreated } from "./Type";
  let matterName: string = "";
  type MatterCreatedEvent = { MatterCreated: MatterCreated };
  const dispatch = createEventDispatcher<MatterCreatedEvent>();
  const formSubmitted = () =>
    dispatch("MatterCreated", {
      matter: { title: matterName, id: "random", documentation: [] },
      type: "MatterCreated",
    });
</script>

<form
  class="flex flex-1 w-full flex-col px-4 md:px-6 lg:px-8 overflow-y-auto"
  on:submit|preventDefault={formSubmitted}
>
  <div class="flex-1 flex flex-col justify-center">
    <label class="text-3xl font-serif mb-2" for="matterName"
      >What's the matter?</label
    >
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
</form>
