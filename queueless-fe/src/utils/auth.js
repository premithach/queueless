const AUTH_STORAGE_KEY = 'queueless_auth';

export const saveAuth = (authData) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
};

export const getAuth = () => {
  const authData = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!authData) {
    return null;
  }

  return JSON.parse(authData);
};

export const getToken = () => {
  const auth = getAuth();

  return auth?.token || null;
};

export const getUserRole = () => {
  const auth = getAuth();

  return auth?.role || null;
};

export const logout = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};
