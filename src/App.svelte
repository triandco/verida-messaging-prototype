<script lang="ts">
  import AuthButton, { UserAuthenticated } from "./AuthButton.svelte";
  export let applicationName: string;
  export let version: string;

  let did: string;
  const userAuthenticated = (e: UserAuthenticated) => did = e.did;
</script>

<main class="flex flex-col h-screen justify-center bg-right-bottom bg-no-repeat md:" style="background-image:url(images/background-decoration.jpg);">
  <div class="sm:w-full m-w-md md:w-1/3  text-center backdrop-blur-xl backdrop-filter bg-white bg-opacity-50 p-8 flex-1 flex justify-center flex-col">
    <header class="my-8">
      <h1 class="text-5xl font-serif">Desca</h1>
      <p class="text-xl">for legal professionals</p>
    </header>
    {#if did !== undefined && did !== null}
    Welcome {did}
    {:else}
      <AuthButton applicationName={applicationName} on:UserAuthenticated={x => userAuthenticated(x.detail)} />
    {/if}
    <footer class="my-8 border-t pt-2">DEX {version} &copy; OnPoint Compliance { new Date().getFullYear()}</footer>
  </div>
</main>

