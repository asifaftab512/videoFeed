// authService.ts
import axiosInstance from "../axiosInstance";

interface LoginResponse {
  token: string;
  expiresInSeconds: number;
  user: {
    id: number;
    username: string;
    email: string;
    displayName: string;
    bio?: string | null;
    role?: string;
    dateOfBirth?: string | null;
    fullName?: string | null;
    picture?: string | null;
  };
}

/**
 * Call login API
 * @param email user email
 * @param password user password
 * @returns LoginResponse
 */
export const loginApi = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>("Auth/login", {
    email,
    password,
  });

  return response.data;
};
