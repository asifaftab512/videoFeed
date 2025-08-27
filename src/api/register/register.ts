// authService.ts
import axiosInstance from "../axiosInstance";

interface RegisterResponse {
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
 * Call register API
 * @param username username
 * @param email user email
 * @param password user password
 * @returns RegisterResponse
 */
export const registerApi = async (
  username: string,
  email: string,
  password: string
): Promise<RegisterResponse> => {
  const response = await axiosInstance.post<RegisterResponse>("Auth/register", {
    username,
    email,
    password,
  });

  return response.data;
};
