import Mock from "mockjs";
// import versionPlanstore from "../view/home/versionPlan/store/versionPlanstore";
var versionPlanList = [
    {
        "id": "32fbea4f5db213996a8b8b1d0f5606ee",
        "projectName": "添加组织机构",
        "type": "需求",
        "status": "未开始"
    },
    {
        "id": "5c7ebef0a5338167226747ef2928b31e",
        "projectName": "添加表单需求",
        "type": "需求",
        "status": "未开始"
    },
    {
        "id": "72cfe9ffc71e7435f398a610611d93d4",
        "projectName": "添加权限",
        "type": "需求",
        "status": "未开始"
    }
];
var selectVersionPlanList = [
    {
        "id": "8efd424ae03f6c72542b62db26753d30",
        "projectName": "添加权限",
        "type": "需求",
        "status": "未开始"
    },
    {
        "id": "8f3ddf94d45e75d471c79fb8b6f1b660",
        "projectName": "添加权限",
        "type": "需求",
        "status": "未开始"
    },
    {
        "id": "8f9d7fc6d595d12bba289bf77fbea065",
        "projectName": "添加权限",
        "type": "需求",
        "status": "未开始"
    }
];
Mock.mock("/versionPlanList", { versionPlanList });
Mock.mock("/selectVersionPlanList", { selectVersionPlanList });
let versionPlanAdd = function (options){
    const body = JSON.parse(options.body);
    selectVersionPlanList = selectVersionPlanList.concat(body)
    body.forEach(bodyItem=> {
        versionPlanList=versionPlanList.filter((item)=> {
            return !(bodyItem.id === item.id)
        })
    })
    return {
        selectVersionPlanList: selectVersionPlanList,
        versionPlanList: versionPlanList
    }
}
Mock.mock("/addVersionPlanList", versionPlanAdd);
//删除
let deleVersionPlan = function (options){
    // console.log(options)
    // const body = JSON.parse(options.body);
    const newVersionPlanList = selectVersionPlanList.filter((item)=> {
        return item.id === options.body
    })
    versionPlanList = versionPlanList.concat(newVersionPlanList)
    selectVersionPlanList=selectVersionPlanList.filter((item)=> {
        return !(item.id === options.body)
    })
    return {
        selectVersionPlanList: selectVersionPlanList,
        versionPlanList: versionPlanList
    }
}
Mock.mock("/deleVersionPlanList", deleVersionPlan);
let searchVersionPlan = function (options){
    console.log(options)
    let newSelectVersionPlanList = []
    if(options.body){
        newSelectVersionPlanList=selectVersionPlanList.filter((item)=> {
            return (item.id === options.body || item.projectName.indexOf(options.body) !== -1)
        })
    }else {
        newSelectVersionPlanList = selectVersionPlanList
    }
    return {
        selectVersionPlanList: newSelectVersionPlanList
    }
}
Mock.mock("/searchVersionPlan", searchVersionPlan);

let searchAllVersionPlan = function (options){
    let newVersionPlanList = []
    if(options.body){
        newVersionPlanList = versionPlanList.filter((item)=> {
            return (item.id === options.body || 
                    item.projectName.indexOf(options.body) !== -1 || 
                    item.status === options.body ||
                    item.type === options.body
                    )
        })
    }else {
        newVersionPlanList = versionPlanList
    }
    return {
        versionPlanList: newVersionPlanList
    }
}
Mock.mock("/searchAllVersionPlan", searchAllVersionPlan);