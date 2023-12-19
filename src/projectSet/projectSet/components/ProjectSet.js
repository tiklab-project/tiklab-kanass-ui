/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-15 16:19:22
 */
import React, { Fragment, useEffect,useState } from 'react';
import { Layout, Row, Col } from 'antd';
import ProjectSetContent from "./ProjectSetTable"
import ProjectSetGide from "./ProjectSetGide"
import "../components/ProjectSet.scss";
import { observer, Provider } from "mobx-react";
import { withRouter } from 'react-router';
import ProjectSetStore from "../store/ProjectSetStore";

const ProjectSet = (props) => {
    const store = {
        projectSetStore: ProjectSetStore
    }
    console.log(ProjectSetStore)
    const { findJoinProjectSetList, allProjectSetList } = ProjectSetStore;
    //初始化获取项目列表
    useEffect(() => {
        findJoinProjectSetList({})
        return;
    }, [])

    return (<Provider {...store}>
        <div className="projectSet">
            <Layout className="projectSet-content">
                {
                    allProjectSetList && allProjectSetList.length > 0 ?
                        <ProjectSetContent />:<ProjectSetGide />
                }
            </Layout>
        </div>
    </Provider>
        

    )
}
export default withRouter(observer(ProjectSet));