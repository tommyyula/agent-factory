import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification } from '../shared/types/common.types';

interface UIStore {
  // Layout state
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  
  // Modal state
  activeModals: string[];
  modalData: Record<string, any>;
  
  // Notification state
  notifications: Notification[];
  
  // Loading state
  globalLoading: boolean;
  loadingTasks: Record<string, string>; // taskId -> message
  
  // Search state
  globalSearchOpen: boolean;
  globalSearchQuery: string;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  
  // Modal actions
  openModal: (modalId: string, data?: any) => void;
  closeModal: (modalId: string) => void;
  closeAllModals: () => void;
  getModalData: (modalId: string) => any;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Loading actions
  setGlobalLoading: (loading: boolean) => void;
  addLoadingTask: (taskId: string, message: string) => void;
  removeLoadingTask: (taskId: string) => void;
  
  // Search actions
  toggleGlobalSearch: () => void;
  setGlobalSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarCollapsed: false,
      sidebarWidth: 256,
      activeModals: [],
      modalData: {},
      notifications: [],
      globalLoading: false,
      loadingTasks: {},
      globalSearchOpen: false,
      globalSearchQuery: '',

      // Layout actions
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      setSidebarWidth: (width) => set({ sidebarWidth: width }),

      // Modal actions
      openModal: (modalId, data) => set((state) => ({
        activeModals: [...state.activeModals, modalId],
        modalData: data ? { ...state.modalData, [modalId]: data } : state.modalData
      })),
      
      closeModal: (modalId) => set((state) => ({
        activeModals: state.activeModals.filter(id => id !== modalId),
        modalData: Object.fromEntries(
          Object.entries(state.modalData).filter(([key]) => key !== modalId)
        )
      })),
      
      closeAllModals: () => set({ 
        activeModals: [], 
        modalData: {} 
      }),
      
      getModalData: (modalId) => {
        const state = get();
        return state.modalData[modalId];
      },

      // Notification actions
      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification: Notification = {
          ...notification,
          id,
          createdAt: new Date(),
          read: false
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications]
        }));
        
        // Auto remove success notifications after 5 seconds
        if (notification.type === 'success') {
          setTimeout(() => {
            get().removeNotification(id);
          }, 5000);
        }
      },
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        )
      })),
      
      clearNotifications: () => set({ notifications: [] }),

      // Loading actions
      setGlobalLoading: (loading) => set({ globalLoading: loading }),
      
      addLoadingTask: (taskId, message) => set((state) => ({
        loadingTasks: { ...state.loadingTasks, [taskId]: message },
        globalLoading: Object.keys(state.loadingTasks).length === 0
      })),
      
      removeLoadingTask: (taskId) => set((state) => {
        const newTasks = { ...state.loadingTasks };
        delete newTasks[taskId];
        return {
          loadingTasks: newTasks,
          globalLoading: Object.keys(newTasks).length > 0
        };
      }),

      // Search actions
      toggleGlobalSearch: () => set((state) => ({ 
        globalSearchOpen: !state.globalSearchOpen 
      })),
      
      setGlobalSearchQuery: (query) => set({ globalSearchQuery: query })
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ 
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarWidth: state.sidebarWidth
      })
    }
  )
);