import { QueryClient } from "@tanstack/react-query";

/**
 * Global konfiguration för React Query.
 *
 * - retry: antal omförsök vid fel
 * - refetchOnWindowFocus: förhindrar auto-refetch vid tab-focus
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});