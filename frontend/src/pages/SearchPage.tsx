import { useSearchParams } from "react-router-dom";
import { IBlog } from "../utils/types";
import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import axios from "axios";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [order, setOrder] = useState(searchParams.get("order") || "date");
  const searchQuery = searchParams.get("query") || "";

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/v1/blog?search=${searchQuery}&page=${page}&order=${order}`
      );
      setBlogs(response.data?.blogs || []);
      setTotalPages(response.data?.totalPages || 1);
    } catch (error) {
      setBlogs([]);
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, [searchQuery, page, order]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSearchParams({ query: searchQuery || "", page: newPage.toString(), order });
  };

  const handleOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrder = event.target.value;
    setOrder(newOrder);
    setSearchParams({ query: searchQuery || "", page: "1", order: newOrder });
    setPage(1);
  };

  if (loading) return "Loading...";

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4 mt-4">
      <div className="w-full flex justify-between items-center mb-4 flex-wrap gap-4">
        <h2 className="text-xl font-normal">
          {searchQuery ? <>Showing search results for <span className="font-semibold">{searchQuery}</span></> : (order == "like" ? "Trending Blogs" : "Latest Blogs")}
        </h2>
        <span className="flex gap-2 items-center">
          <p>Order by:</p>
          <select
            value={order}
            onChange={handleOrderChange}
            className="border p-2 rounded"
          >
            <option value="date">Recent</option>
            <option value="like">Popularity</option>
          </select>
        </span>
      </div>
      <div className="w-full">
        {blogs.map((blog, index) => (
          <BlogCard key={index} blog={blog} />
        ))}
      </div>
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
    </div>
  );
};

export default Search;
