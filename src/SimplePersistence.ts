export type PersistenceKey = "VersionKey" | "Did";

export function setApplicationVersion(version:string){
  if(version !== window.localStorage.getItem("VersionKey")){
    window.localStorage.clear();
    window.localStorage.setItem("VersionKey", version);
  }
}

export function saveApplicationData(key:PersistenceKey, value:string){
  window.localStorage.setItem(key, value);
}

export function getApplicationData(key:PersistenceKey): string{
  return window.localStorage.getItem(key);
}