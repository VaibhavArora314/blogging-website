import { Link } from "react-router-dom";

const topAuthors = [
  { id: 1,name: "Author 1", photo: "https://via.placeholder.com/50" },
  { id: 2,name: "Author 2", photo: "https://via.placeholder.com/50" },
  { id: 3,name: "Author 3", photo: "https://via.placeholder.com/50" },
];

const TopAuthors = () => {
  return (
    <div className="p-4 mb-2">
      <h2 className="text-xl font-semibold mb-4">Top Authors</h2>
      {topAuthors.map((author) => (
        <Link to={`/profile/${author.id}`} key={author.id} className="flex items-center mb-4 w-fit">
          <img
            src={author.photo}
            alt={author.name}
            className="w-10 h-10 rounded-full mr-2"
          />
          <div className="flex flex-col">
            <span className="font-medium">{author.name}</span>
            <span>Hi my name is {author.name}</span>
          </div>
        </Link>
      ))}
      <Link to="/top-authors" className="font-medium text-md text-green-600">See more</Link>
    </div>
  );
};

export default TopAuthors;
