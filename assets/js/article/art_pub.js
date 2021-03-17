$(function () {

    // 初始化分类
    let form = layui.form;
    let layer = layui.layer;
    // 渲染页面
    initCate();
    // 封装
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                };
                // 赋值，调用模板引擎
                let htmlStr = template('tpl-cate', { data: res.data });
                $('[name =cate_id]').html(htmlStr);
                form.render();
            },
        });
    };


    // 初始化富文本编译器
    initEditor();



    // 初始化图片裁剪器
    let $image = $('#image');
    // 裁剪选项
    let options = {
        aspectRatio: 400 / 400,
        preview: '.img-preview'
    }
    // 初始化裁剪区域
    $image.cropper(options);


    // 点击选择图片按钮
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    });


    // 设置图片
    $('#coverFile').change(function (e) {
        // 拿到用户选择的文件
        let file = e.target.files[0];
        // 非空校验，URL.createObjectURL() 不能为空
        if (file == undefined) {
            return;
        };
        let newImgURL = URL.createObjectURL(file);
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });


    let state = '已发布';
    $('#btnSave2').on('click', function () {
        state = '草稿';
    });


    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 创建 FormData 对象，收集数据
        let fd = new FormData(this);
        // 放入状态
        fd.append('state', state);
        // 放入图片
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 400,
        })
            // 将  cover 画布上的内容转为文件对象
            .toBlob(function (blob) {
                fd.append('cover_img', blob);

                publishArticle(fd);

            });
    });

    // 封装添加文章的方法
    function publishArticle(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/add',
            data: fd,
            // FormData 类型的提交 
            contentType: false,
            processData: false,
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                };
                // 发布成功
                layer.msg(res.message);
                // 跳转
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click();
                }, 1000);
            },
        });
    }




});