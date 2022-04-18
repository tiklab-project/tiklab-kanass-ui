import Mock from "mockjs";
var array = [
    {
        sprintname: Mock.mock('@cword(3, 5)'),
        sprintcode: Mock.mock('@id'),
        sprintdes: "",
        key: Mock.mock('@increment')
    },
    {
        sprintname: Mock.mock('@cword(3, 5)'),
        sprintcode: Mock.mock('@id'),
        sprintdes: "",
        key: Mock.mock('@increment')
        
    },
    {
        sprintname: Mock.mock('@cword(3, 5)'),
        sprintcode: Mock.mock('@id'),
        sprintdes: "",
        key: Mock.mock('@increment')
    },
    {
        sprintname: Mock.mock('@cword(3, 5)'),
        sprintcode: Mock.mock('@id'),
        sprintdes: "",
        key: Mock.mock('@increment')
    },
    {
        sprintname: Mock.mock('@cword(3, 5)'),
        sprintcode: Mock.mock('@id'),
        sprintdes: "",
        key: Mock.mock('@increment')
    },
    {
        sprintname: Mock.mock('@cword(3, 5)'),
        sprintcode: Mock.mock('@id'),
        sprintdes: "",
        key: Mock.mock('@increment')
    }
];
Mock.mock("/sprintlist", { array });
let sprintSearch = function (options){
    let userindex = "";
    let newArray = [];
    array.forEach(function(e,index){
        if(e.key == options.body || e.sprintname.indexOf(options.body)!==-1){
            userindex = index
            newArray.push(array[userindex])
        }
        if(!options.body){
            newArray=array
        }
    })
    
    return {
        data: newArray
    }
}
Mock.mock("/sprintsearch", sprintSearch);
let sprintAdd = function (options){
    const body = JSON.parse(options.body);
    let newitem = {
        sprintname: body.sprintname,
        sprintcode: body.sprintcode,
        sprintdes: "",
        key: Mock.mock('@increment')
    }
    array.push(newitem)
    return {
        data: array
    }
}
Mock.mock("/sprintadd", sprintAdd);

let sprintDele = function (options){
    let userindex = ""
    const body = JSON.parse(options.body);
    array.forEach(function(e,index){
        if(e.sprintcode === body.sprintcode){
            userindex = index
        }
    })
    console.log(userindex)
    array.splice(userindex,1)
    return {
        data: array
    }
}
Mock.mock("/sprintdele", sprintDele);
let sprintEdit = function (options){
    const body = JSON.parse(options.body);
    let newitem = {
        sprintname: body.sprintname,
        sprintcode: body.sprintcode,
        sprintdes: "",
        key: body.key
    }
    let userindex = ""
    array.forEach(function(e,index){
        if(e.key === body.key){
            userindex = index
        }
    })
    array[userindex] = newitem
    return {
        data: array
    }
}
Mock.mock("/sprintedit", sprintEdit);