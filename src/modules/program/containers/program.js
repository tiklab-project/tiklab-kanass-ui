/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-15 16:19:22
 */
import React, { Fragment, useEffect,useState } from 'react';
import ProgramSide from "../components/programAside";
import { Layout, Row, Col } from 'antd';
import ProgramContent from "../components/programContent"
import ProgramGide from "../components/ProgramGide"
import "../components/program.scss";
import { observer, inject } from "mobx-react";
import { withRouter } from 'react-router';
import { renderRoutes } from "react-router-config";
const { Sider } = Layout;

const Program = (props) => {
    const { programStore,route } = props;
    const { getProgramlist, programList } = programStore;
    const [visible, setVisible] = useState(false)
    const [type, setType] = useState("add")
    //初始化获取项目列表
    useEffect(() => {
        getProgramlist()
    }, [])

    return (
        <div className="Program">
            <Layout className="Program-content">
                {programList && programList.length > 0 ? <Fragment>
                    <Sider>
                        <ProgramSide></ProgramSide>
                    </Sider>
                    <Layout className="Program-table">
                        {/* <ProgramContent
                            visible={visible}
                            setVisible={setVisible}
                            type={type}
                            setType={setType}
                            {...props}
                        /> */}
                        {renderRoutes(route.routes)}
                    </Layout>
                </Fragment> :
                    <ProgramGide
                        visible={visible}
                        setVisible={setVisible}
                        type={type}
                        setType={setType}
                    />
                }
            </Layout>
        </div>

    )
}
export default withRouter(inject('programStore')(observer(Program)));