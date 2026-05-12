import { useEffect, useCallback } from 'react';
import { useOpeningStore } from '@/store';
import { OpeningCreatePayload, OpeningUpdatePayload } from '@/types';

export function useOpening() {
  const {
    openings,
    formChoices,
    openingsStatus,
    formChoicesStatus,
    createStatus,
    updateStatus,
    deleteStatus,
    openingsError,
    createError,
    updateError,
    fetchOpenings,
    fetchFormChoices,
    createOpening,
    updateOpening,
    deleteOpening,
    clearErrors,
  } = useOpeningStore();

  useEffect(() => {
    if (openingsStatus === 'idle') {
      fetchOpenings();
    }
  }, [openingsStatus, fetchOpenings]);

  useEffect(() => {
    if (formChoicesStatus === 'idle') {
      fetchFormChoices();
    }
  }, [formChoicesStatus, fetchFormChoices]);

  const create = useCallback(
    (payload: OpeningCreatePayload) => createOpening(payload),
    [createOpening]
  );

  const update = useCallback(
    (id: number, payload: OpeningUpdatePayload) => updateOpening(id, payload),
    [updateOpening]
  );

  const remove = useCallback(
    (id: number) => deleteOpening(id),
    [deleteOpening]
  );

  const refresh = useCallback(() => fetchOpenings(), [fetchOpenings]);

  return {
    openings,
    formChoices,
    isLoadingOpenings: openingsStatus === 'loading',
    isCreating: createStatus === 'loading',
    isUpdating: updateStatus === 'loading',
    isDeleting: deleteStatus === 'loading',
    openingsError,
    createError,
    updateError,
    fetchOpenings: refresh,
    createOpening: create,
    updateOpening: update,
    deleteOpening: remove,
    clearErrors,
  };
}
