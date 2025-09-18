import { atomWithStorage } from "jotai/utils";

export const authAtom = atomWithStorage("isAuthenticated", false, sessionStorage);
export const isStorekeeperAtom = atomWithStorage("isStorekeeper", false);