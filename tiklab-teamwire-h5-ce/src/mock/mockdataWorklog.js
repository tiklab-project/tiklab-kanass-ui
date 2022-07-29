import Mock from "mockjs";


let data = [
    {
        key: '1',
        content: '了解系统整体需求',
        recorder: "张三",
        time: "5",
        recordDate: '2021.01.03'
    },
    {
        key: '2',
        content: '编写架构设计说明书',
        recorder: "张三",
        time: "3",
        recordDate: '2021.01.03'
    },
    {
        key: '3',
        content: '组织架构设计说明书评审',
        recorder: "张三",
        time: "2",
        recordDate: '2021.01.03'
    },
];

Mock.mock("/workLoglist", { data });

var Random = Mock.Random
Random.increment(3)
let addWorKLogs = function(options){
    let body = JSON.parse(options.body);
    body.key = Mock.mock('@increment()')
    data = data.concat(body)
    return {
        data:data
    }
}
Mock.mock("/addWorkLog", addWorKLogs);


let deleteWorKLog = function(options){
    const newData = data.filter((item)=> {
        return item.key !== options.body
    })
    data= newData
    return {
        data: data
    }
}
Mock.mock("/deleteWorKLog", deleteWorKLog);

let editWorKLog = function(options){
    let body = JSON.parse(options.body);
    
    let userindex = ""
    data.forEach(function(e,index){
        if(e.key === body.key){
            userindex = index
        }
    })
    // debugger
    Object.assign(data[userindex],body)
    return {
        data: data
    }
}
Mock.mock("/editWorKLog", editWorKLog);

let searchWorKLog = function(options){
    const newData = data.filter((item)=> {
        return item.key === options.body
    })
    return {
        data: newData
    }
}
Mock.mock("/searchWorKLog", searchWorKLog);