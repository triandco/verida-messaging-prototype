<script lang="ts">
  import type { Matter, FileType } from "./Type";

  export let matter: Matter;
  function getIcon(type: FileType):string{
    return `images/icon-${type}.png`;
  }

  const requestDocumentationClicked = ()=> alert("click");
</script>

<section class="flex-1 p-4 md:p-6 lg:p-8">
  <header class="mb-8">
    <div class="text-ml font-bold uppercase">Matter</div>
    <h1 class="font-serif text-4xl font-semibold">{matter.title}</h1>
  </header>

  <section>
    <h2 class="text-ml font-bold uppercase border-b pb-2">Documentation</h2>
    {#if matter.documentation.length == 0}
      <p class="mt-16 mb-8 text-center">No documentation available. <br/>
        Request some from your client. 
      </p>
      <button class="mx-auto button block" on:click={requestDocumentationClicked}>Request documentation</button>
    {:else}
    <ul>
      {#each matter.documentation as documentation}
        <li>
          <img src={getIcon(documentation.fileType)} alt={documentation.fileType} />
          <span>{documentation.title}</span>
        </li>
      {/each}
    </ul>
    {/if}
  </section>
</section>