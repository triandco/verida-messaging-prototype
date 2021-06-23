<script lang="ts">
  import Verida from "@verida/datastore";
  let appName: string = "File Sending App";
  let userDid: string;
  let app;
  let receiverDid: string = "";
  let sendMessage: string = "Hello world";
  let inboxItem: any;
  let provider = "near";

  async function createDataStore() {
    const web3Provider = await Verida.Helpers.wallet.connectWeb3(provider, {contractName: "test"});
    const address = await web3Provider.getAddress(provider);

    Verida.setConfig({
      appName: appName
    });

    app = new Verida({
      chain: provider,
      address: address,
      web3Provider: web3Provider,
    });

		await app.connect(true);
    userDid = app.user.did;
    app.inbox.on('newMessage', x => inboxItem = x);
  }

  function send(){
    app.outbox.send(
      receiverDid, 
      'inbox/type/dataSend', 
      { 
        data: [
          {
              firstName: 'Vitalik',
              lastName: 'Buterin',
              email: 'me@vitalik.eth',
              schema: 'https://schemas.verida.io/social/contact/schema.json'
          }
      ]
      }, 
      `${userDid} sent you a message`,
      { appName: appName });
  }

  const connectButtonClicked = createDataStore;
  const sendFormSubmitted = send;
</script>

<label for="appName">App Name</label>
<input id="appName" type="text" bind:value={appName}/>
<button on:click={connectButtonClicked}>Connect</button>
{#if userDid}
  <p>Welcome <strong>{userDid}</strong> to {appName}</p>
{:else}
  <p>Not connected to {appName}</p>
{/if}

{#if userDid}
  <form on:submit|preventDefault={sendFormSubmitted} style="border-top: 1px solid #333">
  <label for="to">To</label>
  <input id="to" type="text" bind:value={receiverDid} /><br/>
  <label for="message">Message</label>
  <input id="message"type="text" bind:value={sendMessage} />
  <br />
  <button type="submit">Send</button>
  </form>

  <div style="border-top:1px solid #333">
    <h2>Inbox</h2>
    {#if inboxItem == undefined || inboxItem == null}
    <p>Inbox is empty</p>
    {:else}
    <div>
      {JSON.stringify(inboxItem)}
    </div>
    {/if}
  </div>
{/if}