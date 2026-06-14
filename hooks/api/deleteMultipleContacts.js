import axios from "axios";

 const deleteMultipleContacts = async (contactIds) => {
    const API_BASE_URL = "https://bizwapp-backend-production-2354.up.railway.app"
     try {
    
    const response = await axios.delete(
      `${API_BASE_URL}/api/auth/delete-multiple-contacts`,
      {
        data: { contactIds },
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting contacts:", error);
    throw error;
  }
}

export default deleteMultipleContacts;