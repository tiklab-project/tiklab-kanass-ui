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
import { observer, inject } from "mobx-react";
import { withRouter } from 'react-router';

const ProjectSet = (props) => {
    const { projectSetStore,route } = props;
    const { getProjectSetlist, findAllProjectSet, allProjectSetList } = projectSetStore;
    //初始化获取项目列表
    useEffect(() => {
        findAllProjectSet()
        return;
    }, [])

    return (
        <div className="projectSet">
            <Layout className="projectSet-content">
                {allProjectSetList && allProjectSetList.length > 0 ?
                    <ProjectSetContent />:<ProjectSetGide />
                }
            </Layout>
        </div>

    )
}
export default withRouter(inject('projectSetStore')(observer(ProjectSet)));