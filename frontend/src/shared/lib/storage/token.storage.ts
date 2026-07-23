// Doit rester alignée sur la durée de vie réelle du token (15 min côté
// backend, voir JwtTokenProvider.accessExpire) : un cookie qui survit plus
// longtemps que le token qu'il contient fait croire indéfiniment au
// middleware que l'utilisateur est connecté (il ne vérifie que la présence
// du cookie, pas sa validité), alors que le token est déjà expiré.
export const setAccessTokenCookie = (token: string) => {
  document.cookie = `accessToken=${token}; path=/; max-age=900; SameSite=Lax`;
};

export const removeAccessTokenCookie = () => {
  document.cookie = `accessToken=; path=/; max-age=0`;
};
