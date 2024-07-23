import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { IBlog } from "../utils/types";  
import axios from "axios";
import Loader from "./Loader";

const BlogList = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBlogs = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/blog?page=${page}`);
      setBlogs(response.data?.blogs || []);
      setTotalPages(response.data?.totalPages || 1);
    } catch (error) {
      setBlogs([]);
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) return <Loader />;

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Latest Blogs</h2>
      {blogs.map((blog, index) => (
        <BlogCard
          key={index}
          blog={blog}
        />
      ))}
      <div className="w-full flex justify-center mt-4">
        <button
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
          className="px-4 py-2 border rounded-l bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 border-t border-b">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
          className="px-4 py-2 border rounded-r bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default BlogList;
