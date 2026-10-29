import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import type { CraftRequest, UserRole } from '../types/api';

export function useRequestList(role?: UserRole) {
  const [requests, setRequests] = useState<CraftRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getRequests(role);
      setRequests(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, error, refetch: fetchRequests };
}

export function useSingleRequest(id: string | undefined) {
  const [request, setRequest] = useState<CraftRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOne = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await api.getRequestById(id);
      setRequest(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load request');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOne();
  }, [fetchOne]);

  return { request, loading, error, refetch: fetchOne };
}
