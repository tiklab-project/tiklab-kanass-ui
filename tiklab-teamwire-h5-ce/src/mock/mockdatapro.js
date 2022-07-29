import Mock from "mockjs";
var array = [
    {
        proname: Mock.mock('@cword(3, 5)'),
        procode: Mock.mock('@id'),
        prodes: "",
        key: Mock.mock('@increment')
    },
    {
        proname: Mock.mock('@cword(3, 5)'),
        procode: Mock.mock('@id'),
        prodes: "",
        key: Mock.mock('@increment')
        
    },
    {
        proname: Mock.mock('@cword(3, 5)'),
        procode: Mock.mock('@id'),
        prodes: "",
        key: Mock.mock('@increment')
    },
    {
        proname: Mock.mock('@cword(3, 5)'),
        procode: Mock.mock('@id'),
        prodes: "",
        key: Mock.mock('@increment')
    },
    {
        proname: Mock.mock('@cword(3, 5)'),
        procode: Mock.mock('@id'),
        prodes: "",
        key: Mock.mock('@increment')
    },
    {
        proname: Mock.mock('@cword(3, 5)'),
        procode: Mock.mock('@id'),
        prodes: "",
        key: Mock.mock('@increment')
    }
];
Mock.mock("/prolist", { array });
let proSearchtype = function (options){
    let userindex = "";
    let newArray = [];
    const body = JSON.parse(options.body);
    if(body===1){
        newArray = array
    }else{
        array.forEach(function(e,index){
            if(e.key === body){
                userindex = index
            }
        })
        newArray.push(array[userindex])
    }
    
    return {
        data: newArray
    }
}
Mock.mock("/prosearchtype", proSearchtype);
let proAdd = function (options){
    const body = JSON.parse(options.body);
    let newitem = {
        proname: body.proname,
        procode: Mock.mock('@id'),
        prodes: body.prodes,
        key: Mock.mock('@increment')
    }
    array.push(newitem)
    console.log(array)
    return {
        data: array
    }
}
Mock.mock("/proadd", proAdd);

let proDele = function (options){
    let userindex = ""
    array.forEach(function(e,index){
        if(e.procode === options.body.procode){
            userindex = index
        }
    })
    array.splice(userindex,1)
    return {
        data: array
    }
}
Mock.mock("/prodele", proDele);

let proSearch = function (options){
    let userindex = "";
    let newArray = [];
    array.forEach(function(e,index){
        if(e.key == options.body || e.proname.indexOf(options.body)!== -1){
            userindex = index;
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
Mock.mock("/prosearch", proSearch);