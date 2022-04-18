/*
 * @Descripttion: 头部事项菜单下拉框
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-15 15:01:33
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-16 13:07:51
 */
import React from "react";
import "./workFilterModal.scss";
import { inject, observer } from "mobx-react";
import {getUser} from 'doublekit-core-ui';

const WorkFilterModal = (props) => {
    const { showModal, setShowModal,homeStore,workStore } = props;
    const { findWorkStatusListBySorts } = homeStore;
    const {setSearchCondition,setSearchConditionNull} = workStore;
    
    const filterWorkByType = (event,value) => {
        event.nativeEvent.stopImmediatePropagation(event);
        setShowModal()
        findWorkStatusListBySorts({sorts: value}).then((data)=> {
            console.log(data)
            let list = []
            data.data.map(item=> {
                list.push(item.id)
                return list;
            })
            setSearchConditionNull()
            setSearchCondition({workStatusIds: list,assignerIds: [getUser().userId]})
            props.history.push({pathname: "/index/work/worklist"})
        })
    }
    
    const fileterAllWork = () => {
        setShowModal()
        setSearchConditionNull().then(()=> {  
            props.history.push({pathname: "/index/work/worklist"})
        })
    }

    return <div className={`drop-box ${showModal ? "show-workfilterbox" : "hidden-workfilterbox"}`}>
        <div className="process-work" onClick={(event) => filterWorkByType(event,[1,2])}>
            我的代办事项
        </div>
        <div className="process-work" onClick={(event) => fileterAllWork(event)}>
            所有事项
        </div>
        <div className="process-work" onClick={(event) => filterWorkByType(event,[3])}>
            已处理事件
        </div>
    </div>
}

export default inject('homeStore',"workStore")(observer(WorkFilterModal));