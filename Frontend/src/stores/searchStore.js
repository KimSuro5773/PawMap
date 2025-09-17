import { create } from "zustand";

const useSearchStore = create((set) => ({
  lastSearchKeyword: "",
  searchHistory: [],

  setLastSearchKeyword: (keyword) =>
    set((state) => ({
      lastSearchKeyword: keyword,
      searchHistory: [
        keyword,
        ...state.searchHistory.filter((item) => item !== keyword),
      ].slice(0, 5), // 최대 10개까지만 저장
    })),

  clearSearchHistory: () => set({ searchHistory: [] }),

  removeFromHistory: (keyword) =>
    set((state) => ({
      searchHistory: state.searchHistory.filter((item) => item !== keyword),
    })),
}));

export default useSearchStore;
