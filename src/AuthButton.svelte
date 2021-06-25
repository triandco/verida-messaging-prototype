<script lang="ts" context="module">
  export type UserAuthenticated = { did: string };
  export type AuthProvider = "ethr" | "near";
  export type UserAuthenticatedEvent = { "UserAuthenticated": UserAuthenticated};
</script>

<script type="ts">
  import Verida from "@verida/datastore";
  import {isMetaMaskAvailable, getMetamaskExtensionLink} from "./WalletSupport";
  import { createEventDispatcher } from "svelte";

  export let provider:AuthProvider = "ethr";
  export let applicationName: string;

  const canLogin = isMetaMaskAvailable();

  $: isInvalidApplicationName = applicationName===null || applicationName===undefined || applicationName==="";
  const dispatch = createEventDispatcher<UserAuthenticatedEvent>();

  async function connect(){
    const web3Provider = await Verida.Helpers.wallet.connectWeb3(provider);
    const address = await web3Provider.getAddress(provider);

    Verida.setConfig({ appName: applicationName });

    const app = new Verida({
      chain: provider,
      address: address,
      web3Provider: web3Provider,
    });

		await app.connect(true);
    dispatch("UserAuthenticated", {did: app.user.did});
  }
  const clicked = () => connect().catch(e => {
    if(e.message=="Unable to locate Ethereum"){
      alert("Uh oh, look like something is wrong. Please try again later!");
    }
  })

</script>

{#if canLogin}
<button
  class="bg-green-600 hover:bg-green-400 text-white font-bold py-2 px-4 rounded max-w-max text-lg mx-auto"
  disabled={isInvalidApplicationName}
  on:click={clicked}>Enter</button>
{:else}
<div>
  <p class="text-lg">Metamask is required to login</p>
  <a class="inline-flex items-center bg-green-600 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded max-w-max my-2 text-lg" href={getMetamaskExtensionLink()}>
    Get <img src="images/metamask.webp" alt="metamask" class="w-4 h-4 mx-2 inline-block"/>  Metamask
  </a>
  <br/>
  <a class="hover:underline text-green-600" on:click|preventDefault={()=>window.location.reload()} href="/#">I've got Metamask</a>
</div>
{/if}
