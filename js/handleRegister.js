import { httpClient } from "../module/client.js";
const formRegister = document.querySelector(".form-register");

formRegister.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { name, email, password } = Object.fromEntries([
    ...new FormData(e.target),
  ]);
  const errors = {};
  const regexEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  if (!name) {
    errors.name = "Vui lòng nhập tên của bạn";
  }
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
  const errorElList = formRegister.querySelectorAll(".error");
  errorElList.forEach((errorEl) => {
    errorEl.innerText = "";
  });
  if (Object.keys(errors).length) {
    Object.keys(errors).forEach((key) => {
      const error = errors[key];
      const errorEl = formRegister.querySelector(`.error-${key}`);
      if (errorEl) {
        errorEl.innerText = error;
      }
    });
  } else {
    //Call API
    setLoadingBtn();
    const registerData = await login({
      email,
      password,
      name,
    });
    removeLoadingBtn();
    if (!registerData) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Email đã tồn tại",
        showConfirmButton: false,
        timer: 2000,
      });
      removeLoadingBtn();
    } else {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Đăng ký thành công",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        window.location.href = "./login.html";
      }, 1600);
    }
  }
});

const login = async (registerData) => {
  try {
    const { response, data } = await httpClient.post(
      `/auth/register`,
      registerData
    );
    if (!response.ok) {
      return false;
    }
    return data;
  } catch {}
};

const setLoadingBtn = () => {
  const btn = formRegister.querySelector(".regist");
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span><span> Loading...</span>`;
};
const removeLoadingBtn = () => {
  const btn = formRegister.querySelector(".regist");
  btn.innerText = "Đăng ký";
  btn.disabled = false;
};
