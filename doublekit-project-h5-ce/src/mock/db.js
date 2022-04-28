// 用mockjs模拟生成数据
const  Mock =require('mockjs')

const mr = Mock.Random;//提取mock的随机对象

//随机id和图片
const mapData = (n) => {
    var data = [];
    for (var i = 1; i <= n; i++) {

        data.push({
            id: i,
            title: "@ctitle(8,12)",
            des: "@csentence(10, 20)",
            time: "@integer(1553425967486,1553475967486)",
            detail:{
                auth:"@cname()",
                content:"@cparagraph(10,40)",
                auth_icon:mr.image('50x50', mr.color(), mr.cword(1))
            }
        })
    }
    return data
};

//json-server 要对象||函数(返回mock后的数据)
module.exports = {
    ...Mock.mock({
        'home': mapData(32),//解决 auth_icon 不随机
        'follow': mapData(21),
        'column': mapData(11),
        'banner|2': [
            {
                // 属性 id 是一个自增数，起始值为 1，每次增 1
                'id|+1': 1,
                title: "@ctitle(4,8)",//标题型中文4到8个字
                sub_title: "@ctitle(6,12)",
                banner: mr.image('750x501', mr.color(), mr.cword(4,10)),//banner不变
                time: "@integer(1553425967486,1553475967486)",
                detail:{
                    icon:mr.image('20x20', mr.color(), mr.cword(1,2)),//20X20尺寸
                    auth:"@cname()",//百家姓
                    content:"@cparagraph(10,40)"//正文
                }
            }
        ]
    })
};
