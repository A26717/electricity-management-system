import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8000/api/v1';

axios.defaults.baseURL = API_URL;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      role: null,
      menu: [],
      permissions: [],
      clientId: null,

      login: async (username, password) => {
        set({ loading: true });
        try {
          console.log('🔐 authStore: Attempting login with:', username);
          
          const response = await axios.post('/auth/login', {
            username,
            password
          });

          console.log('✅ authStore: Login response:', response.data);

          const { access_token, user, menu, permissions } = response.data;
          
          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
          
          const userRole = user.role;
          
          set({
            user: {
              id: user.id,
              username: user.username,
              name: user.name,
              email: user.email,
              role: userRole,
              client_id: user.client_id || null,
              status: user.status || 'active'
            },
            token: access_token,
            isAuthenticated: true,
            loading: false,
            role: userRole,
            menu: menu || [],
            permissions: permissions || [],
            clientId: user.client_id || null
          });

          toast.success(`Welcome ${user.name}!`);
          return { success: true, role: userRole };
        } catch (error) {
          console.error('❌ authStore: Login error:', error.response?.data || error.message);
          set({ loading: false });
          const errorMsg = error.response?.data?.detail || 'Login failed. Please check your credentials.';
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      },

      logout: () => {
        delete axios.defaults.headers.common['Authorization'];
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          role: null,
          menu: [],
          permissions: [],
          clientId: null
        });
        localStorage.removeItem('auth-storage');
        toast.success('Logged out successfully');
      },

      verifyToken: async () => {
        const { token } = get();
        if (!token) return false;

        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('/auth/me');
          const { user, menu, permissions } = response.data;
          
          set({
            user,
            menu: menu || [],
            permissions: permissions || [],
            isAuthenticated: true,
            role: user.role,
            clientId: user.client_id || null
          });
          return true;
        } catch (error) {
          console.error('❌ authStore: Token verification failed:', error);
          set({ isAuthenticated: false });
          delete axios.defaults.headers.common['Authorization'];
          return false;
        }
      },

      hasPermission: (permission) => {
        const { permissions } = get();
        return permissions.includes(permission);
      },

      hasRole: (roles) => {
        const { role } = get();
        return roles.includes(role);
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);