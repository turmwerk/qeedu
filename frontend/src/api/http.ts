import axios from "axios";
import { API_BASE_URL } from "./config";

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  withCredentials: true,
});

export default http;
