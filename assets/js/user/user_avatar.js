$(function () {

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)



    // 选择图片文件
    // 点击上传按钮
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    });


    // 点击上传按钮后修改裁剪照片，通过 change 
    $('#file').on('change', function (e) {
        // 拿到用户选择的文件
        let file = this.files[0];
        // 非空校验
        if (file == undefined) {
            return layer.msg('请选择照片！');
        };
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file);
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });


    // 点击确认按钮
    $('#btnUpload').on('click', function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // console.log(dataURL);           // 图片地址

        // 发送请求
        $.ajax({
            type: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL,
            },
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                };
                layer.msg('更新头像成功！');
                // 重新页面渲染
                window.parent.getUserInfo();
            },
        });

    });

});