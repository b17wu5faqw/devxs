import { create } from "zustand";
import { MODAL } from '@/constant/modal';

type ModalType = typeof MODAL[keyof typeof MODAL];

interface ModalData {
  gameTitle?: string;
  [key: string]: any;
}

interface ModalStore {
  modalType: ModalType | null;
  modalData: ModalData | null;
  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;
  isModalOpen: (type: ModalType) => boolean;
  getModalData: () => ModalData | null;
}

const getCurrentPathname = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.pathname;
  }
  return '/';
};

const shouldBlockModal = (type: ModalType): boolean => {
  const currentPath = getCurrentPathname();
  if (type === MODAL.BETTING_CLOSED && currentPath === '/') {
    return true;
  }
  
  return false;
};

const useModalStore = create<ModalStore>((set, get) => ({
  modalType: null,
  modalData: null,
  openModal: (type, data) => {
    if (shouldBlockModal(type)) {
      return;
    }
    
    set({ modalType: type, modalData: data || null });
  },
  closeModal: () => set({ modalType: null, modalData: null }),
  isModalOpen: (type) => get().modalType === type,
  getModalData: () => get().modalData,
}));

export default useModalStore;
