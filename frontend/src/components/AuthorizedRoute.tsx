import { PropsWithChildren, useEffect, useState } from "react"
import useAuthState from "../state/useAuthState";
import { useNavigate } from "react-router-dom";

const AuthorizedRoute = ({children}: PropsWithChildren) => {
    const [loading,setLoading] = useState(true);
    const {user} = useAuthState();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.id)
            navigate("/signin");
        setLoading(false);
    },[user,setLoading,navigate])

    if (loading) return "Loading...";

  return (
    <>
      {children}
    </>
  )
}

export default AuthorizedRoute
