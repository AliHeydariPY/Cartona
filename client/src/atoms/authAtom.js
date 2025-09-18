import { atomWithStorage } from "jotai/utils";

export const authAtom = atomWithStorage("isAuthenticated", false);
export const isStorekeeperAtom = atomWithStorage("isStorekeeper", false);