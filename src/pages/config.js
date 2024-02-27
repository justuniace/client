export const endPoint =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : `https://pup-6463526d2e61.herokuapp.com/api`;
