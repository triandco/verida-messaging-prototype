<script lang="ts">
  import { wrap } from "svelte-spa-router/wrap";
  import NotFound from "./NotFound.svelte";
  import Auth from "./Auth.svelte";
  import Dashboard from "./MatterDashboard.svelte";
  import Router, { push, replace } from "svelte-spa-router";
  import type { AppRouteEvent } from "./Type";
  import { incompleteMatchCase } from "./Common";
  import { getApplicationData, saveApplicationData, setApplicationVersion } from "./SimplePersistence";

  export let applicationName: string;
  export let version: string;
  setApplicationVersion(version);
  let did: string = getApplicationData("Did");
  
  const routes = {
    "/": wrap({
      component: Dashboard,
      props: {
        did: did,
      },
      conditions: [(_) => did !== null && did !== undefined],
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
      default:
        incompleteMatchCase(e.type, "Incomplete match case:AppRouteEvent");
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
