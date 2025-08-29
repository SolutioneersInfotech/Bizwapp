"use client"; // Next.js 15 ke liye zaruri

import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteGoogleSheet = () => {
  const queryClient = useQueryClient();

  const deleteSheet = async (sheetId) => {
    const res = await fetch(`https://api.bizwapp.com/api/auth/delete-google-sheet-config/${sheetId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete the Google Sheet.");
    }

    return res.json();
  };

  return useMutation({
    mutationFn: deleteSheet, // v5 me mutationFn use hota hai
    onSuccess: (_, sheetId) => {
      // Cache update
      queryClient.setQueryData(['googleSheets'], (oldData) => {
        return oldData?.filter(sheet => sheet._id !== sheetId);
      });
    },
  });
};
