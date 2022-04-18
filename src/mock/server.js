// const  Mock =require('mockjs')
// const  jsonServer =require('json-server')
// const db = require('./db.js');//引入mockjs配置模块
//
//
// let mr = Mock.Random;//提取mock的随机对象
//
// const server = jsonServer.create();//创建jsonserver 服务对象
// const router = jsonServer.router(db);//创建路由对象
// const middlewares = jsonServer.defaults();
//
// let mock='/mock';//创建根api名 这里的 /mock 如同 后端真实/api
//
// //路由自定义
// const rewriter = jsonServer.rewriter({
//     [mock+"/*"]: "/$1",
//     "/product\\?dataName=:dataName": "/:dataName",
//     "/banner\\?dataName=:dataName": "/:dataName",
//     "/detail\\?dataName=:dataName&id=:id": "/:dataName/:id",
// });
//
// server.use(middlewares);
//
// server.use((request, res, next) => {//可选 统一修改请求方式
//     // request.method = 'GET';
//     next();
// });
//
// server.use(jsonServer.bodyParser);//抓取body数据使用json-server中间件
//
// //模拟校验
// server.use(mock+'/login', (req, res) => {
//     console.log(req.query, req.body);//抓取提交过来的query和body
//     let username=req.body.username;
//     let password=req.body.password;
//     (username === 'aa' && password === 'aa123')?
//         res.jsonp({
//             "error": 0,
//             "msg": "登录成功",
//             "data": {
//                 "follow": mr.integer(1,5),
//                 "fans": mr.integer(1,5),
//                 "nikename": mr.cname(),
//                 "icon": mr.image('20x20',mr.color(),mr.cword(1)),
//                 "time": mr.integer(13,13)
//             }
//         }) :
//         res.jsonp({
//             "error": 1,
//             "msg": "登录失败",
//         })
//
// });
// server.use(mock+'/logout', (req, res) => {
//     res.jsonp({
//         "error": 0,
//         "msg": "退出成功",
//         data:null
//     })
// });
//
// server.use(rewriter);//路由重写
// server.use(router);//路由响应
//
// router.render = (req, res) => {
//     let len = Object.keys(res.locals.data).length;
//     console.log(len, 'render');
//     setTimeout(()=>{
//         res.jsonp({
//             error: len !== 0 ? 0 : 1,
//             msg: len !== 0 ? '成功' : '失败',
//             data: res.locals.data
//         })
//     },1000)
// };
//
// server.listen(3334, () => {
//     console.log('mock server 3334 is running')
// });

import Mock from 'mockjs'
let mr = Mock.Random;//提取mock的随机对象

Mock.mock('/mock/tree', 'get',{
    "data": [{
        'id|2-3': /\d{5,10}\-/,
        'title':mr.title(3, 5),
        "create-data": '@date("yyyy-MM-dd hh:mm:ss")',
        "update-data": '@date("yyyy-MM-dd hh:mm:ss")',
        "children|0-10": [{
            'id|2-3': /\d{5,10}\-/,
            'title':mr.title(3, 5),
            "create-data": '@date("yyyy-MM-dd hh:mm:ss")',
            "update-data": '@date("yyyy-MM-dd hh:mm:ss")',
        }]
    }],
    error:0,
    msg:'成功'
});



Mock.mock('/mock/addTree', 'post',(option) => {
    const body = JSON.parse(option.body)
    return Mock.mock({
        "data": {
            'id|2-3': /\d{5,10}\-/,
            'title':body.org,
            "create-data": '@date("yyyy-MM-dd hh:mm:ss")',
            "update-data": '@date("yyyy-MM-dd hh:mm:ss")',
        },
        error:0,
        msg:'成功'
    })
});

Mock.mock('/mock/editTree', 'post',(option) => {
    const body = JSON.parse(option.body)
    return Mock.mock({
        "data": {
            'id': body.id,
            'title':body.org,
            "create-data": '@date("yyyy-MM-dd hh:mm:ss")',
            "update-data": '@date("yyyy-MM-dd hh:mm:ss")',
        },
        error:0,
        msg:'成功'
    })
});


Mock.mock('/mock/org', 'get',{
    "data": {
        'id': mr.guid(),
        'org':mr.title(3, 5),
        'parent':mr.title(3, 5),
        "create-data": '@date("yyyy-MM-dd hh:mm:ss")',
        "update-data": '@date("yyyy-MM-dd hh:mm:ss")',

    },
    error:0,
    msg:'成功'
});



Mock.mock('/mock/users', 'get',{
    "data|5-20": [{
        'id': '@guid',
        'name':'@cname',
        'org':'技术研发中心',
        'type':'内部',
        'account':"@email",
        "create-data": '@date("yyyy-MM-dd hh:mm:ss")',
        "update-data": '@date("yyyy-MM-dd hh:mm:ss")',

    }],
    error:0,
    msg:'成功'
});

Mock.mock('/mock/adduser', 'post',function (options) {
    const body = JSON.parse(options.body)
    return Mock.mock({
        "data": {
            'id': '@guid',
            ...body,
            "create-data": '@date("yyyy-MM-dd hh:mm:ss")',
            "update-data": '@date("yyyy-MM-dd hh:mm:ss")',
        },
        error:0,
        msg:'成功'
    })
});

Mock.mock('/mock/editUser', 'post',function (options) {
    const body = JSON.parse(options.body)
    return Mock.mock({
        "data": {
            ...body,
            "create-data": '@date("yyyy-MM-dd hh:mm:ss")',
            "update-data": '@date("yyyy-MM-dd hh:mm:ss")',
        },
        error:0,
        msg:'成功'
    })
});


