import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const status = (
          error as { response?: { status?: number }; status?: number }
        ).response?.status;

        const normalizedStatus =
          status ??
          (error as { response?: { status?: number }; status?: number }).status;

        if (normalizedStatus === 429) return false;
        if (
          typeof normalizedStatus === "number" &&
          normalizedStatus >= 400 &&
          normalizedStatus < 500
        ) {
          return false;
        }

        return failureCount < 2;
      },
    },
  },
});
