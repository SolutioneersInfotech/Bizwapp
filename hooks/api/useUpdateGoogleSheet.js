// hooks/api/useUpdateGoogleSheet.js
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateGoogleSheet = async ({ id, updateData }) => {
  const response = await fetch(
    `http://api.bizwapp.com/api/auth/update-google-sheet-config/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update Google Sheet config");
  }

  return response.json();
};

export const useUpdateGoogleSheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGoogleSheet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["googleSheets"] });
    },
    onError: (error) => {
      console.error("❌ Error updating Google Sheet:", error);
    },
  });
};


export default useUpdateGoogleSheet;