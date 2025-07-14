import axios from "axios";

const API = axios.create({
  baseURL: "https://ecom-project1-d49s.onrender.com/api",
});

delete API.defaults.headers.common["Authorization"];

export default API;

