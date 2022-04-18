/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-08 10:49:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-18 17:32:06
 */
import React, { useEffect, useState, useReducer,useImperativeHandle } from "react";
import "../../common/components/projectDetail.scss";
import WorkDetail from "./workDetail"
import WorkAside from "./workAside";
import { observer, inject } from "mobx-react";
import "./workList.scss"



const Worklist = (props) => {

    const {workStore,workListFather } =props;

    const {workList,total,searchCondition,setWorkId,setWorkIndex}
            = workStore;
    // 点击菜单，获取详情，从详情获取id给selectKey赋值

    const changeWork = (id,index)=> {
        setWorkId(id)
        setWorkIndex(index)
    }
    
    useImperativeHandle(workListFather,()=> ({
        changeWork: changeWork
    }))

    
    return(
        <div className="work-list">
            <WorkAside
                {...props}
                changeWork={changeWork}
                workList={workList}
                total={total}
                current={searchCondition.pageParam.currentPage}
            ></WorkAside>
            <WorkDetail {...props}></WorkDetail>
        </div>
    )
};

export const WorkList =  inject("workStore")(observer(Worklist));
