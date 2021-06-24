<script lang="ts">
import Verida from "@verida/datastore";

let provider: string = "near";
let appName: string = "Database App";
let dbName: string = "example";
let userDid: string;
let app: any;
let db: any;
const permissions = {
    read: 'public',
    write: 'owner'
};

const connectButtonClicked = connectToApp;

async function connectToApp(){
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
}

async function createDatabase(){
  db = await app.openDatabase(dbName, {
    permissions: permissions
  });
}

const databaseFormSubmitted = createDatabase;
</script>


<label for="appName">App Name</label>
<input id="appName" type="text" bind:value={appName}/>
<button on:click={connectButtonClicked}>Connect</button>
{#if userDid === null || userDid === undefined}
  <p>Not connected to {appName}</p>
{:else}
  <p>Welcome <strong>{userDid}</strong> to {appName}</p>
  
  <form on:submit|preventDefault={databaseFormSubmitted}>
    <h2>Create a or connect to a database</h2>
    <label for="name">Database name</label>
    <input type="text" bind:value={dbName} />
    <label for="permissions">Permissions</label>
    <textarea disabled>{JSON.stringify(permissions)}</textarea><br/>
    <button type="submit">Create</button>
  </form>

  {#if db!==null && db!==undefined}
  <h2>Created permissions</h2>
  <div>
    {JSON.stringify(db.permissions)}
  </div>
  {/if}
{/if}