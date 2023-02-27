/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-01-04 10:16:25
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-04 10:39:18
 */
import React from "react";
import { UserList} from 'tiklab-user-ui';
const OrgaUser = props => {
    return (
        <UserList
            bgroup = "teamwire"
            {...props}
        />
    )
}

export default OrgaUser;