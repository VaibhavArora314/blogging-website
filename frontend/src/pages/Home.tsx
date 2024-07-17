import TopCategories from "../components/TopCategories";
import TopAuthors from "../components/TopAuthors";
import TopPicks from "../components/TopPicks";
import BlogCard from "../components/BlogCard";

const blogs = [
  {
    title: "Blog Post 1",
    description: "This is the start of the description for blog post 1.",
    date: "July 15, 2024",
    author: "Author 1",
    authorPhoto: "https://via.placeholder.com/50",
    details: "Additional details about the blog post.",
  },
  {
    title: "Blog Post 1",
    description: "This is the start of the description for blog post 1.",
    date: "July 15, 2024",
    author: "Author 1",
    authorPhoto: "https://via.placeholder.com/50",
    details: "Additional details about the blog post.",
  },
  {
    title: "Blog Post 1",
    description: "This is the start of the description for blog post 1.",
    date: "July 15, 2024",
    author: "Author 1",
    authorPhoto: "https://via.placeholder.com/50",
    details: "Additional details about the blog post.",
  },
  {
    title: "Blog Post 1",
    description: "This is the start of the description for blog post 1.",
    date: "July 15, 2024",
    author: "Author 1",
    authorPhoto: "https://via.placeholder.com/50",
    details: "Additional details about the blog post.",
  },
  {
    title: "Blog Post 1",
    description: "This is the start of the description for blog post 1.",
    date: "July 15, 2024",
    author: "Author 1",
    authorPhoto: "https://via.placeholder.com/50",
    details: "Additional details about the blog post.",
  },
  {
    title: "Blog Post 1",
    description: "This is the start of the description for blog post 1.",
    date: "July 15, 2024",
    author: "Author 1",
    authorPhoto: "https://via.placeholder.com/50",
    details: "Additional details about the blog post.",
  },
  // Add more blog posts as needed
];

const Homepage = () => {
  return (
    <>
      <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-4 mt-4">
        <div className="lg:w-2/3">
          <h2 className="text-xl font-semibold mb-4">Latest Blogs</h2>
          {blogs.map((blog, index) => (
            <BlogCard
              key={index}
              title={blog.title}
              description={blog.description}
              author={blog.author}
              authorPhoto={blog.authorPhoto}
              date={blog.date}
              category="Category Name"
            />
          ))}
        </div>
        <div className="hidden lg:block lg:w-1/3">
          <TopPicks />
          <TopCategories />
          <TopAuthors />
        </div>
      </div>
    </>
  );
};

export default Homepage;
