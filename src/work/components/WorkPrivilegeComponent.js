import React, { useEffect, useState } from 'react';
import WorkStore from "../store/WorkStore";
import { getUser } from 'tiklab-core-ui';
import { observer } from 'mobx-react';

const WorkPrivilegeComponent = (props) => {
    const {workId, domainId, children, code} = props;
    const {findWorkItemRoleFunctionDmCode, permissionFieldList}  = WorkStore;
    const [showButton, setShowButton] = useState(false);
    const userId = getUser().userId;

    const isPermissionField = (code) => {
        return permissionFieldList.indexOf(code) > -1 ? true : false;
    }
    useEffect(()=> {
        // findWorkItemRoleFunctionDmCode({
        //     userId: userId,
        //     domainId: domainId,
        //     workId: workId
        // }).then(res => {
        //     if(res.code === 0){
        //         console.log(res.data)
                
        //     }
        // })
        setShowButton(isPermissionField(code))
        return null;
    }, [])

    return <div style={{display: showButton ? "block" : "none"}}>
    {children}
    </div>
}

export default observer(WorkPrivilegeComponent);