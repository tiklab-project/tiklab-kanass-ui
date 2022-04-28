import Mock from "mockjs";
// import workChildstore from "../view/home/workChild/store/workChildstore";
var workChildList = [
    {
        "id": "32fbea4f5db213996a8b8b1d0f5606ee",
        "title": "事项1",
        "workType": "需求",
        "workStatus": "已完成",
        "assigner": "飞飞"
    },
    {
        "id": "5c7ebef0a5338167226747ef2928b31e",
        "title": "事项2",
        "workType": "需求",
        "workStatus": "已完成",
        "assigner": "飞飞"
    },
    {
        "id": "72cfe9ffc71e7435f398a610611d93d4",
        "title": "事项3",
        "workType": "需求",
        "workStatus": "已完成",
        "assigner": "飞飞"
    }
];
var selectWorkChildList = [
    {
        "id": "8efd424ae03f6c72542b62db26753d30",
        "title": "事项4",
        "workType": "需求",
        "workStatus": "已解决",
        "assigner": "飞飞"
    },
    {
        "id": "8f3ddf94d45e75d471c79fb8b6f1b660",
        "title": "事项5",
        "workType": "需求",
        "workStatus": "已完成",
        "assigner": "飞飞"
    },
    {
        "id": "8f9d7fc6d595d12bba289bf77fbea065",
        "title": "事项6",
        "workType": "需求",
        "workStatus": "已完成",
        "assigner": "飞飞"
    }
];
Mock.mock("/workChildList", { workChildList });
Mock.mock("/selectWorkChildList", { selectWorkChildList });
let workChildAdd = function (options){
    const body = JSON.parse(options.body);
    selectWorkChildList = selectWorkChildList.concat(body)
    body.forEach(bodyItem=> {
        workChildList=workChildList.filter((item)=> {
            return !(bodyItem.id === item.id)
        })
    })
    return {
        selectWorkChildList: selectWorkChildList,
        workChildList: workChildList
    }
}
Mock.mock("/addWorkChildList", workChildAdd);
//删除
let deleWorkChild = function (options){
    // console.log(options)
    // const body = JSON.parse(options.body);
    const newWorkChildList = selectWorkChildList.filter((item)=> {
        return item.id === options.body
    })
    workChildList = workChildList.concat(newWorkChildList)
    selectWorkChildList=selectWorkChildList.filter((item)=> {
        return !(item.id === options.body)
    })
    return {
        selectWorkChildList: selectWorkChildList,
        workChildList: workChildList
    }
}
Mock.mock("/deleWorkChildList", deleWorkChild);
let searchWorkChild = function (options){
    console.log(options)
    let newSelectWorkChildList = []
    if(options.body){
        newSelectWorkChildList=selectWorkChildList.filter((item)=> {
            return (item.id === options.body || item.title.indexOf(options.body) !== -1)
        })
    }else {
        newSelectWorkChildList = selectWorkChildList
    }
    return {
        selectWorkChildList: newSelectWorkChildList
    }
}
Mock.mock("/searchWorkChild", searchWorkChild);

let searchAllWorkChild = function (options){
    let newWorkChildList = []
    if(options.body){
        newWorkChildList = workChildList.filter((item)=> {
            return (item.id === options.body || 
                    item.title.indexOf(options.body) !== -1
                    )
        })
    }else {
        newWorkChildList = workChildList
    }
    return {
        workChildList: newWorkChildList
    }
}
Mock.mock("/searchAllWorkChild", searchAllWorkChild);