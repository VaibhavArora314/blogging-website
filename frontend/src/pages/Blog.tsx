const blog = {
  title: "Sample Blog Title",
  description:
    "This is a sample description of the blog. It contains the main content of the blog. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos asperiores neque, ducimus odio inventore debitis dolore vitae eum eveniet repellat vero perferendis mollitia iusto veritatis delectus? Ducimus nihil vel maxime quae. Repellendus tempora adipisci consequuntur pariatur dicta voluptatum perspiciatis magni similique numquam, soluta unde magnam praesentium reprehenderit velit maiores asperiores. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos asperiores neque, ducimus odio inventore debitis dolore vitae eum eveniet repellat vero perferendis mollitia iusto veritatis delectus? Ducimus nihil vel maxime quae. Repellendus tempora adipisci consequuntur pariatur dicta voluptatum perspiciatis magni similique numquam, soluta unde magnam praesentium reprehenderit velit maiores asperiores. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos asperiores neque, ducimus odio inventore debitis dolore vitae eum eveniet repellat vero perferendis mollitia iusto veritatis delectus? Ducimus nihil vel maxime quae. Repellendus tempora adipisci consequuntur pariatur dicta voluptatum perspiciatis magni similique numquam, soluta unde magnam praesentium reprehenderit velit maiores asperiores.",
  bannerImage: "https://via.placeholder.com/800x400",
  author: "John Doe",
  authorImage: "https://via.placeholder.com/150",
  date: "July 20, 2024",
};

const Blog = () => {
  return (
    <div className="max-w-4xl w-full mx-auto p-4">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 self-start">{blog.title}</h1>
        <img
          src={blog.bannerImage}
          alt="Banner"
          className="w-full h-auto object-cover rounded-lg shadow-md mb-4"
        />
        <div className="w-full flex justify-start items-center mb-4">
          <img
            src={blog.authorImage}
            alt={blog.author}
            className="w-12 h-12 rounded-full mr-2"
          />
          <div className="text-gray-700 flex flex-col items-center justify-center">
            <p className="text-lg font-medium">{blog.author}</p>
            <p className="text-sm text-gray-500">{blog.date}</p>
          </div>
        </div>
        <div className="text-lg text-gray-800 leading-relaxed">
          {blog.description}
        </div>
      </div>
    </div>
  );
};

export default Blog;
