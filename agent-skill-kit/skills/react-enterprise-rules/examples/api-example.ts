import axios from "axios";

export type TUserResponse = {
  id: string;
  name: string;
  email: string;
};

export type TUser = {
  id: string;
  displayName: string;
  email: string;
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
});

function mapUserResponse(response: TUserResponse): TUser {
  return {
    id: response.id,
    displayName: response.name,
    email: response.email,
  };
}

export async function fetchUser(userId: string): Promise<TUser> {
  const { data } = await apiClient.get<TUserResponse>(`/users/${userId}`);
  return mapUserResponse(data);
}
