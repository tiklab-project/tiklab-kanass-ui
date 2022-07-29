import Mock from "mockjs";
var data = [
    {
        name:"敏捷研发项目",
        desc: "敏捷研发项目",
        id: Mock.mock('@increment')
    },
    {
        name:"瀑布研发项目",
        desc: "瀑布研发项目",
        id: Mock.mock('@increment')
    },
    {
        name:"普通研发项目",
        desc: "普通研发项目",
        id: Mock.mock('@increment')
    },
];
Mock.mock("/proTypeList", { data });

let searchProType = function (options){
    let userindex = "";
    let newArray = [];
    const body = JSON.parse(options.body);
    data.forEach(function(e,index){
        if(e.id === body.id || e.name.indexOf(body.name)!==-1){
            userindex = index
            newArray.push(data[userindex])
        }
        if(!options.body){
            newArray=data
        }
    })
    
    return {
        data: newArray
    }
}
Mock.mock("/searchProType", searchProType);
let addProType = function (options){
    const body = JSON.parse(options.body);
    let newitem = {
        name: body.name,
        desc: body.desc,
        key: Mock.mock('@increment')
    }
    data.push(newitem)
    return {
        data: data
    }
}
Mock.mock("/addProType", addProType);

let delProType = function (options){
    const body = JSON.parse(options.body);
    data = data.filter((item,index)=> {
        return item.id !== body.id
    })
    return {
        data: data
    }
}
Mock.mock("/delProType", delProType);


let editProType = function (options){
    const body = JSON.parse(options.body);
    let userindex;
    let newitem = {
        name: body.name,
        desc: body.desc,
        key: body.key
    }
    data.forEach(function(e,index){
        if(e.id === body.id){
            userindex = index
        }
    })
    data[userindex] = newitem
    return {
        data: data
    }
}
Mock.mock("/editProType", editProType);