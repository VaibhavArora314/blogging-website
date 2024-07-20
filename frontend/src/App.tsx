import { Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import SignUp from "./pages/Signup";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { NewBlog } from "./pages/NewBlog";
import Blog from "./pages/Blog";
import useAuthState from "./state/useAuthState";
import Loader from "./components/Loader";

import axios from "axios";
import { useEffect } from "react";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const {loading,fetchUser} = useAuthState();
  console.log(axios.defaults.baseURL)

  useEffect(() => {
    fetchUser();
  },[fetchUser])

  if (loading) return <Loader />

  return (
    <Routes>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/*"
        element={
          <>
            <div className="min-h-screen flex flex-col justify-between">
              <div>
                <Navbar />
                <Routes>
                  <Route path="/profile/:id" element={<></>} />
                  <Route path="/profile" element={<></>} />
                  <Route path="/new-blog" element={<NewBlog />} />
                  <Route path="/blog/:id" element={<Blog />} />
                  <Route path="/" element={<Home />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </>
        }
      />
    </Routes>
  );
}

export default App;
