/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-04-09 15:30:22
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 19:09:28
 */
import React, { useState, useEffect } from "react";
import VersionSide from "../components/versionSide";
import VersionDetail from "../components/versionDeatil";
import { Layout,Row, Col } from 'antd';
import { observer, inject } from "mobx-react";
const { Sider } = Layout;
const Version = (props) => {
    const { versionStore } = props
    const { getVersionList, versionId, getVersionId, searchVersionById, editVersion } = versionStore
    const [versionList, setVersionList] = useState();
    const [actionPlanId, setActionPlanId] = useState("");
    const projectId = localStorage.getItem("projectId");
    useEffect(() => {
        findVersionlist(projectId)
        return;
    }, [])

    const findVersionlist = (projectId) => {
        getVersionList({ projectId: projectId }).then(data => {
            setVersionList(data.data.dataList)
            setActionPlanId(data.data.dataList[0].id)
        })
    }
    return <Layout>
        <Sider width={"250px"} theme={"light"}>
            <VersionSide versionList={versionList} actionPlanId={actionPlanId} setActionPlanId={setActionPlanId} findVersionlist={findVersionlist} />
        </Sider>
        <Layout style={{backgroundColor: "#fff"}}>
            <Row justify="start">
                <Col xs={{ span: 20 }} lg={{ span: 20 }}>
                    <VersionDetail actionPlanId={actionPlanId} />
                </Col>
            </Row>
        </Layout>
    </Layout>
}
export default inject("versionStore")(observer(Version));