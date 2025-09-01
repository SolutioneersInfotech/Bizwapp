// hooks/usePutData.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const usePutData = (url: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.put(url, data, { withCredentials: true })
      return response.data
    },
    onSuccess: () => {
      // automatically refetch data after PUT
      queryClient.invalidateQueries()
    },
    onError: (error) => {
      console.error("PUT request failed:", error)
    },
  })
}

export default usePutData
