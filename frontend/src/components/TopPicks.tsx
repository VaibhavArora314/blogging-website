import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IBlog } from "../utils/types";  
import axios from "axios";
import { formatDate } from "../utils/date";

const TopPicks = () => {
  const [topBlogs, setTopBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopBlogs = async () => {
    try {
      const response = await axios.get('/api/v1/blog?order=like&limit=5');
      setTopBlogs(response.data?.blogs || []);
    } catch (error) {
      setTopBlogs([]);
      console.log(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchTopBlogs();
  }, [])

  if (loading) return "Loading...";

  return (
    <div className="p-4 mb-2">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Trending Blogs</h2>
      <div className="flex flex-col">
        {topBlogs.map((blog, index) => (
          <div key={index} className="mb-4">
            <span className="flex items-center mb-1 gap-1">
              <Link to={`/profile/${blog.author.id}`}>
                <img
                  src={blog.author.profilePicture || "/images/defaultuser.png"}
                  alt={blog.author.username}
                  className="w-6 h-6 rounded-full"
                />
              </Link>
              <p className="text-sm font-normal">
                <Link to={`/profile/${blog.author.id}`} className="font-medium">
                  {blog.author.username}
                </Link>
              </p>
                <span className="hidden sm:inline">•</span>
            <p className="text-sm lg:text-md text-gray-500">
              {formatDate(blog.createdAt)}
            </p>
            </span>
            <Link
              to={`/blog/${blog.id}`}
              className="font-medium text-gray-900 text-md"
            >
              {blog.title.length > 60
                ? blog.title.slice(0, 50) + "..."
                : blog.title}
            </Link>
          </div>
        ))}
      </div>
      <Link to="/search?order=like" className="font-medium text-md text-green-600">See more</Link>
    </div>
  );
};

export default TopPicks;
