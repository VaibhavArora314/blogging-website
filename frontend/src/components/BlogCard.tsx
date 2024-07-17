import { Link } from "react-router-dom";

type BlogCardProps = {
  title: string;
  description: string;
  date: string;
  category: string;
  author: string;
  authorPhoto: string;
};

const BlogCard = ({
  title,
  description,
  date,
  author,
  authorPhoto,
  category,
}: BlogCardProps) => {
  return (
    <div className="p-4 border-b-2 border-gray-200 mb-4 flex flex-row justify-between">
      <div>
        <div className="flex items-center mb-4 w-fit">
          <Link to={`/profile/1`}>
            <img
              src={authorPhoto}
              alt={author}
              className="w-7 h-7 rounded-full mr-2"
            />
          </Link>
          <Link to={`/profile/1`} className="font-medium mr-1">
            {author}
          </Link>
          on
          <Link to={`/category/${category}`} className="font-medium ml-1">
            {category}
          </Link>
        </div>
        <h3 className="text-xl lg:text-2xl font-semibold">{title}</h3>
        <p className="text-gray-600 font-normal text-md">
          {description.length > 120
            ? description.slice(0, 100) + "..."
            : description}
        </p>

        <div className="mt-2 lg:mt-4">
          <p className="text-sm lg:text-md text-gray-500">{date}</p>
        </div>
      </div>
      <img
        src={authorPhoto}
        alt={author}
        className="w-20 h-20 lg:w-32 lg:h-32"
      />
    </div>
  );
};

export default BlogCard;
