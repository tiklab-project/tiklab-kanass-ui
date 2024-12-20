/*
 * @Descripttion: 项目集
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:51:03
 */
import React, { Fragment, useEffect, useState } from 'react';
import { Layout, Row, Col, Spin } from 'antd';
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
    const [loading, setLoading] = useState(true)

    const { findAllProjectSet, allProjectSetList } = ProjectSetStore;
    //初始化获取项目列表
    useEffect(() => {
        setLoading(true)
        findAllProjectSet({}).then(res => {
            setLoading(false)
        })
        return;
    }, [])

    return (<Provider {...store}>
        <div className="projectSet">
            <Spin spinning={loading} tip="加载中..." >

                <Layout className="projectSet-content">
                    {
                        allProjectSetList && allProjectSetList.length > 0 ?
                            <ProjectSetContent /> :
                            <>
                                {
                                    !loading && <ProjectSetGide />
                                }
                            </>

                    }
                </Layout>
            </Spin>

        </div>
    </Provider>


    )
}
export default withRouter(observer(ProjectSet));