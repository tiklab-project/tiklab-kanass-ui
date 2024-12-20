/*
 * @Author: 袁婕轩
 * @Date: 2024-08-14 13:15:56
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 13:45:21
 * @Description: 没有数据的提示
 */
import React from "react";
import { Empty } from "antd";

const ProjectEmpty = (props) => {
    const {description, children} = props;

    return <Empty description={description}>
        {children}
    </Empty>
}

export default ProjectEmpty;