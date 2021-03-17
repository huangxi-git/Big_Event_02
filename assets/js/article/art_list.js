$(function () {
    // 时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        let dt = new Date(dtStr);
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());
        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());
        return `${y} * ${m} * ${d} ${hh}: ${mm}: ${ss}`;
    };

    // 当数值小于10 时，前面补 0
    function padZero(num) {
        return num < 10 ? '0' + num : num;
    }

    // 定义提交参数
    let q = {
        pagenum: 1,     //	是	int	页码值
        pagesize: 2,    //	是	int	每页显示多少条数据
        cate_id: '',    //	否	string	文章分类的 Id
        state: '',      //	否	string	文章的状态，可选值有：已发布、草稿
    };

    // 渲染页面
    initTable();

    // 初始化文章列表
    let layer = layui.layer;
    // 封装初始化文章列表函数--服务器数据显示到页面
    function initTable() {
        // 发送请求
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: q,
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败！');
                };
                // layer.msg('获取成功！');
                // 获取成功--显示到页面
                let htmlStr = template('tpl-table', { data: res.data });
                $('tbody').html(htmlStr);

                // 调用分页
                renderPage(res.total);
            },
        });
    };


    // 筛选区域
    let form = layui.form;
    // 渲染页面
    initCate();
    // 封装函数
    function initCate() {
        // 发s送请求
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                };

                // 调用模板引擎
                let htmlStr = template('tpl-cate', { data: res.data });
                $('[name=cate_id]').html(htmlStr);      // 此时无法显示
                form.render();      // 此代码：
            },
        });
    };



    // 点击筛选按钮
    $('#form-search').on('submit', function (e) {
        // console.log(11999);
        e.preventDefault();
        // 获取下拉框内容
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        console.log(cate_id, state);
        // 赋值 传给 服务器
        q.cate_id = cate_id;
        q.state = state;
        // 重新渲染页面
        initTable();

    });



    // 分页
    let laypage = layui.laypage;
    function renderPage(total) {
        // alert(total);
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,

            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5],

            // 分页初始化的时候触发 jump ，页码改变的时候触发 jump
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                // 赋值页面
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;

                //首次不执行
                if (!first) {
                    //do something
                    initTable();
                };
            },
        });
    };


    // 点击删除
    $('tbody').on('click', '.btn-delete', function () {
        // 先获取当前点击删除按钮的 索引
        let Id = $(this).attr('data-id');
        // console.log(Id);
        // layui 提供的 询问对话框
        layer.confirm('是否删除？', { icon: 3, title: '提示' }, function (index) {
            // 发送请求
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + Id,
                success: (res) => {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    };
                    layer.msg(res.message);
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) {
                        // 删除按钮的个数等于1，且页码大于1 时，执行下面代码
                        q.pagenum--;
                    }
                    // 重新渲染页面
                    initTable();
                    // 关闭对话框
                    layer.close(index);
                },
            });
        })
    })












});