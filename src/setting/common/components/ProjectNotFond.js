import React from "react";
import {NotFound} from "tiklab-privilege-ui";

const NotFoundContent = props =>{
    return <NotFound
              {...props}
              homePath={""} // 返回首页路由，如果首页路由重定向为 '/', 可不用传入
           />
}

export default NotFoundContent