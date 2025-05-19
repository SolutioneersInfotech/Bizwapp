import { useState } from 'react';
import axios from 'axios';

const useFacebookUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const uploadToFacebook = async (file, uploadUrl) => {

    console.log("uploadToFacebookuploadToFacebook");
    setUploading(true); 
    setError(null);
    setResponseData(null);

    console.log("file" , file)
    
    console.log("uploadUrl" , uploadUrl)

    const formData = new FormData(); 
    formData.append('file', file);
    formData.append('uploadUrl', uploadUrl); // This should be like: page-id/photos?access_token=PAGE_ACCESS_TOKEN

    try {
      const res = await axios.post('https://api.bizwapp.com/api/auth/upload-to-fb', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponseData(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadToFacebook,
    uploading,
    error,
    responseData,
  };
};

export default useFacebookUpload;
