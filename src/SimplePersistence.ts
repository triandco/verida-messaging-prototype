import type { Matter } from "./Types/Type";
export type PersistenceKey = "VersionKey" | "Did" | "Matters";

export function setApplicationVersion(version:string){
  if(version !== window.localStorage.getItem("VersionKey")){
    window.localStorage.clear();
    window.localStorage.setItem("VersionKey", version);
  }
}

export function saveApplicationData(key:PersistenceKey, value:string){
  window.localStorage.setItem(key, value);
}

export function deleteApplicationData(){
  window.localStorage.clear();
}

export function getApplicationData(key:PersistenceKey): string{
  return window.localStorage.getItem(key);
}

export async function putMatter(matter:Matter): Promise<Matter>{
  const items = await listMatter();
  items.push(matter);
  window.localStorage.setItem("Matters", JSON.stringify(items));
  return matter;
}
export function listMatter(): Promise<Matter[]>{
  const data = window.localStorage.getItem("Matters");
  return Promise.resolve(data===null? []: JSON.parse(data) as Matter[])
}

export async function deleteMatterById(matterId: string): Promise<Matter>{
  const items = await listMatter();
  const leftOver = items.filter(x => x.id !== matterId);
  const deleted = items.find(x=> x.id===matterId);
  window.localStorage.setItem("Matters", JSON.stringify(leftOver));
  return deleted;
}