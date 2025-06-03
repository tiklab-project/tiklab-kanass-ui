/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 15:48:06
 * @Description: 日志列表
 */

import React from 'react';
import {OpenApiDocPage} from 'tiklab-postin-client-ui'
import {AccessToken} from "tiklab-openapi-ui";

const OpenApiPages = (props) => {
    return <AccessToken
        {...props}
        //tiklab-postin-client-ui组件OpenApiDocPage的路由
        postInOpenApiPath={'/openApiDoc'} //必填
    > </AccessToken>
    // <OpenApiDocPage {...props}/>
}

export default OpenApiPages;