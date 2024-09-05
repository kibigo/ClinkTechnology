
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cookies } from 'typescript-cookie';
import axios from 'axios';
import { removeCookie, setCookie } from 'typescript-cookie';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  user_type: number;
  access_token:string;
}


// Define the context type
interface UserContextType {
  user: User | null;
  updateUser: (userData: {user: User} | null) => void;
  loading:boolean;
  tokenExpired:boolean;
}

// Create the context
const UserContext = createContext<UserContextType | null>(null);

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// UserContext provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpired, setTokenExpired] = useState(false);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      await new Promise ((resolve) => setTimeout(resolve));

      const token = Cookies.get('jwt'); // Get the token from cookies
      if (!token) {
        setUser(null);
        setTokenExpired(true);
        setLoading(false);
        return;
      }
      const response = await axios.get<User>('http://127.0.0.1:8000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data);
      setTokenExpired(false);
    } catch (error) {

      if(axios.isAxiosError(error) && error.response?.status === 401){
        setTokenExpired(true);
        setUser(null);
      }else{
        console.error('Error fetching user data', error);
      }
      
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Function to update user data
  const updateUser = (userData: {user: User} | null) => {
    
  
    if (userData) {

      setUser(userData.user);

      setCookie('jwt', userData.user.access_token);
    } else {
      setUser(null);
      removeCookie('jwt'); // Remove JWT token if user is logged out
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser, loading, tokenExpired }}>
      {children}
    </UserContext.Provider>
  );
};



