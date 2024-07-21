import { PropsWithChildren, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import useAuthState from "../state/useAuthState"

const UnauthorizedRoute = ({children}: PropsWithChildren) => {
    const [loading,setLoading] = useState(true);
    const {user} = useAuthState();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.id)
            navigate("/");
        setLoading(false);
    },[user,setLoading,navigate])

    if (loading) return "Loading...";

  return (
    <>
      {children}
    </>
  )
}

export default UnauthorizedRoute;