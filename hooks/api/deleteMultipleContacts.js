import axios from "axios";

 const deleteMultipleContacts = async (contactIds) => {
    const API_BASE_URL = "https://api.bizwapp.com"
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