import axios from "axios";

const API_URL = "https://api.bizwapp.com"; // backend ka base url

// delete by userId
 const clearNotification = async (userId) => {
  try {
    const res = await axios.delete(`${API_URL}/api/auth/clearNotification/${userId}`);
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { message: err.message };
  }
};

export default clearNotification;