import { authApi } from './api';

const loginAndFetchProfile = async (username, password) => {
  // Backend uses OAuth2 password flow at /token and profile at /me
  const tokenResponse = await authApi.post(
    '/token',
    new URLSearchParams({
      username,
      password,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const rawToken =
    tokenResponse.data?.access_token ||
    tokenResponse.data?.token ||
    tokenResponse.data;

  const profileResponse = await authApi.get('/me', {
    headers: rawToken
      ? { Authorization: `Bearer ${rawToken}` }
      : undefined,
  });

  return {
    token: rawToken,
    user: profileResponse.data,
  };
};

export const authService = {
  login: async (username, password) => {
    return await loginAndFetchProfile(username, password);
  },

  register: async (username, email, password, role = 'user') => {
    await authApi.post('/register', {
      username,
      email,
      password,
      role
    });
    // After successful registration, log the user in to obtain token and profile
    return await loginAndFetchProfile(username, password);
  },

  getProfile: async () => {
    const response = await authApi.get('/me');
    return response.data;
  }
};