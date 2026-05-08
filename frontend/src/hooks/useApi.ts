import useSWR from 'swr';
import api from '@/lib/api';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useCommunities() {
  const { data, error, isLoading, mutate } = useSWR('/communities/communities/', fetcher);
  return {
    communities: data,
    isLoading,
    isError: error,
    mutate
  };
}

export function useDevices() {
  const { data, error, isLoading, mutate } = useSWR('/devices/microcontrollers/', fetcher);
  return {
    devices: data,
    isLoading,
    isError: error,
    mutate
  };
}

export function useTanks() {
  const { data, error, isLoading, mutate } = useSWR('/devices/tanks/', fetcher);
  return {
    tanks: data,
    isLoading,
    isError: error,
    mutate
  };
}

export function useAlerts() {
  const { data, error, isLoading, mutate } = useSWR('/alerts/alerts/', fetcher);
  return {
    alerts: data,
    isLoading,
    isError: error,
    mutate
  };
}

export function useHouseholds() {
  const { data, error, isLoading, mutate } = useSWR('/communities/households/', fetcher);
  return {
    households: data,
    isLoading,
    isError: error,
    mutate
  };
}
