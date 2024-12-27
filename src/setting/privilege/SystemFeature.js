/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 16:26:14
 * @Description: 系统功能点
 */

import React from "react";
import { SystemFeature } from 'tiklab-privilege-ui';
import { inject, observer } from "mobx-react";

// 系统功能管理
const SystemFeatureList = props => {


    return (
        // <div className="test">
            <SystemFeature
                bgroup={'kanass'}
                isBase = {true}
                {...props}
            />
        // </div>
    )
}

export default inject("privilegeSystemStore")(observer(SystemFeatureList));