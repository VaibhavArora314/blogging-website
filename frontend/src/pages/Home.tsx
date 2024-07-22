// import TopCategories from "../components/TopCategories";
// import TopAuthors from "../components/TopAuthors";
import TopPicks from "../components/TopPicks";
import BlogList from "../components/LatestBlogList";

const Homepage = () => {
  return (
    <>
      <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-4 mt-4">
        <div className="lg:w-2/3">
          <BlogList />
        </div>
        <div className="hidden lg:block lg:w-1/3">
          <TopPicks />
          {/* <TopCategories />
          <TopAuthors /> */}
        </div>
      </div>
    </>
  );
};

export default Homepage;
