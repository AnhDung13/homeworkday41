import { httpClient } from "../module/client.js";
const params = {
  page: 1,
};

const content = document.querySelector(".content");

document.body.addEventListener("submit", async (e) => {
  if (e.target.classList.contains("post-form")) {
    e.preventDefault();
    const blog = Object.fromEntries([...new FormData(e.target)]);
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
          title: "Xảy ra sự cố",
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
        getBlogs(params);
      }
    }
  }
});

const postBlog = async (blog) => {
  const loginToken = JSON.parse(localStorage.getItem("login_token"));
  const { accessToken } = loginToken.data;
  httpClient.token = accessToken;
  const { response, data } = await httpClient.post("/blogs", blog);
  if (!response.ok) {
    return false;
  }
  return data;
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

const renderBlogs = async (data) => {
  const blogs = `${data
    .map(({ title, content, userId }) => {
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
      return `
      <section>
            <span class="user-name fs-2 text text-white fw-bold text-decoration-underline">${
              userId.name
            }</span>
            <h3 class="title text fw-bold text-success">${title}</h3>
            ${
              content.includes("you")
                ? `<iframe width="560" height="315" src="https://www.youtube.com/embed/${contentLink}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen=""></iframe>`
                : `<p class="text text-white fs-3 fw-bold">${content}</p>`
            }
            <a href="#" class="text-success border border-success px-4 py-1 rounded-pill my-3 d-block" style="width:fit-content"># ${userId.name
              .toLocaleLowerCase()
              .split(" ")
              .join("")}</a>
          </section>
           <hr/>
    `;
    })
    .join("")}`;
  content.insertAdjacentHTML("beforeend", blogs);
};

const renderHeader = () => {
  const status = localStorage.getItem("login_token") ? true : false;
  if (!status) {
    document.querySelector(
      "header"
    ).innerHTML = `<h1 class="text-success">Blogger</h1>
      <a href="./components/login.html" class="login px-5 py-3 btn btn-success">
        Sign in
      </a>`;
  } else {
    const userData = JSON.parse(localStorage.getItem("login_token"));

    document.querySelector("header").innerHTML = `
    <div class="d-flex justify-content-between">
      <div>
      <h1 class="text-success fw-bold">Blogger</h1>
      <p class="fs-2 text text-white fw-bold text-decoration-underline">${userData.data.name}</p>
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
        <button type="submit" class="btn btn-success px-5 py-4 text-black">
          Write New!
        </button>
      </form>
      </div>
       <button class="btn btn-danger sign-out px-5 py-4 h-25">Sign out</button>
    </div>
   
    `;
    const signOutBtn = document.querySelector(".sign-out");
    signOutBtn.addEventListener("click", () => {
      localStorage.removeItem("login_token");
      window.location.href = "./components/login.html";
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
