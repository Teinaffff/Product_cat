// apiService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const apiService = {
  fetchFolderStructure: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/folders/folder-structure`);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching folder structure");
    }
  },

  fetchPdf: async (folderPath, fileName) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/files/view-pdf`, {
        params: { folderPath, fileName },
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw new Error("Error loading PDF");
    }
  },
};

export default apiService;