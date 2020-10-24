import axios from "axios";
import router from "../route";
function AxiosReaction(apiType, msg) {
  if (apiType == "create_account" && msg == "Successed") {
    router.push("/login");
    return;
  }

  if (msg == "Not login.") {
    router.push("/login").catch(() => {});
  }
  if (msg == "Successed") {
    router.push("/").catch(() => {});
  }
  console.log(apiType, " : ", msg);
}

const sywekAxios = {
  get: async (url, config = {}, withCredentials = false) => {
    withCredentials ? (config.withCredentials = true) : (config.withCredentials = false);
    let _ret = await axios.get(url, config);
    AxiosReaction(_ret.data.type, _ret.data.msg);
    return _ret.data;
  },
  delete: async (url, config = {}, withCredentials = false) => {
    withCredentials ? (config.withCredentials = true) : (config.withCredentials = false);

    let _ret = await axios.delete(url, config);
    AxiosReaction(_ret.data.type, _ret.data.msg);
    return _ret.data;
  },
  post: async (url, data, config = {}, withCredentials = false) => {
    withCredentials ? (config.withCredentials = true) : (config.withCredentials = false);

    let _ret = await axios.post(url, data, config);
    AxiosReaction(_ret.data.type, _ret.data.msg);
    return _ret.data;
  },
  put: async (url, data, config = {}, withCredentials = false) => {
    withCredentials ? (config.withCredentials = true) : (config.withCredentials = false);

    let _ret = await axios.put(url, data, config);
    AxiosReaction(_ret.data.type, _ret.data.msg);
    return _ret.data;
  },
  patch: async (url, data, config = {}, withCredentials = false) => {
    withCredentials ? (config.withCredentials = true) : (config.withCredentials = false);

    let _ret = await axios.patch(url, data, config);
    AxiosReaction(_ret.data.type, _ret.data.msg);
    return _ret.data;
  },
};

export default sywekAxios;
