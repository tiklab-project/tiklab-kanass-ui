import Mock from "mockjs";
var data = {
    totalRecord: "30",
    dataList:
    [
        {
            project: "项目1",
            work: "需求",
            status: "未开始",
            user: "成员1",
            priority:"高",
            module: "模块1",
            sprint:"迭代1",
            title: "标题1",
            id: Mock.mock('@id'),
            priorityDes: "描述1",
            children: [{
                project: "项目1子项目",
                work: "需求",
                status: "未开始",
                user: "成员1",
                priority:"高",
                module: "模块1",
                sprint:"迭代1",
                title: "标题1",
                id: Mock.mock('@id'),
                priorityDes: "描述1"
            }]
        },
        {
            project: "项目1",
            work: "需求",
            status: "未开始",
            user: "成员1",
            priority:"高",
            module: "模块1",
            sprint:"迭代1",
            title: "标题2",
            id: Mock.mock('@id'),
            priorityDes: "描述2"
        },
        {
            project: "项目1",
            work: "需求",
            status: "未开始",
            user: "成员1",
            priority:"高",
            module: "模块1",
            sprint:"迭代1",
            title: "标题3",
            id: Mock.mock('@id'),
            priorityDes: "描述3"
        },
        {
            project: "项目1",
            work: "需求",
            status: "未开始",
            user: "成员1",
            priority:"高",
            module: "模块1",
            sprint:"迭代1",
            title: "标题4",
            id: Mock.mock('@id'),
            priorityDes: "描述4"
        }
    ]
};

Mock.mock("/worklist", { data });

var workType = [
    {
        key: "10001",
        value: "需求"
    },
    {
        key: "10002",
        value: "子需求"
    },
    {
        key: "10003",
        value: "任务"
    },
    {
        key: "10004",
        value: "子任务"
    },
    {
        key: "10005",
        value: "缺陷"
    }
]
Mock.mock("/workType", { workType });

var priority = [
    {
        key: "0",
        value: "高"
    },
    {
        key: "1",
        value: "中"
    },
    {
        key: "2",
        value: "低"
    }
]
Mock.mock("/priority", { priority });

let addWork= function (options){
    const body = JSON.parse(options.body);
    body.id = Mock.mock('@id')
    data = data.concat(body)
    return {
        data:data
    }
}


Mock.mock("/addWork", addWork);

let detWork= function (options){
    if(JSON.parse(localStorage.getItem("workList")).length !== 0){
        data = JSON.parse(localStorage.getItem("workList"))
    }
    const newData = data.filter((item)=> {
        return item.id !== options.body
    })
    return {
        data:newData
    }
}
Mock.mock("/detWork", detWork);

let searchWork= function (options){
    if(JSON.parse(localStorage.getItem("workList"))){
        if(JSON.parse(localStorage.getItem("workList")).length !== 0){
            data = JSON.parse(localStorage.getItem("workList"))
        }
    }
    let defaultCurrent=""
    const body = JSON.parse(options.body);   
    const newData = data.filter((item,index)=> {
        if(item.id === body.id){
            defaultCurrent = index+1
            return item.id === body.id
        }
        if((body.page-1) === index){
            defaultCurrent = index+1
            return index = body.page
        }
    })
    return {
        data:newData,
        defaultCurrent:defaultCurrent
    }
}
Mock.mock("/searchWork", searchWork);

let searchWorkList= function (options){
    if(JSON.parse(localStorage.getItem("workList")).length !== 0){
        data = JSON.parse(localStorage.getItem("workList"))
    }
    const body = JSON.parse(options.body);
    console.log(body)
    let newData = data.filter((item)=> {
        if(body.project !== "all"){
            return item.project === body.project
        } else {
            return item;
        }
        
    })
    newData = newData.filter((item)=> {
        if(body.work !== "all"){
            return item.work === body.work
        } else {
            return item;
        }
        
    })
    newData = newData.filter((item)=> {
        if(body.status !== "all"){
            return item.status === body.status
        } else {
            return item;
        }
        
    })
    newData = newData.filter((item)=> {
        if(body.user !== "all"){
            return item.user === body.user
        } else {
            return item;
        }
        
    })
    newData = newData.filter((item)=> {
        if(body.title){
            return item.title === body.title
        } else {
            return item;
        }
        
    })
    console.log(newData)
    return {
        data:newData
    }
}
Mock.mock("/searchWorkList", searchWorkList);

let editWork= function (options){
    if(JSON.parse(localStorage.getItem("workList")).length !== 0){
        data = JSON.parse(localStorage.getItem("workList"))
    }
    const body = JSON.parse(options.body);
    let newData = "";
    data.map((item,index)=> {
        if(item.id === body.id){
            newData = index
            return;
        }
    })
    console.log(newData)
    data[newData] = body
    return {
        data:data
    }
}
Mock.mock("/editWork", editWork);