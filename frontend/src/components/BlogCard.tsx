import { Link } from "react-router-dom";
import { IBlog } from "../utils/types";

type BlogCardProps = {
  blog: IBlog;
};

const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <div className="p-4 border-b-2 border-gray-200 mb-4 flex flex-row justify-between">
      <div>
        <div className="flex items-center mb-4 w-fit">
          <Link to={`/profile/${blog.author.id}`}>
            <img
              src={blog.author.profilePicture || "/images/defaultuser.png"}
              alt={blog.author.username}
              className="w-7 h-7 rounded-full mr-2"
            />
          </Link>
          <Link to={`/profile/${blog.author.id}`} className="font-medium mr-1">
            {blog.author.username}
          </Link>
          on
          <Link to={`/category/${blog.category}`} className="font-medium ml-1">
            {blog.category}
          </Link>
        </div>
        <Link to={`/blog/${blog.id}`}>
          <h3 className="text-xl lg:text-2xl font-semibold">{blog.title}</h3>
          <p className="text-gray-600 font-normal text-md">
            {blog.content.length > 120
              ? blog.content.slice(0, 100) + "..."
              : blog.content}
          </p>
        </Link>

        <div className="mt-2 lg:mt-4">
          <p className="text-sm lg:text-md text-gray-500">{blog.createdAt}</p>
        </div>
      </div>
      {blog.bannerImage && <Link to={`/blog/${blog.id}`}>
      <img
        src={blog.bannerImage}
        alt={blog.title.slice(0, 20)}
        className="w-32 h-32 lg:w-44 lg:h-44 object-cover"
        />
        </Link>}
    </div>
  );
};

export default BlogCard;
