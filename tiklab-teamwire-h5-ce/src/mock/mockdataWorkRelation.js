import Mock from "mockjs";
// import workRelationstore from "../view/home/workRelation/store/workRelationstore";
var workRelationList = [
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
var selectWorkRelationList = [
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
Mock.mock("/workRelationList", { workRelationList });
Mock.mock("/selectWorkRelationList", { selectWorkRelationList });
let workRelationAdd = function (options){
    const body = JSON.parse(options.body);
    selectWorkRelationList = selectWorkRelationList.concat(body)
    body.forEach(bodyItem=> {
        workRelationList=workRelationList.filter((item)=> {
            return !(bodyItem.id === item.id)
        })
    })
    return {
        selectWorkRelationList: selectWorkRelationList,
        workRelationList: workRelationList
    }
}
Mock.mock("/addWorkRelationList", workRelationAdd);
//删除
let deleWorkRelation = function (options){
    // console.log(options)
    // const body = JSON.parse(options.body);
    const newWorkRelationList = selectWorkRelationList.filter((item)=> {
        return item.id === options.body
    })
    workRelationList = workRelationList.concat(newWorkRelationList)
    selectWorkRelationList=selectWorkRelationList.filter((item)=> {
        return !(item.id === options.body)
    })
    return {
        selectWorkRelationList: selectWorkRelationList,
        workRelationList: workRelationList
    }
}
Mock.mock("/deleWorkRelationList", deleWorkRelation);
let searchWorkRelation = function (options){
    console.log(options)
    let newSelectWorkRelationList = []
    if(options.body){
        newSelectWorkRelationList=selectWorkRelationList.filter((item)=> {
            return (item.id === options.body || item.title.indexOf(options.body) !== -1)
        })
    }else {
        newSelectWorkRelationList = selectWorkRelationList
    }
    return {
        selectWorkRelationList: newSelectWorkRelationList
    }
}
Mock.mock("/searchWorkRelation", searchWorkRelation);

let searchAllWorkRelation = function (options){
    let newWorkRelationList = []
    if(options.body){
        newWorkRelationList = workRelationList.filter((item)=> {
            return (item.id === options.body || 
                    item.title.indexOf(options.body) !== -1
                    )
        })
    }else {
        newWorkRelationList = workRelationList
    }
    return {
        workRelationList: newWorkRelationList
    }
}
Mock.mock("/searchAllWorkRelation", searchAllWorkRelation);