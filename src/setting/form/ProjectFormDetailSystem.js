/*
 * @Descripttion: 流程的设计页面，开发使用
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-06-01 13:24:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-28 16:34:32
 */
import React from "react";
import {FormDesign} from 'tiklab-form-ui';

const ProjectFormDetailSystem = (props) => {
    return (
        <FormDesign {...props} formIdTag={"id"} isBase = {true}/>
    )
}
export default ProjectFormDetailSystem;