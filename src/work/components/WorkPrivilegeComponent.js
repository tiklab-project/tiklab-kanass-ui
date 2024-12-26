/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 15:44:38
 * @Description: 事项权限组件
 */
import React, { useEffect, useState } from 'react';
import WorkStore from "../store/WorkStore";
import { observer } from 'mobx-react';

const WorkPrivilegeComponent = (props) => {
    const { children, code} = props;
    const { permissionFieldList}  = WorkStore;
    const [showButton, setShowButton] = useState(false);

    /**
     * 判断是否有权限
     */ 
    const isPermissionField = (code) => {
        return permissionFieldList.indexOf(code) > -1 ? true : false;
    }

    /**
     * 初始化权限，按钮是否显示，表单是否可编辑
     */
    useEffect(()=> {
        setShowButton(isPermissionField(code))
        return null;
    }, [])

    return <div style={{display: showButton ? "block" : "none"}}>
    {children}
    </div>
}

export default observer(WorkPrivilegeComponent);