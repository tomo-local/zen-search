import type * as Type from "./types";

export default interface TabService {
  query: (request: Type.QueryTabsRequest) => Promise<Type.Tab[]>;
  create: (request: Type.CreateTabRequest) => Promise<void>;
  update: (request: Type.UpdateTabRequest) => Promise<void>;
  remove: (request: Type.RemoveTabRequest) => Promise<void>;
}
