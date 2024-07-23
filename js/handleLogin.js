import { httpClient } from "../module/client.js";
const formLogin = document.querySelector(".form-login");

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { email, password } = Object.fromEntries([...new FormData(e.target)]);
  const errors = {};
  if (!email) {
    errors.email = "Vui lòng nhập email";
  }
  if (!password) {
    errors.password = "Vui lòng nhập mật khẩu";
  }
  const errorElList = formLogin.querySelectorAll(".error");
  errorElList.forEach((errorEl) => {
    errorEl.innerText = "";
  });
  if (Object.keys(errors).length) {
    Object.keys(errors).forEach((key) => {
      const error = errors[key];
      const errorEl = loginForm.querySelector(`.error-${key}`);
      if (errorEl) {
        errorEl.innerText = error;
      }
    });
  } else {
    //Call API
    setLoadingBtn();
    const loginData = await login({
      email,
      password,
    });
    removeLoadingBtn;
    if (!loginData) {
      showMessage(loginForm, "Email hoặc mật khẩu không chính xác", "danger");
    } else {
      localStorage.setItem("login_token", JSON.stringify(loginData));
      window.location.href = "../index.html";
    }
  }
});

const login = async (loginData) => {
  const { response, data } = await httpClient.post(`/auth/login`, loginData);
  if (!response.ok) {
    return false;
  }
  return data;
};

const showMessage = (msg, type = "success") => {
  const msgEl = formLogin.querySelector(".msg");
  msgEl.innerHTML = `<div class="alert alert-${type} text-center">${msg}</div>`;
};

const setLoadingBtn = () => {
  const btn = formLogin.querySelector(".btn");
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span><span> Loading...</span>`;
};
const removeLoadingBtn = () => {
  const btn = formLogin.querySelector(".btn");
  btn.innerText = "Đăng nhập";
  btn.disabled = false;
};
