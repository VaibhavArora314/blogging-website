import { Link } from "react-router-dom";

const topBlogsList = [
  {
    id: 1,
    title:
      "Blog Post 1 Full nameakbjdjasbdkjalnslkj Blog Post 1 Full nameakbjdjasbdkjalnslkj Blog Post 1 Full nameakbjdjasbdkjalnslkj",
    description: "This is the start of the description for blog post 1.",
    date: "July 15, 2024",
    author: "Author 1",
    authorPhoto: "https://via.placeholder.com/50",
    details: "Additional details about the blog post.",
    category: "Category name",
  },
  {
    id: 2,
    title: "Blog Post 1",
    description: "This is the start of the description for blog post 1.",
    date: "July 15, 2024",
    author: "Author 1",
    authorPhoto: "https://via.placeholder.com/50",
    details: "Additional details about the blog post.",
    category: "Category name",
  },
  {
    id: 3,
    title: "Blog Post 1",
    description: "This is the start of the description for blog post 1.",
    date: "July 15, 2024",
    author: "Author 1",
    authorPhoto: "https://via.placeholder.com/50",
    details: "Additional details about the blog post.",
    category: "Category name",
  },
];

const TopPicks = () => {
  return (
    <div className="p-4 mb-2">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Trending Blogs</h2>
      <div className="flex flex-col">
        {topBlogsList.map((blog, index) => (
          <div key={index} className="mb-4">
            <span className="flex items-center mb-1">
              <Link to="/author/1">
                <img
                  src={blog.authorPhoto}
                  alt={blog.author}
                  className="w-6 h-6 rounded-full mr-2"
                />
              </Link>
              <p className="text-sm font-normal">
                <Link to="/author/1" className="font-medium">
                  {blog.author}
                </Link>{" "}
                on{" "}
                <Link to={`/category/${blog.category}`} className="font-medium">
                  {blog.category}
                </Link>
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
      <Link to="/trending" className="font-medium text-md text-green-600">See more</Link>
    </div>
  );
};

export default TopPicks;
