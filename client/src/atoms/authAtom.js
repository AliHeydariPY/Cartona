import { atomWithStorage } from "jotai/utils";

export const authAtom = atomWithStorage("isAuthenticated", true);
export const isStorekeeperAtom = atomWithStorage("isStorekeeper", false);