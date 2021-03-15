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

    // 身份验证
    // !== -1 : 证明为true
    if (params.url.indexOf('/my/') !== -1) {
        params.headers = {
            // 以 / my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功
            Authorization: localStorage.getItem('token') || '',
        };
    };


    // 拦截所有响应，判断身份验证信息
    params.complete = function (res) {
        // console.log(res.responseJSON);
        let obj = res.responseJSON;
        if (obj.status == 1 && obj.message == '身份认证失败！') {
            // 清空本地 token 
            localStorage.removeItem('token');
            // 页面跳转
            location.href = '/login.html';
        }
    }



})