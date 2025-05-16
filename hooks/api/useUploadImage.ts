import { useState } from "react";

const useUploadMedia = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const uploadMedia = async ({
    file,
    fileType,
  }: {
    file: File;
    fileType: string;
  }) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN

    try {

      console.log("accessToken", accessToken)

        console.log("checkking.")
      const formData = new FormData();
      // formData.append("file", file);
      formData.append("file_type", fileType);

      const res = await fetch(
        `https://graph.facebook.com/v22.0/665739982512922/uploads?file_type=${encodeURIComponent(fileType)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer EAAJdfKsroxoBO39zxdb5Ge9l0qTYXmUZCQn7J3ZBb5YbVZAfZAvu3N2P5GKjZCsF4zoEmhYM77Aovj2yzbj70revHFc1ESQSZCEOUWWN9N3u0fE7Wrpc63Lrx7fHzZCpoPSNo6zru2CkNx7iITnIlZBV4diOy73ijROalTu5mVlK8BTB7ewob4nUIFc6`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Upload failed");
      }

      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { uploadMedia, loading, error, response };
};

export default useUploadMedia;
