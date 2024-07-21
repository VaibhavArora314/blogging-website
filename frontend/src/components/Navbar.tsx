import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import useAuthState from "../state/useAuthState";
import SearchIcon from '@mui/icons-material/Search';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery,setSearchQuery] = useState("");
  const {user,clear} = useAuthState();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("token")
    clear();
  }

  const handleSearch = () => {
    navigate(`/search?query=${searchQuery}`)
  }

  return (
    <nav className="bg-white p-4 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <span className="flex gap-4 items-center justify-center">

        <Link to="/" onClick={() => {setIsOpen(false);}} className="flex items-center space-x-2 z-20">
          <img src="/logo.png" alt="Logo" width="36" height="36" />

          <span className="text-gray-900 text-md lg:text-lg font-bold">
            Blogify
          </span>
        </Link>
        <input type="text" name="searchQuery" id="searchQuery" placeholder="Seach here..." className="outline-none w-24 md:w-44 lg:w-60 bg-inherit" onChange={e => {setSearchQuery(e.target.value)}} onKeyDown={(e) => {
          if (e.key == "Enter")
            handleSearch();  
        }}/>
        <span onClick={handleSearch}>
          <SearchIcon/>
        </span>
        </span>
        <div className="flex items-center lg:hidden z-20">
          <button
            onClick={toggleMenu}
            className="text-gray-900 focus:outline-none"
          >
            <svg
              className={`w-6 h-6 transform transition-transform duration-300 ease-in-out ${
                isOpen ? "rotate-90" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className={`${isOpen ? "opacity-0" : "opacity-100"}`}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
              <path
                className={`${isOpen ? "opacity-100" : "opacity-0"}`}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div
          className={`${
            isOpen ? "pb-2 shadow-md border-gray-200" : ""
          } flex flex-col lg:flex-row items-center lg:space-x-4 space-y-2 lg:space-y-0 absolute lg:relative w-full lg:w-auto left-0 lg:left-auto bg-white lg:bg-transparent ${
            isOpen ? "top-16" : "top-[-100vh]"
          } lg:top-0 transition-all duration-300 ease-in-out`}
        >
          {user && user.id ? (
            <>
              <Link
                to="/new-blog"
                onClick={() => {setIsOpen(false);}} 
                className="text-gray-900 text-md lg:text-md font-medium hover:text-gray-700 flex justify-center items-center gap-2"
              >
                Write
                <img
                src={"/images/write.png"}
                alt="Profile"
                className="h-10 w-10 mr-2"
              />
              </Link>
              <Link
                to="/profile"
                onClick={() => {setIsOpen(false);}} 
                className="text-gray-900 text-md lg:text-md font-medium hover:text-gray-700 flex justify-center items-center gap-2"
              >
                <p className="lg:hidden">Profile</p>
                <img
                src={user.profilePicture || "/images/defaultuser.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full mr-2"
              />
              </Link>
              <Button
                label="Logout"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }} 
                type="button"
                fontBold
              />
            </>
          ): (
            <><Link
            to="/signin"
            onClick={() => {setIsOpen(false);}} 
            className="text-gray-900 text-md lg:text-md font-medium hover:text-gray-700"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            onClick={() => {setIsOpen(false);}} 
            className="text-gray-900 text-md lg:text-md font-medium hover:text-gray-700"
          >
            Sign up
          </Link></>
          ) }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
