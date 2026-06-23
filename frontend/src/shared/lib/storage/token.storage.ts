export const setAccessTokenCookie = (token: string) => {
  document.cookie = `accessToken=${token}; path=/; max-age=86400; SameSite=Lax`;
};

export const removeAccessTokenCookie = () => {
  document.cookie = `accessToken=; path=/; max-age=0`;
};
