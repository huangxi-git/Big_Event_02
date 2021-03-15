$(function () {

    // 自定义验证
    let form = layui.form;
    form.verify({
        // 所有密码
        pwd: [
            /^[\S]{6,12}$/, '密码必须要6-12位，且不能带空格'
        ],
        // 新密码和旧密码不能重复
        samePwd: function (value) {
            // value 代表新密码，旧密码要获取
            if (value == $('[name=oldPwd]').val()) {
                return '新密码不能和旧密码重复！'
            };
        },

        // 两次输入的密码必须相同
        rePwd: function (value) {
            // value 是确认密码时输入的密码，新密码需要获取
            if (value !== $('[name=newPwd]').val()) {
                return '两次输入的密码不一致！'
            };
        },
    });


    // 表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                };
                layui.layer.msg('修改密码成功！');
                // 清空输入框
                $('.layui-form')[0].reset();
            },
        });
    })

});