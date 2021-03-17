$(function () {

    // 文章类别列表显示
    initArtCateList();
    // 封装函数
    function initArtCateList() {
        // 发送请求
        $.ajax({
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                let str = template('tpl-art-cate', { data: res.data });
                $('tbody').html(str);
            },
        });
    };

    // 空变量保存窗口
    let indexAdd = null;

    // 显示添加文章分类列表
    // 弹出添加框
    let layer = layui.layer;
    $('#btnAdd').click(() => {
        // 利用框架提供的代码，显示提示添加文章类别区域
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-add').html(),
        })
    });



    // 提交文章分类添加---事件委托
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        // 发送请求
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    // 添加失败
                    return layer.msg(res.message);
                };
                // 添加成功
                layer.msg('添加成功！');
                // 重新渲染页面
                initArtCateList();
                // 关闭弹窗
                layer.close(indexAdd);
            },
        });
    });



    // 修改 --edit
    let indexEdit = null;
    let form = layui.form;
    // 点击当前 分类的 编辑按钮----事件委托
    // 弹出对话框
    $('tbody').on('click', '#btn-edit', function () {
        // 利用框架提供的代码，显示提示添加文章类别区域
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-edit').html(),
        });
        // 获取当前点击的 id 
        let Id = $(this).attr('data-id');
        // console.log(Id);
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + Id,
            success: (res) => {
                // console.log(res);     //  拿到当前点击这条数据
                // 发送请求后拿到当前点击的这条数据，将数据显示到编辑的输入框
                form.val('form-edit', res.data);
            },
        });
    });


    // 提交事件--修改分类内容后提交返回到服务器
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res); 
                if (res.status !== 0) {
                    // 修改失败
                    return layer.msg(res.message);
                };
                layer.msg('修改成功！');
                // 重新渲染页面
                initArtCateList();
                // 关闭弹窗
                layer.close(indexEdit);
            },
        });
    });


    // 点击后删除
    $('tbody').on('click', '.btn-delete', function () {
        // 先获取当前点击的 id
        let Id = $(this).attr('data-id');
        // 显示对话框询问是否删除
        // layui 提供的询问框
        layer.confirm('是否删除？', { icon: 3, title: '提示' }, function (index) {
            // 发送请求
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + Id,
                success: (res) => {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    };
                    layer.msg('删除成功！');
                    // 关闭窗口
                    layer.close(index);
                    // 重新渲染页面
                    initArtCateList();
                },
            });
        })

    })






});