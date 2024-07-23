import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import { IUserProfile } from "../utils/types";
import axios from "axios";
import useAuthState from "../state/useAuthState";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";

interface ProfileProps {
  isCurrentUser: boolean;
}

const Profile = ({ isCurrentUser }: ProfileProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [userNotFound, setUserNotFound] = useState(false);
  const { id:idFromParams } = useParams();
  const { user: currentUser } = useAuthState();

  const fetchProfileData = async () => {
    try {
      const userId = isCurrentUser ? currentUser?.id : idFromParams;
      console.log(idFromParams);
      const response = await axios.get(`/api/v1/user/profile/${userId}`);
      setUser(response.data.user);
      setUserNotFound(false);
    } catch (error) {
      console.log(error);
      setUserNotFound(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) return <Loader/>;

  if (userNotFound) return <p className="text-xl font-medium text-center mt-2">User not found</p>;

  return (
    <div className="flex flex-col items-center w-full p-4 pt-8">
      <div className="container w-full flex flex-col items-center mb-8">
        <img
          src={user?.profilePicture || "/images/defaultuser.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full mb-4"
        />
        <h2 className="text-2xl font-semibold">{user?.username}</h2>
      </div>
      <div className="container w-full">
        <h2 className="text-xl font-semibold mb-4">
          {isCurrentUser ? "Your Blogs" : "User's Blogs"}
        </h2>
        {user?.blogs && user.blogs.length > 0 ? (
          user.blogs.map((blog, index) => <BlogCard key={index} blog={blog} />)
        ) : (
          <p>No blogs found</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
