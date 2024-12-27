/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 16:25:58
 * @Description: 项目功能点
 */

import React, { Fragment, useEffect,useState } from "react";
import { ProjectFeature } from 'tiklab-privilege-ui';
import { inject, observer } from "mobx-react";

// 系统功能管理
const ProjectFeatureList = props => {


    return (
        // <div className="test">
            <ProjectFeature
                bgroup={'kanass'}
                {...props}
            />
        // </div>
    )
}

export default inject("privilegeProjectFeatureStore")(observer(ProjectFeatureList));