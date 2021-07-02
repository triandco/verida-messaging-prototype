<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import {
    match,
    pending,
    Remote,
    RequestDocumentationCancelled,
  } from "./Type";
  import { initial, success } from "./Type";

  type SecurityCode = { code: string; expiration: Date };
  type RequestDocumentationCancelledEvent = {
    RequestDocumentationCancelled: RequestDocumentationCancelled;
  };
  let emailAddress: string;
  let securityCode: Remote<SecurityCode, Error> = initial;
  let isViewingSecurityDetail = false;

  const dispatch = createEventDispatcher<RequestDocumentationCancelledEvent>();
  function formSubmitted() {
    console.log("send email");
  }
  async function getSecurityCode() {
    securityCode = pending;
    window.setTimeout(() => {
      securityCode = success({ code: "🎃🧧🎭🎪", expiration: new Date() });
    }, 1000);
  }
  function securityCodeClicked() {
    isViewingSecurityDetail = true;
  }
  function chevronClicked() {
    if (isViewingSecurityDetail) {
      isViewingSecurityDetail = false;
    } else {
      dispatch("RequestDocumentationCancelled", {type:"RequestDocumentationCancelled"});
    }
  }
  function resetSecurityCodeClicked() {
    getSecurityCode();
  }
  function getDisplayString(r: Remote<SecurityCode, Error>) {
    return match(
      r,
      (x) => x.code,
      (x) => x.message,
      () => "-",
      () => "Generating..."
    );
  }
  onMount(getSecurityCode);
</script>

<section>
  <nav class="border-b">
    <button class="p-2" on:click={chevronClicked}>
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
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  </nav>
  <section class="relative">
    {#if !isViewingSecurityDetail}
      <div
        class="absolute flex flex-col inset-0 w-full h-full bg-white z-0"
        transition:fade
      >
        <header class="p-4" transition:fly>
          <h3 class="font-serif text-2xl">Request documentation</h3>
          <p>
            Send a request documentation from your client. The documentation
            they uploaded will be encrypted can only be accessed by you.
          </p>
        </header>

        <form
          on:submit|preventDefault={formSubmitted}
          class="border-t border-b p-4 flex content-between"
        >
          <label for="email">Email</label>
          <input
            class="ml-4 flex-1 text-left"
            id="email"
            bind:value={emailAddress}
            type="email"
            required
            placeholder="Email address"
          />
        </form>

        <button on:click={securityCodeClicked} class="border-b p-4 flex">
          <strong>Security code</strong>
          <span class="ml-4 flex-1 text-right">
            {getDisplayString(securityCode)}
          </span>
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <button class="button m-4" type="submit" on:click={formSubmitted}
          >Send</button
        >
      </div>
    {:else}
      <div
        class="absolute bg-white z-10 inset-0 w-full h-full p-4"
        transition:fly={{duration:200, x:100}}
      >
        <h4 class="font-serif text-2xl">Security code</h4>
        <p>
          Each documentation request is created with a unique security code that
          only you and your client has. The security code for this request is:
        </p>
        <div class="border rounded my-4 flex">
          <span
            class="text-center text-2xl my-4 flex-1"
            style="letter-spacing: 0.5rem;"
            >{getDisplayString(securityCode)}</span
          >
          <button class="button" on:click={resetSecurityCodeClicked}
            >Reset</button
          >
        </div>
        <p>
          The client can optionally confirm this code with you to verify the
          authenticity of the documentation request before they upload their
          documentation.
        </p>
      </div>
    {/if}
  </section>
</section>
