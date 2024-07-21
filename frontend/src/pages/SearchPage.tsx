import { useSearchParams } from "react-router-dom";
import { IBlog } from "../utils/types";
import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import axios from "axios";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const searchQuery = searchParams.get("query");
  
  const fetchBlogs = async () => {
    try {
      const response = await axios.get("/api/v1/blog?search=" + searchQuery);
      setBlogs(response.data?.blogs || []);
    } catch (error) {
      setBlogs([]);
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, [searchQuery]);

  if (loading) return "Loading...";

  return (
    <div className="container mx-auto p-4 flex lg:flex-row gap-4 mt-4">
      <div className="w-full">
        <h2 className="text-xl font-normal mb-4">
          Showing search results for <span className="font-semibold">{searchQuery}</span>
        </h2>
        {blogs.map((blog, index) => (
          <BlogCard key={index} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default Search;
