
export type UserAuthenticated = { did: string, type: "UserAuthenticated" };
export type UserLoggedout = { type: "UserLoggedOut" };
export type MatterCreated = { matter: Matter, type: "MatterCreated"};
export type MatterDeleted = { matter: Matter, type: "MatterDeleted"};
export type RequestDocumentationCancelled = { type: "RequestDocumentationCancelled"};
export type FileAdded = { files: FileList };

export type AppRouteEvent = UserAuthenticated | UserLoggedout;

export type FileType = "application/msword" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" | "application/pdf" | "image/png" | "image/jpeg";
export type Documentation = { id: string; fileType: FileType, title: string, preview: string | null};
export type Matter = {id: string; title:string; documentation: Documentation[] };

/// async type


