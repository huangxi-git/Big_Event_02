$(function () {

    // layui 提供的
    let form = layui.form;
    // 判断昵称输入长度
    form.verify({
        nickname: function (value) {
            if (value.length < 1 || value.length > 6) {
                return '昵称长度为1-6';
            };
        },
    });

    // 页面渲染
    initUserInfo();
    // 导出layer
    let layer = layui.layer;
    // 封装函数
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    // 获取失败
                    return layer.msg(res.message);
                };
                // 获取成功,重新渲染
                form.val('formUserInfo', res.data);
            },
        });
    };


    // 点击重置，重置表单
    $('#btnReset').click((e) => {
        e.preventDefault();
        // 重新渲染页面
        initUserInfo();
    });


    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        // 发送请求
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败！');
                };
                layer.msg('用户信息修改成功！');
                // 调用父级页面中的更新用户信息和头像方法
                window.parent.getUserInfo();
            },
        });
    })



});