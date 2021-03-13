$(function () {
    // 点击去注册按钮
    $('#link_reg').click(() => {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 点击去登录按钮
    $('#link_login').click(() => {
        $('.reg-box').hide();
        $('.login-box').show();
    });

    // 自定义验证
    let form = layui.form;
    form.verify({
        // 验证密码长度
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 确认密码验证
        repwd: function (value) {
            // 属性选择器
            let pwd = $('.reg-box input[name=password]').val();
            // 比较
            if (value !== pwd)
                return "两次密码不一样！";
        }
    });



    // 注册功能
    let layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        // 阻止表单提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: $('.reg-box input[name=username]').val(),
                password: $('.reg-box input[name=password]').val(),
            },
            success: (res) => {
                console.log(res);
                // 提交不成功
                if (res.status != 0) {
                    return layer.msg(res.message);
                };
                // 提交成功后
                layer.msg(res.message);
                // 手动切换到登录页面
                $('#link_login').click();
                // 重置form表单
                $('#form_reg')[0].reset();

            },
        });
    });


    // 登录功能
    $('#form_login').submit(function (e) {
        e.preventDefault();
        // 发送请求
        $.ajax({
            type: 'post',
            url: '/api/login',
            // form 表单有 name属性的
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                // 提交失败
                if (res.status !== 0) {
                    return layer.msg(res.message);
                };
                // 提交成功，，跳转页面
                layer.msg('登录成功');
                // 保存token,未来接口要用到
                localStorage.setItem('token', res.token);
                // 跳转
                location.href = '/index.html';
            },
        });
    })













});