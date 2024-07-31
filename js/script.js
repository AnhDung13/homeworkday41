import { httpClient } from "../module/client.js";
const params = {
  page: 1,
};

const content = document.querySelector(".content");

document.body.addEventListener("submit", async (e) => {
  if (e.target.classList.contains("post-form")) {
    e.preventDefault();
    const blog = Object.fromEntries([...new FormData(e.target)]);
    const title = e.target.querySelector(".title");
    const contentChild = e.target.querySelector(".content");
    if (!blog.title) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "vui lòng nhập tiêu đề bài viết",
        showConfirmButton: false,
        timer: 1500,
      });
    } else if (!blog.content) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "vui lòng nhập nội dung bài viết",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      const postData = await postBlog(blog);
      if (!postData) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Xảy ra sự cố vui lòng thử lại sau giây lát",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Đăng bài thành công",
          showConfirmButton: false,
          timer: 1500,
        });
        params.page = 1;
        content.innerHTML = "";
        title.value = "";
        contentChild.value = "";
        getBlogs(params);
      }
    }
  }
});

const postBlog = async (blog) => {
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

const getBlogs = async (params = {}) => {
  let query = new URLSearchParams(params).toString();
  if (query) {
    query = "?" + query;
  }
  const { data } = await httpClient.get(`/blogs${query}`);
  const blogData = await data;

  renderBlogs(blogData.data);
  window.addEventListener("scroll", handleScroll);
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
const showProfile = async () => {
  const userData = await getProfile();
  if (userData) {
    document.querySelector(".user-name").innerText = userData.data.name;
  } else {
    renderHeader();
  }
};
const renderBlogs = async (data) => {
  const blogs = `${data
    .map(({ title, content, userId, createdAt }) => {
      let contentLink = "";
      if (content.includes("https://youtu")) {
        contentLink = content.split("/")[3];
      } else if (content.includes("https://www.youtube")) {
        contentLink = content.split("/")[3].split("=")[1];
        if (contentLink !== undefined && contentLink.includes(" https:")) {
          contentLink = contentLink.replace(" https:", "");
          console.log(contentLink);
        }
      }
      createdAt = new Date(createdAt).getTime();
      let currentTime = new Date().getTime();
      let time = (currentTime - createdAt) / 1000;
      let timePost = 0;
      if (time / 60 >= 1 && time / 60 < 60) {
        timePost = Math.floor(time / 60) + " phút trước";
      } else if (time / 3600 >= 1 && time / 3600 < 24) {
        timePost = Math.floor(time / 3600) + " giờ trước";
      } else if (time / 86400 >= 1 && time / 84600 <= 31) {
        timePost = Math.floor(time / 86400) + " ngày trước";
      } else if (time / 2592000 >= 1 && time / 2592000 < 13) {
        timePost = Math.floor(time / 2592000) + " tháng trước";
      } else if (time / 31536000 >= 1) {
        timePost = Math.floor(time / 31536000) + " năm trước";
      } else {
        timePost = Math.floor(Math.abs(time)) + " giây trước";
      }
      return `
      
      <section>
          <div></div>
          <div>    
          <div class="d-flex align-items-center justify-content-between">
            <span class="user-name fs-2 text text-white fw-bold text-decoration-underline">${
              userId.name
            }</span> 
            <i class="text-success" >${timePost}</i>
            </div>
            <h3 class="title text fw-bold text-success">${title}</h3>
            ${
              content.includes("yout")
                ? `<iframe width="560" height="315" src="https://www.youtube.com/embed/${contentLink}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen=""></iframe>`
                : `<p class="text text-white fs-3 fw-bold text-break">${content}</p>`
            }
            <a href="#" class="text-success border border-success px-4 py-1 rounded-pill my-3 d-block" style="width:fit-content"># ${userId.name
              .toLocaleLowerCase()
              .split(" ")
              .join("")}</a>
          </div>  
          </section>
           <hr/>
    `;
    })
    .join("")}`;
  content.insertAdjacentHTML("beforeend", blogs);
};

const renderHeader = async () => {
  const status = localStorage.getItem("login_token") ? true : false;
  if (!status) {
    document.querySelector(
      "header"
    ).innerHTML = `<h1 class="text-success">Blogger</h1>
      <a href="./components/login.html" class="login px-5 py-3 btn btn-success">
        Sign in
      </a>`;
  } else {
    document.querySelector("header").innerHTML = `
    <div class="d-flex justify-content-between">
      <div>
      <h1 class="text-success fw-bold">Blogger</h1>
      <p class="fs-2 text text-white fw-bold text-decoration-underline user-name">Loading...</p>
      <form action="" class="post-form">
        <div class="form-box my-3">
          <label class="text-success fw-bold">Enter Your title</label>
          <input
            class="form-control bg-secondary title"
            type="text"
            name="title"
            placeholder="Please enter your title"
            style="width: 300px"
          />
        </div>
        <div class="form-box my-3">
          <label class="text-success fw-bold">Enter Your content</label>
          <textarea
            class="form-control bg-secondary content"
            name="content"
            id=""
            placeholder="content here..."
            style="width: 500px; height: 200px"
          ></textarea>
        </div>
        <input type="date" class="form-control mb-3 date-picker"/>
        <button type="submit" class="btn btn-success px-5 py-4 text-black">
          Write New!
        </button>
      </form>
      </div>
       <button class="btn btn-danger sign-out px-5 py-4 h-25">Sign out</button>
    </div>
    `;
    showProfile();
    const signOutBtn = document.querySelector(".sign-out");
    signOutBtn.addEventListener("click", async () => {
      const { accessToken } = JSON.parse(localStorage.getItem("login_token"));
      httpClient.token = accessToken;
      await httpClient.post("/auth/logout");
      localStorage.removeItem("login_token");
      window.location.href = "./components/login.html";
    });
    const datePicker = document.querySelector(".date-picker");
    datePicker.addEventListener("change", (e) => {
      e.preventDefault();

      const currentDate = new Date();
      const datePicked =
        e.target.value +
        " " +
        currentDate.getHours() +
        ":" +
        currentDate.getMinutes() +
        ":" +
        currentDate.getSeconds();
      const targetDate = new Date(datePicked).getTime();
      let seconds = (targetDate - currentDate.getTime()) / 1000;
      console.log(targetDate);
      if (seconds < 0) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Vui lòng chọn ngày khác",
          showConfirmButton: false,
          timer: 1500,
        });
        e.target.value = "";
      } else {
        const days = Math.floor(seconds / 86400);
        seconds = seconds - days * 86400;
        const hours = Math.floor(seconds / 3600);
        seconds = seconds - hours * 3600;
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds - minutes * 60);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Bài viết của bạn sẽ được đăng sau ${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  }
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

document.addEventListener("DOMContentLoaded", renderHeader);
getBlogs(params);
