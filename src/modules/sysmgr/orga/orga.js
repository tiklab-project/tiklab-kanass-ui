/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-01-04 10:16:25
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-27 11:39:35
 */
import React from "react";
import { observer, inject} from "mobx-react"
import { OrgList, ORG_STORE} from 'doublekit-user-ui';

const Orga = props => {
    return (
        <OrgList
            {...props}
        />
    )
}

export default inject(ORG_STORE)(observer(Orga)) ;