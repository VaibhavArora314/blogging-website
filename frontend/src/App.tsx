import { Navigate, Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import SignUp from "./pages/Signup";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NewBlog from "./pages/NewBlog";
import Blog from "./pages/Blog";
import useAuthState from "./state/useAuthState";
import Loader from "./components/Loader";
import { useEffect } from "react";
import Profile from "./pages/Profile";
import Search from "./pages/SearchPage";

import axios from "axios";
import UnauthorizedRoute from "./components/UnauthorizedRoute";
import AuthorizedRoute from "./components/AuthorizedRoute";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const { loading, fetchUser } = useAuthState();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) return <Loader />;

  return (
    <Routes>
      <Route
        path="/signin"
        element={
          <UnauthorizedRoute>
            <Signin />
          </UnauthorizedRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <UnauthorizedRoute>
            <SignUp />
          </UnauthorizedRoute>
        }
      />
      <Route
        path="/*"
        element={
          <>
            <div className="min-h-screen flex flex-col justify-between">
              <div>
                <Navbar />
                <Routes>
                  <Route
                    path="/profile/:id"
                    element={<Profile isCurrentUser={false} />}
                  />
                  <Route
                    path="/profile"
                    element={
                      <AuthorizedRoute>
                        <Profile isCurrentUser={true} />
                      </AuthorizedRoute>
                    }
                  />
                  <Route
                    path="/new-blog"
                    element={
                      <AuthorizedRoute>
                        <NewBlog />
                      </AuthorizedRoute>
                    }
                  />
                  <Route path="/blog/:id" element={<Blog />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/*" element={<Navigate to="/" />} />
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
