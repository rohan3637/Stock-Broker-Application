import { create } from "zustand";

const useWatchlistsDataStore = create((set) => ({
  watchlists: [],
  updateWatchlists: (watchlists) => set({ watchlists: watchlists }),
}));

export default useWatchlistsDataStore;
