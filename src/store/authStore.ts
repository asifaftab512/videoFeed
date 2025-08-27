// authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  bio?: string | null;
  role?: string | null;
  dateOfBirth?: string | null; // <-- add this
  fullName?: string | null;    // <-- add this
  picture?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  
}

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,
//       isAuthenticated: false,

//       // Save user + token
//       setAuth: (user, token) => {
//         // Store token separately for axios
//         localStorage.setItem("token", token);

//         set({
//           user,
//           token,
//           isAuthenticated: true,
//         });
//       },

//       // Clear everything
//       logout: () => {
//         localStorage.removeItem("token");

//         set({
//           user: null,
//           token: null,
//           isAuthenticated: false,
//         });
//       },
//     }),
//     {
//       name: "auth-storage", // persists store in localStorage
//     }
//   )
// );



export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem("token", token);
        set({ user, token, isAuthenticated: true });
      },

      // ✅ Add this new updater
      updateUser: (updatedUser: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : state.user,
        }));
      },

      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        console.log("Persist rehydrated!", state);
      },
    }
  )
);

