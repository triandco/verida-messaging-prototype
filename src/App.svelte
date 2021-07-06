<script lang="ts">
  import { wrap } from "svelte-spa-router/wrap";
  import NotFound from "./NotFound.svelte";
  import Auth from "./Auth.svelte";
  import MatterDashboard from "./MatterDashboard.svelte";
  import Router, { push, replace } from "svelte-spa-router";
  import type { AppRouteEvent } from "./Types/Type";
  import { incompleteMatchCase } from "./Common";
  import { deleteApplicationData, getApplicationData, saveApplicationData, setApplicationVersion } from "./SimplePersistence";

  export let applicationName: string;
  export let version: string;
  setApplicationVersion(version);
  let did: string = getApplicationData("Did");
  $: isLoggedIn = did!==null && did!==undefined;
  
  const routes = {
    "/": wrap({
      component: MatterDashboard,
      conditions: ()=>isLoggedIn,
    }),
    
    "/auth": wrap({
      component: Auth,
      props: {
        applicationName: applicationName,
        version: version,
      },
    }),
    "*": NotFound,
  };

  function routeEvent(e: AppRouteEvent) {
    switch (e.type) {
      case "UserAuthenticated":
        did = e.did;
        saveApplicationData("Did", did);
        push("/");
        break;
      case "UserLoggedOut":
        did = null;
        deleteApplicationData();
        push("/auth");
        break;
      default:
        incompleteMatchCase(e, "Incomplete match case:AppRouteEvent");
    }
  }

  function conditionsFailed(e:any){
    replace("/auth");
  }
</script>

<Router
  {routes}
  on:routeEvent={(e) => routeEvent(e.detail)}
  on:conditionsFailed={x => conditionsFailed(x.detail)}
/>
