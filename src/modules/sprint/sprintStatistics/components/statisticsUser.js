/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-20 10:19:39
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-07-23 16:23:07
 */

import React from "react";
import { Plugin,pluginConfig} from "doublekit-plugin-ui";
const StatisticsUsers = (props) => {
    console.log(props)
    return (
        <Plugin point="user-statistics"/>
    )
}
export default StatisticsUsers;