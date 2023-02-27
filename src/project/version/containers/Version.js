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
import { Layout, Row, Col } from 'antd';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router";
const { Sider } = Layout;
const Version = (props) => {
    const { versionStore } = props
    const { getVersionList } = versionStore
    const [versionList, setVersionList] = useState();
    const [actionPlanId, setActionPlanId] = useState("");
    const projectId = props.match.params.id;
    useEffect(() => {
        findVersionlist(projectId)
        return;
    }, [])

    const findVersionlist = (projectId) => {
        getVersionList({ projectId: projectId }).then(data => {
            setVersionList(data.data.dataList)
            setActionPlanId(data.data.dataList.length > 0 ? data.data.dataList[0].id : "")
        })
    }
    return (<Layout>
        <Sider width={"250px"} theme={"light"}>
            <VersionSide versionList={versionList} actionPlanId={actionPlanId} setActionPlanId={setActionPlanId} findVersionlist={findVersionlist} {...props} />
        </Sider>
        <Layout style={{ backgroundColor: "#fff" }}>
            <VersionDetail actionPlanId={actionPlanId} />
        </Layout>
    </Layout>)

}
export default withRouter(inject("versionStore")(observer(Version)));