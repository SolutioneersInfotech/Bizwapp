import axios from "axios";

const API_BASE_URL = "http://localhost:5001";

// Get 5 latest messages by userId
export const getLatestMessages = async (userId) => {
  try {    
    const response = await axios.get(
      `${API_BASE_URL}/api/auth/recent-conversations/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching latest messages:", error);
    throw error;
  }
};

export default getLatestMessages;