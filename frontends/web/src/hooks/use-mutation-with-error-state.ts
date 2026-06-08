import { useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";

export function useMutationWithErrorState<TVariables>(
  mutation: UseMutationResult<unknown, Error, TVariables>,
) {
  const [error, setError] = useState<string | null>(null);

  const execute = async (variables: TVariables) => {
    setError(null);
    try {
      await mutation.mutateAsync(variables);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    }
  };

  const isExecuting = (variables: TVariables) =>
    mutation.isPending && mutation.variables === variables;

  return { execute, error, clearError: () => setError(null), isExecuting };
}
