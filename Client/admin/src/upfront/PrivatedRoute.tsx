import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { useEffect } from "react";

type PrivateRouteProps = {
  children: React.ReactNode;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children}) => {
  const {user, loading, tokenExpired} = useUser();
  const navigate = useNavigate();
  // console.log(user);

  useEffect(() => {
    if(tokenExpired){
      navigate('/login');
    }
  }, [tokenExpired, navigate])

  if(loading){
    return <div>Loading...</div>
  }

  if (user?.user_type !== 0 || tokenExpired) {
    return <Navigate to='/login'/>;
  }

  return <>{children}</>;
};

export default PrivateRoute;