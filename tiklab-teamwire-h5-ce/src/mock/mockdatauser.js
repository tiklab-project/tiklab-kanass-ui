import Mock from "mockjs";
// import userstore from "../view/home/user/store/userstore";
var userList = [
    {
        "id": "32fbea4f5db213996a8b8b1d0f5606ee",
        "name": "12345678",
        "phone": "12345678",
        "email": "12345678@163.com",
        "userType": 1,
        "department": "研发部"
    },
    {
        "id": "5c7ebef0a5338167226747ef2928b31e",
        "name": "mahaiweww",
        "phone": "13179673234",
        "email": "www@qq.comwewewe",
        "userType": 1,
        "department": "研发部"
    },
    {
        "id": "72cfe9ffc71e7435f398a610611d93d4",
        "name": "rWw0ib5HawX3fDoH9Ro915GeHwkKiMp9",
        "phone": "B5VRzRPpYbRM8JlViLRvxn7o9uvCMG4I",
        "email": "e97C7RkGLQ3w4TnRCUZQBRpbza9HZYkK",
        "userType": 0,
        "department": "研发部"
    }
];
var selectUserList = [
    {
        "id": "8efd424ae03f6c72542b62db26753d30",
        "name": "成员1",
        "phone": "1779323231",
        "email": "sdcsc@qq.com",
        "userType": 1,
        "department": "研发部"
    },
    {
        "id": "8f3ddf94d45e75d471c79fb8b6f1b660",
        "name": "成员2",
        "phone": "13179673234",
        "email": "www@qq.com",
        "userType": 1,
        "department": "研发部"
    },
    {
        "id": "8f9d7fc6d595d12bba289bf77fbea065",
        "name": "成员3",
        "phone": "13179673234",
        "email": "www@qq.com",
        "userType": 2,
        "department": "研发部"
    }
];
Mock.mock("/userList", { userList });
Mock.mock("/selectUserList", { selectUserList });
let userAdd = function (options){
    const body = JSON.parse(options.body);
    selectUserList = selectUserList.concat(body)
    body.forEach(bodyItem=> {
        userList=userList.filter((item)=> {
            return !(bodyItem.id === item.id)
        })
    })
    return {
        selectUserList: selectUserList,
        userList: userList
    }
}
Mock.mock("/addUserList", userAdd);
//删除
let deleUser = function (options){
    // console.log(options)
    // const body = JSON.parse(options.body);
    const newUserList = selectUserList.filter((item)=> {
        return item.id === options.body
    })
    userList = userList.concat(newUserList)
    selectUserList=selectUserList.filter((item)=> {
        return !(item.id === options.body)
    })
    return {
        selectUserList: selectUserList,
        userList: userList
    }
}
Mock.mock("/deleUserList", deleUser);
let searchUser = function (options){
    console.log(options)
    let newSelectUserList = []
    if(options.body){
        newSelectUserList=selectUserList.filter((item)=> {
            return (item.id === options.body || item.name.indexOf(options.body) !== -1)
        })
    }else {
        newSelectUserList = selectUserList
    }
    return {
        selectUserList: newSelectUserList
    }
}
Mock.mock("/searchUser", searchUser);

let searchAllUser = function (options){
    let newUserList = []
    if(options.body){
        newUserList = userList.filter((item)=> {
            return (item.id === options.body || 
                    item.name.indexOf(options.body) !== -1 || 
                    item.email === options.body ||
                    item.phone === options.body
                    )
        })
    }else {
        newUserList = userList
    }
    return {
        userList: newUserList
    }
}
Mock.mock("/searchAllUser", searchAllUser);