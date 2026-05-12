import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  Opening,
  OpeningCreatePayload,
  OpeningUpdatePayload,
  FormChoicesResponse,
  RequestStatus,
} from '@/types';
import { openingService } from '@/services';

interface OpeningState {
  openings: Opening[];
  formChoices: FormChoicesResponse | null;

  openingsStatus: RequestStatus;
  formChoicesStatus: RequestStatus;
  createStatus: RequestStatus;
  updateStatus: RequestStatus;
  deleteStatus: RequestStatus;

  openingsError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;

  fetchOpenings: () => Promise<void>;
  fetchFormChoices: () => Promise<void>;
  createOpening: (payload: OpeningCreatePayload) => Promise<Opening | null>;
  updateOpening: (id: number, payload: OpeningUpdatePayload) => Promise<Opening | null>;
  deleteOpening: (id: number) => Promise<boolean>;
  clearErrors: () => void;
}

export const useOpeningStore = create<OpeningState>()(
  devtools(
    (set) => ({
      openings: [],
      formChoices: null,

      openingsStatus: 'idle',
      formChoicesStatus: 'idle',
      createStatus: 'idle',
      updateStatus: 'idle',
      deleteStatus: 'idle',

      openingsError: null,
      createError: null,
      updateError: null,
      deleteError: null,

      fetchOpenings: async () => {
        set({ openingsStatus: 'loading', openingsError: null });
        try {
          const openings = await openingService.getOpenings();
          set({ openings, openingsStatus: 'success' });
        } catch (error: any) {
          set({
            openingsStatus: 'error',
            openingsError: error.response?.data?.error || 'Failed to fetch openings',
          });
        }
      },

      fetchFormChoices: async () => {
        set({ formChoicesStatus: 'loading' });
        try {
          const formChoices = await openingService.getFormChoices();
          set({ formChoices, formChoicesStatus: 'success' });
        } catch {
          set({ formChoicesStatus: 'error' });
        }
      },

      createOpening: async (payload: OpeningCreatePayload) => {
        set({ createStatus: 'loading', createError: null });
        try {
          const opening = await openingService.createOpening(payload);
          set((state) => ({
            openings: [opening, ...state.openings],
            createStatus: 'success',
          }));
          return opening;
        } catch (error: any) {
          set({
            createStatus: 'error',
            createError: error.response?.data?.error || 'Failed to create opening',
          });
          return null;
        }
      },

      updateOpening: async (id: number, payload: OpeningUpdatePayload) => {
        set({ updateStatus: 'loading', updateError: null });
        try {
          const opening = await openingService.updateOpening(id, payload);
          set((state) => ({
            openings: state.openings.map((o) => (o.id === id ? opening : o)),
            updateStatus: 'success',
          }));
          return opening;
        } catch (error: any) {
          set({
            updateStatus: 'error',
            updateError: error.response?.data?.error || 'Failed to update opening',
          });
          return null;
        }
      },

      deleteOpening: async (id: number) => {
        set({ deleteStatus: 'loading' });
        try {
          await openingService.deleteOpening(id);
          set((state) => ({
            openings: state.openings.filter((o) => o.id !== id),
            deleteStatus: 'success',
          }));
          return true;
        } catch {
          set({ deleteStatus: 'error' });
          return false;
        }
      },

      clearErrors: () => {
        set({ openingsError: null, createError: null, updateError: null, deleteError: null });
      },
    }),
    { name: 'opening-store' }
  )
);
