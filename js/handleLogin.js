import { httpClient } from "../module/client.js";
const formLogin = document.querySelector(".form-login");

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { email, password } = Object.fromEntries([...new FormData(e.target)]);
  const errors = {};
  const regexEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,30}$/;
  if (!email) {
    errors.email = "Vui lòng nhập email";
  } else if (!regexEmail.test(email)) {
    errors.email = "Email không hợp lệ";
  }
  if (!password) {
    errors.password = "Vui lòng nhập mật khẩu";
  } else if (password.length < 8) {
    errors.password = "Mật khẩu phải có ít nhất 8 ký tự";
  } else if (password.length > 30) {
    errors.password = "Mật khẩu có tối đa 30 ký tự";
  } else if (!/[a-z]/.test(password)) {
    errors.password = "Mật khẩu phải chứa ít nhất 1 chữ cái thường";
  } else if (!/[A-Z]/.test(password)) {
    errors.password = "Mật khẩu phải chứa ít nhất 1 chữ cái hoa";
  }
  const errorElList = formLogin.querySelectorAll(".error");
  errorElList.forEach((errorEl) => {
    errorEl.innerText = "";
  });
  if (Object.keys(errors).length) {
    Object.keys(errors).forEach((key) => {
      const error = errors[key];
      const errorEl = formLogin.querySelector(`.error-${key}`);
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
    removeLoadingBtn();
    if (!loginData) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Email hoặc mật khẩu không chính xác",
        showConfirmButton: false,
        timer: 2000,
      });
      removeLoadingBtn();
    } else {
      localStorage.setItem(
        "login_token",
        JSON.stringify({
          accessToken: loginData.data.accessToken,
          refreshToken: loginData.data.refreshToken,
        })
      );
      window.location.href = "../index.html";
    }
  }
});

const login = async (loginData) => {
  try {
    const { response, data } = await httpClient.post(`/auth/login`, loginData);
    if (!response.ok) {
      return false;
    }
    return data;
  } catch {}
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
