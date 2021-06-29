<script lang="ts">
  import type { Matter } from "./Type";
  export let matters:Matter[];
</script>

<section class="flex flex-1 flex-col">
<header class="flex justify-between p-2 md:p-4">
  <h2 class="text-2xl">Matter</h2>
  <button class="button icon">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </button>
</header>
<ul class="border-b">
  {#each matters as matter}
  <li class="p-4 border-t cursor-pointer">
    {matter.title}
  </li>
  {/each}
</ul>
</section>