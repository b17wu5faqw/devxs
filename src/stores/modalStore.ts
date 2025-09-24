import { create } from "zustand";

interface ModalStore {
  modals: { [key: string]: boolean };
  openModal: (type: string) => void;
  closeModal: (type: string) => void;
  isModalOpen: (type: string) => boolean;
}

const useModalStore = create<ModalStore>((set, get) => ({
  modals: {},
  openModal: (type) =>
    set((state) => ({
      modals: { ...state.modals, [type]: true },
    })),
  closeModal: (type) =>
    set((state) => ({
      modals: { ...state.modals, [type]: false },
    })),
  isModalOpen: (type) => get().modals[type] ?? false, // Mặc định là false
}));

export default useModalStore;
