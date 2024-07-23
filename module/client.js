import { config } from "./config.js";
export const httpClient = {
  serverApi: config.SERVER_API ?? null,
  token: null,
  send: async function (url, method = "GET", body = null, headers = {}) {
    try {
      if (!this.serverApi) {
        throw new Error("Vui lòng cập nhật serverApi");
      }
      url = this.serverApi + url;
      headers["Content-Type"] = "application/json";
      if (this.token) {
        headers["Authorization"] = `Bearer ${this.token}`;
      }
      const options = {
        method,
        headers,
      };
      if (body) {
        options.body = JSON.stringify(body);
      }
      const response = await fetch(url, options);
      const data = await response.json();
      return { response, data };
    } catch (e) {
      console.log(e.message);
    }
  },
  get: function (url, headers = {}) {
    return this.send(url, "GET", null, headers);
  },
  post: function (url, body, headers = {}) {
    return this.send(url, "POST", body, headers);
  },
  put: function (url, body, headers = {}) {
    return this.send(url, "PUT", body, headers);
  },
  patch: function (url, body, headers = {}) {
    return this.send(url, "PATCH", body, headers);
  },
  delete: function (url, headers = {}) {
    return this.send(url, "DELETE", null, headers);
  },
};

/*
const client = httpClient();
client.get('/users')
*/
