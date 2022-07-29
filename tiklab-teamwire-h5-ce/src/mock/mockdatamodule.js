import Mock from "mockjs";
var array = [
    {
        modulename: Mock.mock('@cword(3, 5)'),
        modulecode: Mock.mock('@id'),
        moduledes: "",
        key: Mock.mock('@increment')
    },
    {
        modulename: Mock.mock('@cword(3, 5)'),
        modulecode: Mock.mock('@id'),
        moduledes: "",
        key: Mock.mock('@increment')
        
    },
    {
        modulename: Mock.mock('@cword(3, 5)'),
        modulecode: Mock.mock('@id'),
        moduledes: "",
        key: Mock.mock('@increment')
    },
    {
        modulename: Mock.mock('@cword(3, 5)'),
        modulecode: Mock.mock('@id'),
        moduledes: "",
        key: Mock.mock('@increment')
    },
    {
        modulename: Mock.mock('@cword(3, 5)'),
        modulecode: Mock.mock('@id'),
        moduledes: "",
        key: Mock.mock('@increment')
    },
    {
        modulename: Mock.mock('@cword(3, 5)'),
        modulecode: Mock.mock('@id'),
        moduledes: "",
        key: Mock.mock('@increment')
    }
];
Mock.mock("/modulelist", { array });
let moduleSearch = function (options){
    let userindex = "";
    let newArray = [];
    
    array.forEach(function(e,index){
        if(e.key === options.body || e.modulename.indexOf(options.body)!==-1){
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
Mock.mock("/modulesearch", moduleSearch);
let moduleAdd = function (options){
    const body = JSON.parse(options.body);
    let newitem = {
        modulename: body.modulename,
        modulecode: body.modulecode,
        moduledes: "",
        key: Mock.mock('@increment')
    }
    array.push(newitem)
    return {
        data: array
    }
}
Mock.mock("/moduleadd", moduleAdd);

let moduleDele = function (options){
    let userindex = ""
    const body = JSON.parse(options.body);
    array.forEach(function(e,index){
        if(e.modulecode === body.modulecode){
            userindex = index
        }
    })
    console.log(userindex)
    array.splice(userindex,1)
    return {
        data: array
    }
}
Mock.mock("/moduledele", moduleDele);
let moduleEdit = function (options){
    const body = JSON.parse(options.body);
    let newitem = {
        modulename: body.modulename,
        modulecode: body.modulecode,
        moduledes: "",
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
Mock.mock("/moduleedit", moduleEdit);