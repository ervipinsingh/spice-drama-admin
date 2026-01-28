import axios from "axios";

const foodApi = axios.create({
  baseURL: "https://spice-drama.onrender.com/api",
});

export default foodApi;
