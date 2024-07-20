import { Link } from "react-router-dom";
import { IBlog } from "../utils/types";
import { useEffect, useState } from "react";

type BlogCardProps = {
  blog: IBlog;
};

const BlogCard = ({ blog }: BlogCardProps) => {
  const [contentPreview, setContentPreview] = useState("");

  useEffect(() => {
    const updateContentPreview = () => {
      if (window.innerWidth >= 1024) {
        setContentPreview(blog.content.length > 200 ? blog.content.slice(0, 180) + "..." : blog.content);
      } else if (window.innerWidth >= 768) {
        setContentPreview(blog.content.length > 150 ? blog.content.slice(0, 130) + "..." : blog.content);
      } else {
        setContentPreview(blog.content.length > 80 ? blog.content.slice(0, 60) + "..." : blog.content);
      }
    };

    updateContentPreview();
    window.addEventListener("resize", updateContentPreview);
    return () => window.removeEventListener("resize", updateContentPreview);
  }, [blog.content]);

  return (
    <div className="p-4 border-b-2 border-gray-200 mb-4">
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
      <div className="flex flex-row justify-between gap-4">
        <div>
          <Link to={`/blog/${blog.id}`}>
            <h3 className="text-xl lg:text-2xl font-semibold">{blog.title}</h3>
            <p className="text-gray-600 font-normal text-md">
              {contentPreview}
            </p>
          </Link>

          <div className="mt-2 lg:mt-4">
            <p className="text-sm lg:text-md text-gray-500">{blog.createdAt}</p>
          </div>
        </div>
        {blog.bannerImage && (
          <Link to={`/blog/${blog.id}`} className="w-1/4 flex justify-end">
            <img
              src={blog.bannerImage}
              alt={blog.title.slice(0, 20)}
              className="w-16 h-16 sm:w-22 sm:h-22 md:w-28 md:h-28 lg:w-36 lg:h-36 object-cover"
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
