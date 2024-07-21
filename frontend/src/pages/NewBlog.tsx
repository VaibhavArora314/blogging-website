import { useEffect, useRef, useState } from "react";
import TextEditor from "../components/TextEditor";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { createBlogType } from "@vaibhav314/blogging-common";

const NewBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string>("");
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const [error, setError] = useState<Partial<Pick<createBlogType, "title" | "content"> & {image: string, other:string}>>({});

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [title]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
    setTitle(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImage(file);
      setBannerImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePublish = async () => {
    console.log(title, description, bannerImage);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", description);

      if (bannerImage) formData.append("image", bannerImage);

      const response = await axios.post("/api/v1/blog", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const blogId = response.data?.blog?.id;
      navigate(`/blog/${blogId}`);
    } catch (error) {
      const e = error as AxiosError<{ error: Partial<Pick<createBlogType, "title" | "content"> & {image: string, other:string}> }>;
      setError(e.response?.data.error || { other: "An unexpected error occurred" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full p-4 pt-8">
      <div className="container w-full">
        {error?.other && (
          <div className="mb-4 text-red-500">
            {error.other}
          </div>
        )}
        <div className="flex justify-between mb-2">
          <h2 className="font-medium text-lg lg:text-2xl">New Post</h2>
          <button
            onClick={handlePublish}
            type="submit"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >
            Publish
          </button>
        </div>
        <input
          onChange={handleTitleChange}
          className="outline-none block w-full px-0 text-xl lg:text-2xl text-gray-800 border-0 overflow-hidden resize-none mb-2"
          placeholder="Title"
        />
        {error.title && (
          <div className="mb-2 text-red-500">
            {error.title}
          </div>
        )}
        <label
          htmlFor="banner"
          className="font-normal text-lg lg:text-xl text-gray-900"
        >
          Banner:{" "}
        </label>
        <input
          id="banner"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="outline-none block w-full py-2 text-lg lg:text-xl text-gray-800 border-0 rounded-md mb-2"
        />
        {bannerImagePreview && (
          <img
            src={bannerImagePreview}
            alt="Banner Preview"
            className="h-40 rounded-md"
          />
        )}
                {error?.image && (
          <div className="mb-2 text-red-500">
            {error.image}
          </div>
        )}

        <TextEditor
          onChange={(desc) => {
            setDescription(desc);
          }}
        />
        {error.content && (
          <div className="mb-2 text-red-500">
            {error.content}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewBlog;
