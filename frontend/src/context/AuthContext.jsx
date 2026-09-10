import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedClientId = localStorage.getItem('clientId');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setClientId(storedClientId);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      // For demo/testing purposes - hardcoded credentials
      if (username === 'client_john' && password === 'client123') {
        const userData = {
          id: 'CLT001',
          name: 'John Doe',
          username: 'client_john',
          email: 'john.doe@example.com',
          role: 'client',
          phone: '+232 76 123456',
          address: '123 Main Street, Freetown'
        };
        const tokenData = 'demo-token-123456';
        const clientIdData = 'CLT001';

        setUser(userData);
        setToken(tokenData);
        setClientId(clientIdData);
        setIsAuthenticated(true);
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', tokenData);
        localStorage.setItem('clientId', clientIdData);
        
        return { success: true, role: 'client', user: userData };
      }
      
      // Check for admin login
      if (username === 'admin' && password === 'admin123') {
        const userData = {
          id: 'ADM001',
          name: 'Admin User',
          username: 'admin',
          email: 'admin@edsa.gov.sl',
          role: 'administrator'
        };
        const tokenData = 'admin-token-123456';
        
        setUser(userData);
        setToken(tokenData);
        setIsAuthenticated(true);
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', tokenData);
        
        return { success: true, role: 'administrator', user: userData };
      }
      
      // Check for IT Manager login
      if (username === 'it_manager' && password === 'it123') {
        const userData = {
          id: 'ITM001',
          name: 'IT Manager',
          username: 'it_manager',
          email: 'it@edsa.gov.sl',
          role: 'it_manager'
        };
        const tokenData = 'it-token-123456';
        
        setUser(userData);
        setToken(tokenData);
        setIsAuthenticated(true);
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', tokenData);
        
        return { success: true, role: 'it_manager', user: userData };
      }

      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setClientId(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('clientId');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        clientId,
        isAuthenticated,
        loading,
        login,
        logout,
        setUser,
        setToken,
        setClientId,
        setIsAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;