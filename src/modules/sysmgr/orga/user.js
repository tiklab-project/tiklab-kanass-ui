/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-01-04 10:16:25
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-04 10:39:18
 */
import React from "react";
import { observer, inject} from "mobx-react"
import { UserList, USER_STORE} from 'doublekit-user-ui';

const OrgaUser = props => {
    return (
        <UserList
            {...props}
        />
    )
}

export default inject(USER_STORE)(observer(OrgaUser)) ;