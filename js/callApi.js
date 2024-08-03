import { httpClient } from "../module/client.js";
import { renderBlogs, renderHeader } from "./script.js";
export const params = {
  page: 1,
};

export const getBlogs = async (params = {}) => {
  let query = new URLSearchParams(params).toString();
  if (query) {
    query = "?" + query;
  }
  const { data } = await httpClient.get(`/blogs${query}`);
  const blogData = await data;

  renderBlogs(blogData.data);
  window.addEventListener("scroll", handleScroll);
};

export const postBlog = async (blog) => {
  try {
    const { accessToken } = JSON.parse(localStorage.getItem("login_token"));
    httpClient.token = accessToken;
    const { response, data } = await httpClient.post("/blogs", blog);
    if (!response.ok) {
      return false;
    }
    return data;
  } catch {}
};

const getProfile = async () => {
  try {
    const { accessToken } = JSON.parse(localStorage.getItem("login_token"));
    httpClient.token = accessToken;
    const { response, data } = await httpClient.get("/users/profile");
    if (!response.ok) {
      throw new Error("Unauthorize");
    }
    return data;
  } catch {
    return false;
  }
};

export const showProfile = async () => {
  const userData = await getProfile();
  if (userData) {
    document.querySelector(".user-name").innerText = userData.data.name;
  } else {
    renderHeader();
  }
};

export const handleLogout = async () => {
  const { accessToken } = JSON.parse(localStorage.getItem("login_token"));
  httpClient.token = accessToken;
  await httpClient.post("/auth/logout");
  localStorage.removeItem("login_token");
  window.location.href = "./components/login.html";
};

const handleScroll = () => {
  if (
    window.scrollY + window.innerHeight >=
    (document.documentElement.scrollHeight * 80) / 100
  ) {
    window.removeEventListener("scroll", handleScroll);
    params.page++;
    params.limit = 7;
    getBlogs(params);
  }
};
