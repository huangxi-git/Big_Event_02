// 开发环境服务器地址
let baseURL = 'http://api-breakingnews-web.itheima.net';
// 测试环境服务器地址
// let baseURL = 'http://api-breakingnews-web.itheima.net';
// 生产环境服务器地址
// let baseURL = 'http://api-breakingnews-web.itheima.net';

// 拦截所有ajax请求，
$.ajaxPrefilter(function (params) {
    // 拼接对应环境的服务器地址
    params.url = baseURL + params.url;
})