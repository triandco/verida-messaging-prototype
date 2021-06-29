import { incompleteMatchCase } from "./Common";

export type UserAuthenticated = { did: string, type: "UserAuthenticated" };
export type MatterCreated = { matter: Matter, type: "MatterCreated"};

export type AppRouteEvent = UserAuthenticated;

export type FileType = "doc"|"pdf"|"jpg"|"png";
export type Documentation = { id: string; fileType: FileType, title: string};
export type Matter = {id: string; title:string; documentation: Documentation[] };


/// async type

export type RemoteSuccess<T> = { _tag: "success", value: T };
export type RemoteFailure<T> = { _tag: "failure", error: T };
export type RemotePending = { _tag: "pending", };
export type RemoteInitial = { _tag: "initial" };
export type Remote<S,E> =  RemoteSuccess<S> | RemoteFailure<E> | RemotePending | RemoteInitial;

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