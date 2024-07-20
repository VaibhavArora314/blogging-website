import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { IBlog } from "../utils/types";  
import axios from "axios";

const BlogList = () => {
  const [blogs,setBlogs] = useState<IBlog[]>([]);
  const [loading,setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('/api/v1/blog');
      setBlogs(response.data?.blogs || []);
    } catch (error) {
      setBlogs([]);
      console.log(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchBlogs();
  },[])

  if (loading) return "Loading...";

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Latest Blogs</h2>
          {blogs.map((blog, index) => (
            <BlogCard
              key={index}
              blog={blog}
            />
          ))}
    </>
  )
}

export default BlogList
