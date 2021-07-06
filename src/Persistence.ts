import {v4 as uuid} from "uuid";

export type FileKey = string;
export type StoreFile = (file: File, encryptionKey:string) => Promise<FileKey>;

export const mockStoreFile:StoreFile = (file, key)=>{
  return new Promise((resolve, _) => window.setTimeout(()=>resolve(uuid()), 1000));
};

