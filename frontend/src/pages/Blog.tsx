import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IBlog } from "../utils/types";
import axios, { AxiosError } from "axios";
import { formatDate } from "../utils/date";
import useAuthState from "../state/useAuthState";

const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ content?: string; other?: string }>({});
  const [comment, setComment] = useState("");
  const {user} = useAuthState();
  
  const fetchBlog = async () => {
    try {
      const response = await axios.get(`/api/v1/blog/${id}`);
      setBlog(response.data?.blog);
    } catch (error) {
      setBlog(null);
      console.log(error);
    }
    setLoading(false);
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post(
        `/api/v1/blog/${id}/comment`,
        { content: comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBlog((prevBlog) => {
        if (!prevBlog) return prevBlog;
        return {
          ...prevBlog,
          comments: prevBlog.comments
            ? [...prevBlog.comments, response.data.comment]
            : [response.data.comment],
        };
      });
      setComment("");
      setError({});
    } catch (error) {
      const e = error as AxiosError<{
        error: {
          content: string;
          other: string;
        };
      }>;
      setError(
        e.response?.data?.error || { other: "An unexpected error occurred" }
      );
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  if (loading) return <>"Loading..."</>;

  if (!blog)
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center mt-5">
        <p className="font-medium text-xl">No such blog exists</p>
      </div>
    );

  return (
    <div className="max-w-4xl w-full mx-auto p-4">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 self-start">
          {blog.title}
        </h1>
        {blog.bannerImage && (
          <img
            src={blog.bannerImage}
            alt="Banner"
            className="w-full h-auto max-h-[80vh] object-cover rounded-lg shadow-md mb-4"
          />
        )}
        <Link
          to={`/profile/${blog.author.id}`}
          className="w-full flex justify-start items-center mb-4 gap-2"
        >
          <img
            src={blog.author.profilePicture || "/images/defaultuser.png"}
            alt={blog.author.username}
            className="w-12 h-12 rounded-full mr-2"
          />
          <div className="text-gray-700 flex flex-col items-start justify-center">
            <p className="text-lg font-medium">{blog.author.username}</p>
            <p className="text-sm text-gray-500">
              {formatDate(blog.createdAt)}
            </p>
          </div>
        </Link>
        <div className="text-lg text-gray-800 leading-relaxed self-start">
          {blog.content}
        </div>
        <div className="w-full mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments</h2>
          <div className="w-full mb-4">
            {blog.comments?.map((comment) => (
              <div key={comment.id} className="mb-4 border-b pb-4">
                <div className="flex items-center mb-2">
                  <img
                    src={
                      comment.author.profilePicture || "/images/defaultuser.png"
                    }
                    alt={comment.author.username}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div className="text-gray-700">
                    <p className="font-medium">{comment.author.username}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="text-gray-800">{comment.content}</p>
              </div>
            ))}
          </div>
          {user && user?.id ? <div className="w-full mt-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Add a comment
            </h3>
            <textarea
              className="w-full border rounded p-2 mb-2"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
           <p className="font-normal text-md lg:text-lg text-red-600 mb-2">{error.content}</p>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={handleCommentSubmit}
            >
              Submit
            </button>
          </div>: <Link to="/signin" className="text-lg font-semibold">You must be logged in to comment.</Link>}
        </div>
      </div>
    </div>
  );
};

export default Blog;
