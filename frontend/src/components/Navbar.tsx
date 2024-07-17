import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
// import { ReactComponent as Logo } from "../assets/logo.svg"; // Adjust the path as necessary

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <nav className="bg-white p-4 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 z-20">
          {/* <Logo className="h-8 w-8 text-gray-900" /> */}
          {/* <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="24" height="24" rx="4" fill="#4A5568" />
            <path
              d="M12 7V17M7 12H17"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg> */}
          <img src="/public/logo.png" alt="Logo" width="36" height="36" />

          <span className="text-gray-900 text-md lg:text-md font-bold">
            Blogify
          </span>
        </div>
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
          <Link
            to="/"
            className="text-gray-900 text-md lg:text-md font-medium hover:text-gray-700"
          >
            Home
          </Link>
          <Link
            to="/new-blog"
            className="text-gray-900 text-md lg:text-md font-medium hover:text-gray-700"
          >
            Write
          </Link>
          <Link
            to="/profile"
            className="text-gray-900 text-md lg:text-md font-medium hover:text-gray-700"
          >
            Profile
          </Link>
          <Button label="Logout" onClick={() => {}} type="button" fontBold />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
