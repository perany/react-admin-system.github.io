/**
 * request 网络请求工具
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
import {extend} from "umi-request";
import {notification} from "antd";
import router from "umi/router";
import proxyConfig from "../../config/proxyConfig";
import {getUser} from "@/utils/authority";

const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。"
};

/**
 * 异常处理程序
 */
const errorHandler = error => {
  const {response = {}} = error;
  const errortext =
    codeMessage[response.status] || response.statusText || response.message;
  const {status, url} = response;

  if (status === 401) {
    notification.error({
      message: "未登录或登录已过期，请重新登录。"
    });
    // @HACK
    /* eslint-disable no-underscore-dangle */
    window.g_app._store.dispatch({
      type: "login/logout"
    });
    return;
  }
  notification.error({
    message: status && url ? `请求错误 ${status}: ${url}` : "请求错误",
    description: errortext
  });
  // environment should not be used
  if (status === 403) {
    router.push("/exception/403");
    return;
  }
  if (status <= 504 && status >= 500) {
    router.push("/exception/500");
    return;
  }
  if (status >= 404 && status < 422) {
    router.push("/exception/404");
  }
  throw error;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: "include" // 默认请求是否带上cookie
  // headers: {
  //   Some: 'header' // unified headers
  // },
  // params: {
  //   token: 'token' // the query parameter to be included with each request
  // }
});

//request interceptor, change url or options.
request.interceptors.request.use((url, options) => {
  //access check
  let user = getUser();
  let reqParams = {...options.params};
  let headers = {...options.headers};
  if (user) {
    reqParams = {...options.params, token: user.token};
    headers = {...options.headers, token: user.token};
  }
  // url
  let path = "";
  var isAbsoluteURL = url.substr(0, 4) === "http";
  // dev remove url-prefix
  if (
    (!isAbsoluteURL &&
      (process.env.MOCK === "none" &&
        process.env.NODE_ENV === "development")) ||
    process.env.NODE_ENV === "production" ||
    process.env.build_env
  ) {
    path = url.substr(url.indexOf("/", 1)) || "";
    url = proxyConfig.postServer + path;
  }
  // proxy match 前端实现生产环境多代理转发配置
  // if (proxyConfig.proxy) {
  //   Object.keys(proxyConfig.proxy).forEach(value => {
  //     if (new RegExp("^" + value, 'g').test(path)) {
  //       url = proxyConfig.proxy[value] + path;
  //     }
  //   })
  // }
  return {
    options: {
      ...options,
      interceptors: options.interceptors !== false,
      headers,
      params: reqParams
    },
    url: url
  };
});

// response interceptor, handling response
request.interceptors.response.use(async (response, options) => {
  // response.headers.append('interceptors', 'yes yo');
  const res = await response.clone().json();
  if (
    options.interceptors &&
    res.ret &&
    res.ret !== 0 &&
    (res.message || res.msg)
  ) {
    message.error(res.message || res.msg);
  }
  return response;
});

export default request;
