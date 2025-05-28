import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, AuthContextType, ApiResponse } from '../types';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:8080';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/teacher`);
      const apiResponse: ApiResponse<User> = response.data;
      
      if (apiResponse.success) {
        // Convert backend user format to frontend format
        const userData = apiResponse.data;
        const formattedUser: User = {
          ...userData,
          id: userData.userId?.toString() || '',
          name: `${userData.firstName} ${userData.lastName}`.trim()
        };
        setUser(formattedUser);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      const apiResponse: ApiResponse<any> = response.data;
     
      
      if (apiResponse.success) {
        const { token } = apiResponse.data;
        const {user: userData} = apiResponse.data.userData;
        
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Convert backend user format to frontend format
        const formattedUser: User = {
          ...userData,
         
          id: userData.userId?.toString() || '',
          name: `${userData.firstName} ${userData.lastName}`.trim()
        };
        console.log(formattedUser)
        setUser(formattedUser);
        
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });

        // Redirect to dashboard after successful login
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Login failed';
      console.log("error why",message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, { 
        email, 
        password, 
        firstName, 
        lastName 
      });
      const apiResponse: ApiResponse<any> = response.data;
      
      if (apiResponse.success) {
        // After registration, attempt to login
        await login(email, password);
        
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
    toast({
      title: "Success",
      description: "Logged out successfully!",
    });
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      // Convert frontend format to backend format
      const backendData = {
        firstName: userData.firstName || userData.name?.split(' ')[0] || '',
        lastName: userData.lastName || userData.name?.split(' ').slice(1).join(' ') || '',
        email: userData.email || user?.email || '',
         subject: userData.subject || user?.subject || '',
         bio: userData.bio || user?.bio || ''
      };
      
      const response = await axios.post(`${API_BASE_URL}/api/teacher`, backendData);
      const apiResponse: ApiResponse<User> = response.data;
      
      if (apiResponse.success) {
        // Convert backend user format to frontend format
        const updatedUser = apiResponse.data;
        const formattedUser: User = {
          ...updatedUser,
          id: updatedUser.userId?.toString() || '',
          name: `${updatedUser.firstName} ${updatedUser.lastName}`.trim()
        };
        setUser(formattedUser);
        
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
