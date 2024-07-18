const uploadImage = async (
  CLOUD_NAME: string,
  UPLOAD_PRESET_NAME: string,
  file: string | File
): Promise<string> => {
  try {
    const url =
      "https://api.cloudinary.com/v1_1/" + CLOUD_NAME + "/image/upload";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET_NAME);
    formData.append("cloud_name", CLOUD_NAME);

    const response = await fetch(url, {
      method: "post",
      body: formData,
    });
    const result: any = await response.json();
    return result?.url;
  } catch (error) {
    console.log("Error while uploading image!");
    return "";
  }
};

export default uploadImage;