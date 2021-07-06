export type RemoteSuccess<T> = { _tag: "success", value: T };
export type RemoteFailure<T> = { _tag: "failure", error: T };
export type RemotePending = { _tag: "pending", };
export type RemoteInitial = { _tag: "initial" };
export type Remote<S,E> =  RemoteSuccess<S> | RemoteFailure<E> | RemotePending | RemoteInitial;