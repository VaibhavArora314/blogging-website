import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IBlog } from "../utils/types";
import axios, { AxiosError } from "axios";

const Blog = () => {
  const {id} = useParams();
  const [blog,setBlog] = useState<IBlog | null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`/api/v1/blog/${id}`);
      setBlog(response.data?.blog);
    } catch (error) {
      const e = error as AxiosError<{error:string}>
      setBlog(null);
      setError(e.response?.data?.error || "An unexpected error occurred");
      console.log(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchBlog();
  },[])

  if (loading) return <>"Loading..."</>;

  if (!blog || error) return <>{error}</>;

  return (
    <div className="max-w-4xl w-full mx-auto p-4">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 self-start">{blog.title}</h1>
        {blog.bannerImage && <img
          src={blog.bannerImage}
          alt="Banner"
          className="w-full h-auto object-cover rounded-lg shadow-md mb-4"
        />}
        <div className="w-full flex justify-start items-center mb-4 gap-2">
          <img
            src={blog.author.profilePicture}
            alt={blog.author.username}
            className="w-12 h-12 rounded-full mr-2"
          />
          <div className="text-gray-700 flex flex-col items-start justify-center">
            <p className="text-lg font-medium">{blog.author.username}</p>
            <p className="text-sm text-gray-500">{blog.createdAt}</p>
          </div>
        </div>
        <div className="text-lg text-gray-800 leading-relaxed self-start">
          {blog.content}
        </div>
      </div>
    </div>
  );
};

export default Blog;
