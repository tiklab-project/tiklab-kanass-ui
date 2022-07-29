import Mock from "mockjs";
var loginarray={
  username: "123",
  password: "123"
}
let login = function(options){
    console.log(options)
    const body = JSON.parse(options.body);
    if(body.username == loginarray.username && body.password == loginarray.password){
      return {
        token: Mock.mock('@guid'),
        error: 0
      };
    }else {
      return {
        data: "账号或者密码不正确",
        error: 1
      }
    }
}
Mock.mock("/login", login);
var array = [
  {
    title: "组织机构",
    key:  Mock.mock('@id'),
    children: [
      {
        key: Mock.mock('@id'),
        title: "技术研发部",
      },
      {
        key: Mock.mock('@id'),
        title: "市场调研部",
      },
    ],
  }
];
Mock.mock("/organList", {array });
// 数据的添加
let listAdd = function (options) {
    console.log(array)
    const body = JSON.parse(options.body);
    let objindex = "";
    array.forEach(function (e,index) {
        const body = JSON.parse(options.body);
        if (e.title === body.highername) {
            objindex = index;
        }
    });
    if(objindex === ""){
        let obj = {
            title: body.highername,
            key:  Mock.mock('@id'),
            children: [
              {
                key:  Mock.mock('@id'),
                title: body.selfname,
              }],
        };
        array.push(obj);
    }else {
        
        let objchild = {
            key:  Mock.mock('@id'),
            title: body.selfname,
        };
        array[objindex].children.push(objchild)
    }
    return {
        data: array,
    };
};
Mock.mock("/organListAdd", listAdd);

let listDele = function (options) {
  // console.log(title,fatitle)
  const body = JSON.parse(options.body);
  console.log(body,array)
  let faindex = "";
  let chindex="";
  array.forEach(function (e,indexfa) {
    if(e.key===body.key) {
      faindex = indexfa
      array.splice(faindex,1); 
    }else {
      e.children.forEach(function(child,index){
        if(child.key === body.key){
          faindex = indexfa
          chindex = index
          array[faindex].children.splice(chindex,1); 
        }
      })
    }
    
  });
    console.log(faindex,chindex)
    // array[faindex].children.splice(chindex,1); 
    return {
        data: array,
    };
};
Mock.mock("/organListDele", listDele);

let listSearch = function (options) {
    // console.log(title,fatitle)
    const body = JSON.parse(options.body);
    let value={
      title: "",
      fatitle: ""
    }
    console.log(body)
    array.forEach(function(ele){
      if(ele.key === body.key){
        // value.title = subele.title;
        value.fatitle = ele.title
        value.title = ele.title
      }else {
        ele.children.forEach(function(subele){
          if(subele.key === body.key){
            value.title = subele.title;
            value.fatitle = ele.title
          }
        })
      }
      
    })
    return {
      data: value
    }
};
Mock.mock("/organListSerch", listSearch);
let listSearchitem = function (options) {
  // console.log(title,fatitle)
  const body = JSON.parse(options.body);
  let value={
    title: "",
    fatitle: ""
  }
  array.forEach(function(ele){
    ele.children.forEach(function(subele){
      if(subele.key === body.key){
        value.title = subele.title;
        value.fatitle = ele.title
      }
    })
  })
  return {
    data: value
  }
};
Mock.mock("/listSearchitem", listSearch);
let listEdit = function (options) {
  // console.log(title,fatitle)
  const body = JSON.parse(options.body);
  let index="";
  let faindex=""
  array.forEach(function(ele,firindex){
    if(ele.key === body.key){
      array[firindex] = body;
    }else {
      ele.children.forEach(function(subele,subindex){
        if(subele.key === body.key){
          index = subindex;
          faindex = firindex;
          array[faindex].children[index] = body;
        }
      })
    }
    
  })
  // console.log(body,index,faindex)
  
  // console.log(array)
  return {
    data: array
  }
};
Mock.mock("/organListEdit", listEdit);
