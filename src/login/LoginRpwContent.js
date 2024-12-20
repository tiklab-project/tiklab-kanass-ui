/*
 * @Author: 袁婕轩
 * @Date: 2024-10-10 09:02:15
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 15:40:23
 * @Description: 修改密码
 */

import React from 'react';
import {LoginRpw} from "tiklab-eam-ui";

const LoginRpwContent = props => {

    return (
        <LoginRpw
            {...props}
            loginGoRouter='/index/overview'
        />
    )
}

export default LoginRpwContent