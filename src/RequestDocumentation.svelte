<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import type { Remote } from "./Types/FunctionalType";
  import {
    match,
    pending,
    initial,
    success,
    isSuccess,
    isFailure,
  } from "./Types/Helper";
  import type { RequestDocumentationCancelled } from "./Types/Type";

  type SecurityCode = { code: string; expiration: Date };
  type RequestDocumentationCancelledEvent = {
    RequestDocumentationCancelled: RequestDocumentationCancelled;
  };
  let securityCode: Remote<SecurityCode, Error> = initial;
  let isViewingSecurityDetail = false;
  let invitationContainer: HTMLElement;
  let invitationLink: Remote<string, Error> = initial;

  const dispatch = createEventDispatcher<RequestDocumentationCancelledEvent>();
  function okButtonClicked() {
    dispatch("RequestDocumentationCancelled", {
      type: "RequestDocumentationCancelled",
    });
  }
  async function getInvitationLink() {
    invitationLink = pending;
    window.setTimeout(() => {
      invitationLink = success("https://desca.app/somethingsomethingdarksie");
    }, 1000);
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
    isViewingSecurityDetail = false;
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
  function copyButtonClicked() {
    window.getSelection().removeAllRanges();
    let range = document.createRange();
    range.selectNode(invitationContainer);
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
  }
  onMount(() => {
    getSecurityCode();
    getInvitationLink();
  });
</script>

<section>
  {#if !isViewingSecurityDetail}
    <div class="flex flex-col inset-0 w-full h-full z-0">
      <header class="p-4">
        <h3 class="font-semibold text-xl">Request documentation</h3>
        <p class="mt-2">
          Send a request documentation from your client. The documentation they
          uploaded will be encrypted can only be accessed by you.
        </p>
      </header>

      {#if isSuccess(invitationLink)}
        <div class="border rounded flex flex-col mx-4">
          <div class="items-center p-4" bind:this={invitationContainer}>
            <p>Hello there,</p>
            <p class="my-2">
              You are requested to share the documentation for a matter. Please
              follow this link to upload your documentation.
            </p>
            <a class="my-4 block" href="https://desca.com"
              ><strong>desca.com/somerandomlongtextstring</strong></a
            >
            <p>Thank you,</p>
          </div>
          <button
            class="text-right border-t font-font-semibold p-3"
            on:click={copyButtonClicked}>Copy</button
          >
        </div>
      {:else if isFailure(invitationLink)}
        <p>Unable to get invitation code please try again later</p>
      {:else}
        <div
          aria-label="Generating invitation. Please wait"
          class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mx-auto block"
        />
      {/if}

      <button
        on:click={securityCodeClicked}
        class="border-b border-t m-4 py-4 flex"
      >
        <strong>Security code</strong>
        <span class="ml-4 flex-1 text-right">
          {getDisplayString(securityCode)}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 ml-2"
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

      <button class="md:hidden button m-4" on:click={okButtonClicked}>Ok</button
      >
    </div>
  {:else}
    <div class="z-10 inset-0 w-full h-full">
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
      <section class="p-4">
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
      </section>
    </div>
  {/if}
</section>
