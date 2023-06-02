import axios from "axios";
import { baseUrl } from "@/libs/util";
import { message } from "ant-design-vue";

const ax = axios.create({
  headers: {},
  method: "POST",
});
// ax.defaults.withCredentials = true
// 设置过滤器
ax.interceptors.request.use(
  function (config) {
    // config.headers.Authorization = 'Bearer ' + localStorage.token
    // config.headers['X-Village-Id'] = localStorage.getItem('villageId')
    // config.headers['X-User-Id'] = localStorage.getItem('userId')
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);
ax.interceptors.response.use(
  function (re) {
    return re.data;
  },
  function (err) {
    let response = err.response;

    message.destroy();
    console.log("错误");
    console.log(response);
    message.error(response?.data?.detail || "请求错误", 4);

    return Promise.reject(response.data);
  }
);
const _fetch = (type, link, params, server) => {
  if (!link.match(/^http/)) {
    link = baseUrl + link;
  }
  return ax[type](link, params);
};
const fetch = {
  post(link, params, server = "ops") {
    return _fetch("post", link, params, server);
  },
  put(link, params, server = "ops") {
    return _fetch("put", link, params, server);
  },
  get(link, params, server = "ops") {
    return _fetch("get", link, params, server);
  },
  delete(link, params, server = "ops") {
    return _fetch("delete", link, params, server);
  },
  uploadPost(link, params, server = "ops") {
    if (!link.match(/^http/)) {
      link = baseUrl + link;
    }
    return ax.post(link, params, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
export default fetch;
