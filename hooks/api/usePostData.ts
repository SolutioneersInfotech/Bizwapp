import { useMutation, UseMutationResult } from "@tanstack/react-query";

// Generic utility: TVariables is the input (formData), TResponse is the output
const usePostData = <TVariables = unknown, TResponse = any>(
  url: string,
  headers: Record<string, string> = { "Content-Type": "application/json" }
): UseMutationResult<TResponse, Error, TVariables> => {

  return useMutation<TResponse, Error, TVariables>({
    mutationFn: async (formData: TVariables): Promise<TResponse> => {
      console.log("Mutation function called with:", formData);

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit data");
      }

      return response.json();
    },
  });
};

export default usePostData;
