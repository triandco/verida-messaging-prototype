import { incompleteMatchCase } from "../Common";
import type { Remote, RemoteFailure, RemoteInitial, RemotePending, RemoteSuccess } from "./FunctionalType";
import type { FileType } from "./Type";

export function parseFileType(x:string): FileType | null{
  if(x === "application/msword"){ return x; }
  if(x === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){ return x; }
  if(x === "application/pdf"){ return x; }
  if(x === "image/png"){ return x; }
  if(x === "image/jpeg"){ return x; }
  return null;
}
export function toCommonFileName(x:FileType):string{
  switch(x){
    case "application/msword": return "doc";
    case "application/pdf": return "pdf";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": return "doc";
    case "image/png": return "png";
    case "image/jpeg": return "jpg";
    default: incompleteMatchCase(x, "commonFileNameMap incomplete match");
  }
}

export const initial:RemoteInitial = { _tag: "initial"};
export const pending:RemotePending = { _tag: "pending"};
export const success = <T>(value:T): RemoteSuccess<T> => ({_tag:"success", value:value});
export const failure = <T>(value:T): RemoteFailure<T> => ({_tag:"failure", error:value});

export const isSuccess = <S,E>(r:Remote<S,E>): r is RemoteSuccess<S> => r._tag == "success";
export const isFailure = <S,E>(r:Remote<S,E>): r is RemoteFailure<E> => r._tag == "failure";
export const isPending = <S,E>(r:Remote<S,E>): r is RemotePending => r._tag == "pending";
export const isInitial = <S,E>(r:Remote<S,E>): r is RemoteInitial => r._tag == "initial";

export const match = <S,E,T>(r:Remote<S,E>, s:(s:S)=>T, f:(e:E)=>T,i:()=>T,p:()=>T): T =>{
  let t:T;
  switch(r._tag){
    case "success":
      t = s(r.value);
      break;
    case "failure":
      t = f(r.error);
      break;
    case "initial":
      t = i();
      break;
    case "pending":
      t = p();
      break;
    default:
      incompleteMatchCase(r);
      break;
  }
  return t;
};

export const mapRemoteSuccess = <S1,S2,E>(remote:Remote<S1,E>, f:(s1:S1)=>S2): Remote<S2,E> =>
  isSuccess(remote) ? success(f(remote.value)): remote;