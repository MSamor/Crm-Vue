"use strict";

import Vue from 'vue';
import axios from "axios";
import { Loading } from 'element-ui';

// let AUTH_TOKEN = window.sessionStorage.getItem("token")
// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: "http://localhost:8889",
  baseURL: "http://www.codebest.cn:8081",
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  timeout: 60 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);
let loadingInstance
_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    let AUTH_TOKEN = window.sessionStorage.getItem("token")
    axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

    //加载
    loadingInstance = Loading.service({
      fullscreen: true ,
      lock: true, //是否锁定
      text: "拼命加载中...", //显示在加载图标下方的加载文案
      background: 'rgba(0,0,0,.1)', //遮罩背景色
    });
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    loadingInstance.close()
    return response;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

Plugin.install = function (Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;