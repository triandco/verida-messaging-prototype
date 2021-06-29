<script lang="ts">
import { createEventDispatcher } from "svelte/internal";

  import AuthButton from "./AuthButton.svelte";
  import type { UserAuthenticated } from "./Type";

  export let applicationName: string;
  export let version: string;
  const dispatch = createEventDispatcher();
  const userAuthenticated = (e: UserAuthenticated) => dispatch('routeEvent', {did: e.did, type:"UserAuthenticated"});
</script>

<main
  class="flex flex-col h-screen justify-center bg-right-bottom bg-no-repeat md:"
  style="background-image:url(images/background-decoration.jpg);"
>
  <div
    class="sm:w-full m-w-md md:w-1/3  text-center bg-glass p-8 flex-1 flex justify-center flex-col"
  >
    <header class="my-8">
      <h1 class="text-5xl font-serif">Desca</h1>
      <p class="text-xl">for legal professionals</p>
    </header>
    <AuthButton
      {applicationName}
      on:UserAuthenticated={(x) => userAuthenticated(x.detail)}
    />
    <footer class="my-8 border-t pt-2">
      DEX {version} &copy; OnPoint Compliance {new Date().getFullYear()}
    </footer>
  </div>
</main>
