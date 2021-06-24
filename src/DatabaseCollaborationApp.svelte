<script type="ts">
  import Verida from "@verida/datastore";
  let appName: string = "DatabaseCollaboration App2";
  let provider: string = "near";
  let app: any;
  let userDid: string;
  let databaseName: string = "exampleDocument";
  let externalDatabaseName: string = "exampleDocument";
  let databaseDid: string;
  let writeContent: string;
  let databaseContent: any;
  let externalDatabaseContent: any;
  let invitedUser: string;

  async function connectToApp() {
    const web3Provider = await Verida.Helpers.wallet.connectWeb3(provider, {
      contractName: "test",
    });
    const address = await web3Provider.getAddress(provider);

    Verida.setConfig({
      appName: appName,
    });

    app = new Verida({
      chain: provider,
      address: address,
      web3Provider: web3Provider,
    });

    await app.connect(true);
    userDid = app.user.did;
    console.log(app.user);
  }

  async function getDatabaseContent() {
    let database = await app.openDatabase(databaseName, {
      appName: appName,
      permissions: {
        "read": "public",
        "write": "users"
      }
    });
    databaseContent = await database.permissions;
  }
  async function getExternalDatabaseContent() {
    let database = await app.openExternalDatabase(externalDatabaseName, databaseDid, {
      appName: appName,
      readOnly: true,
      permissions: {
        "read": "public",
        "write": "user"
      }
    });
    externalDatabaseContent = await database.getMany();
  }
  async function addUser(){
    let database = await app.openDatabase(databaseName, userDid, {
      appName: appName,
      permissions: {
        "read": "public",
        "write": "user"
      }
    });
    await database.updateUsers([invitedUser]);
  }

  async function writeToDatabase() {}
  const refreshButtonClicked = getDatabaseContent;
  const externalDatabaseQueryFormSubmitted = getExternalDatabaseContent;
  const connectFormSubmited = connectToApp;
  const writeFormSubmitted = writeToDatabase;
  const addUserFormSubmitted = addUser;
</script>

<form on:submit|preventDefault={connectFormSubmited}>
  <label for="applicationName">Application Name</label>
  <input id="applicationName" type="text" bind:value={appName} required />
  <button type="submit">Connect</button>
</form>
{#if userDid === undefined || userDid === null}
  <p>Not connected to {appName}</p>
{:else}
  <p>Welcome to {appName}, <strong>{userDid}</strong></p>
{/if}



<div style="border-top: 1px solid #333;">
  <h2>Owned Database</h2>
  <label for="databasename">Database Name</label>
  <input id="databasename" type="text" bind:value={databaseName} required /><br/>
  <button on:click={refreshButtonClicked}>Refresh</button>
  <h3>Permissions</h3>
  <div style="background: #aaa;padding: 1em; ">
    {JSON.stringify(databaseContent)}
  </div>
  <h3>Add user</h3>
  <form on:submit|preventDefault={addUserFormSubmitted}>
    <label for="invitedUserDid">Did</label>
    <input for="invitedUserDid" type="text" bind:value={invitedUser} />
    <button type="submit">Add</button>
  </form>
  
</div>

<div style="border-top: 1px solid #333;">
  <h2>External database</h2>
  <form on:submit|preventDefault={externalDatabaseQueryFormSubmitted}>
    <label for="databaseDid">Did</label>
    <input id="databaseDid" type="text" bind:value={databaseDid} required /><br />
    <label for="">External database</label>
    <input id="externalDatabaseName" bind:value={externalDatabaseName} required /><br/>
    <button type="submit" >Load</button>
  </form>
  <textarea>
    {externalDatabaseContent}
  </textarea>
  <form on:submit|preventDefault={writeFormSubmitted}>
    <label for="content">Content</label>
    <input id="content" type="text" bind:value={writeContent} required /><br />
    <button type="submit">Write</button>
  </form>

</div>
