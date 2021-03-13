$(function () {

    // 调用函数
    getUserInfo();
});



// 全局函数要在入口函数外面
// 其他页面能调用
function getUserInfo() {
    // 发送请求
    $.ajax({

        url: '/my/userinfo',
        headers: {

            Authorization: localStorage.getItem('token') || '',
        },
        success: (res) => {
            console.log(res);
            // 请求成功
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            };

            // 请求成功后，渲染头像
            renderAvatar(res.data);
        },
    });
};


// 渲染头像全局函数
function renderAvatar(user) {
    // 渲染名称
    let name = user.nickname || user.username;
    $('#welcome').html('欢迎 ' + name);
    // 渲染头像
    if (user.user_pic !== null) {
        // 判断头头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide();
    } else {
        // 判断没有头像
        $('.layui-nav-img').hide();
        // 拿到名字第一个字母并转为大写
        let text = name[0].toUpperCase();
        $('.text-avatar').show().html(text);
    };

};