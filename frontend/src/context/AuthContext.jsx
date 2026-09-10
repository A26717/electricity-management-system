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
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setClientId(storedClientId);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.clear();
      }
    }
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      // Demo users database
      const users = {
        'client_john': {
          password: 'client123',
          role: 'client',
          userData: {
            id: 'CLT001',
            name: 'John Doe',
            username: 'client_john',
            email: 'john.doe@example.com',
            role: 'client',
            phone: '+232 76 123456',
            address: '123 Main Street, Freetown'
          },
          clientId: 'CLT001'
        },
        'client_jane': {
          password: 'client123',
          role: 'client',
          userData: {
            id: 'CLT002',
            name: 'Jane Smith',
            username: 'client_jane',
            email: 'jane.smith@example.com',
            role: 'client',
            phone: '+232 76 234567',
            address: '456 King Street, Freetown'
          },
          clientId: 'CLT002'
        },
        'admin': {
          password: 'admin123',
          role: 'administrator',
          userData: {
            id: 'ADM001',
            name: 'Admin User',
            username: 'admin',
            email: 'admin@edsa.gov.sl',
            role: 'administrator'
          },
          clientId: null
        },
        'it_manager': {
          password: 'it123',
          role: 'it_manager',
          userData: {
            id: 'ITM001',
            name: 'IT Manager',
            username: 'it_manager',
            email: 'it@edsa.gov.sl',
            role: 'it_manager'
          },
          clientId: null
        },
        'ops_manager': {
          password: 'ops123',
          role: 'operations_manager',
          userData: {
            id: 'OPS001',
            name: 'Operations Manager',
            username: 'ops_manager',
            email: 'ops@edsa.gov.sl',
            role: 'operations_manager'
          },
          clientId: null
        },
        'executive_peter': {
          password: 'executive123',
          role: 'executive',
          userData: {
            id: 'EXE001',
            name: 'Peter Executive',
            username: 'executive_peter',
            email: 'executive@edsa.gov.sl',
            role: 'executive'
          },
          clientId: null
        },
        'staff_billing': {
          password: 'staff123',
          role: 'staff',
          userData: {
            id: 'STF001',
            name: 'Billing Officer',
            username: 'staff_billing',
            email: 'billing@edsa.gov.sl',
            role: 'staff'
          },
          clientId: null
        }
      };

      const matchedUser = users[username];

      if (!matchedUser || matchedUser.password !== password) {
        return { success: false, error: 'Invalid credentials' };
      }

      const tokenData = `demo-token-${matchedUser.userData.id}-${Date.now()}`;

      setUser(matchedUser.userData);
      setToken(tokenData);
      setClientId(matchedUser.clientId);
      setIsAuthenticated(true);

      localStorage.setItem('user', JSON.stringify(matchedUser.userData));
      localStorage.setItem('token', tokenData);
      if (matchedUser.clientId) {
        localStorage.setItem('clientId', matchedUser.clientId);
      } else {
        localStorage.removeItem('clientId');
      }

      return {
        success: true,
        role: matchedUser.role,
        user: matchedUser.userData
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear all auth data
    setUser(null);
    setToken(null);
    setClientId(null);
    setIsAuthenticated(false);

    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('clientId');
    localStorage.clear(); // Extra safety: clear everything

    // Force redirect to login page
    window.location.href = '/login';
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