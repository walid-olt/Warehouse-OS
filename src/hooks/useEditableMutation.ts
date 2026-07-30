// hooks/useEditableMutation.ts
import {
  type QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

interface UseEditableMutationOptions<
  TData = unknown,
  TVariables = string,
  TError = Error,
> {
  /** The TanStack Query key to invalidate on success */
  queryKey?: QueryKey;
  /** The async function that performs the update */
  mutationFn: (newValue: TVariables) => Promise<TData>;
  /** Optional success message to display via toast */
  successMessage?: string;
  /** Optional fallback error message */
  errorMessage?: string;
  /** Callback fired after successful mutation and query invalidation */
  onSuccess?: (data: TData, variables: TVariables) => void;
  /** Callback fired on mutation failure */
  onError?: (error: TError, variables: TVariables) => void;
}

export function useEditableMutation<
  TData = unknown,
  TVariables = string,
  TError = Error,
>({
  queryKey,
  mutationFn,
  successMessage,
  errorMessage,
  onSuccess,
  onError,
}: UseEditableMutationOptions<TData, TVariables, TError>) {
  const queryClient = useQueryClient();

  const mutation = useMutation<TData, TError, TVariables>({
    mutationFn,
    onSuccess: (data, variables) => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey });
      }

      if (successMessage) {
        toast.success(successMessage);
      }

      onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      const fallbackMsg =
        error instanceof Error ? error.message : "Failed to save changes";
      toast.error(errorMessage || fallbackMsg);

      // 2. Call optional user callback
      onError?.(error, variables);
    },
  });

  return {
    fieldProps: {
      onSave: (newValue: TVariables) => mutation.mutateAsync(newValue),
      isLoading: mutation.isPending, // TanStack Query v5 (use `mutation.isLoading` if on v4)
    },
    mutation,
  };
}
