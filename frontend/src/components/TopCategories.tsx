import { Link } from "react-router-dom";

const topCategories = ["Category with a long name", "Category with a long name but more long", "Category 3","Category 1", "Category 2", "Category with a long name but more more long"];

const TopCategories = () => {
  return (
    <div className="p-4 mb-2">
      <h2 className="text-gray-900 text-xl font-semibold mb-4">Top Categories</h2>
      <div className="flex flex-row flex-wrap mb-4 gap-2">
        {topCategories.map((category, index) => (
          <Link to={`/category/${category}`} key={index} className="font-normal text-md text-gray-900 p-3 bg-gray-100 rounded-full">
            {category}
          </Link>
        ))}
      </div>
      <Link to="/category" className="font-medium text-md text-green-600">See more topics</Link>
    </div>
  );
};

export default TopCategories;
