import axios from "axios";

const API_BASE_URL = "https://api.bizwapp.com";

// Get comprehensive stats by userId
 const getUserStats = async (userId) => {
  try {
    
    const response = await axios.get(
      `${API_BASE_URL}/api/auth/get-dashboard-analytics/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};

export default getUserStats;