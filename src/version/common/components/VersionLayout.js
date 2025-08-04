/*
 * @Descripttion: 版本页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-20 16:06:26
 */
import React, {useEffect, useState} from "react";
import { Provider, observer } from "mobx-react";
import {Col, Empty, Layout, Row} from "antd";
import "../components/VersionLayout.scss";
import { renderRoutes } from "react-router-config";
import VersionDetailAside from "./VersionDetailAside";
import VersionDetailStore from "../store/VersionDetailStore";
import WorkStore from "../../../work/store/WorkStore";
import ProjectEmpty from "../../../common/component/ProjectEmpty";
import VersionAddmodal from "../../../project/version/components/VersionAdd";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import VersionStore from "../../../project/version/store/VersionStores";
// import { UserVerify } from "tiklab-user-extension-ui";

const Versiondetail = (props) => {
    const store = {
        versionDetailStore: VersionDetailStore
    }
    const { setSearchConditionNull, setTabValue } = WorkStore;
    const { findVersion, version, setVersionRouter, versionRouter } = VersionDetailStore;
    const { userList, getUseList, deleVersion } = VersionStore
    const projectId = props.match.params.id;
    const project = JSON.parse(localStorage.getItem("project"));
    const versionId = props.match.params.version;
    useEffect(() => {
        setSearchConditionNull()
        setTabValue({id: "all", type: "system"})
        return () => {
            setSearchConditionNull()
            setTabValue({id: "all", type: "system"})
        }
    }, []);

    const deletVersionList = (id) => {
        deleVersion(id).then(res => {
            if (res.code === 0) {
                goBack();
            }
        })
    }

    const allRouter = [
        {
            title: "概况",
            defaultIcon: "survey-default",
            id: `/project/${projectId}/versionDetail/${versionId}/overview`,
            key: "overview",
            encoded: "Survey",
        },
        {
            title: "事项",
            defaultIcon: "workitem-default",
            id: `/project/${projectId}/versionDetail/${versionId}/workitem`,
            key: "work",
            encoded: "work",
        },
        {
            title: "规划",
            defaultIcon: "plan-default",
            id: `/project/${projectId}/versionDetail/${versionId}/plan`,
            key: "plan",
            encoded: "plan",
        }

    ];

    const doneRouter = [
        {
            title: "概况",
            defaultIcon: "survey-default",
            id: `/project/${projectId}/versionDetail/${versionId}/overview`,
            key: "overview",
            encoded: "Survey",
        },
        {
            title: "事项",
            defaultIcon: "workitem-default",
            id: `/project/${projectId}/versionDetail/${versionId}/workitem`,
            key: "work",
            encoded: "work",
        }
    ]

    const [selectTab, setSelectTab] = useState("work");
    const [versionTab, setVersionTab] = useState(allRouter);
    useEffect(() => {
        findVersion({ id: versionId }).then(res => {
            if(res.code === 0){
                if (res.data.versionState.id === "222222") {
                    setVersionTab(doneRouter)
                } else {
                    setVersionTab(allRouter)
                }
            }
        })
        return;
    }, [versionId])

    const handleTabClick = (key, id) => {
        setSelectTab(key)
        props.history.push(id)
    }

    const goBack = () => {
        props.history.push(`/project/${projectId}/version`)
    }

    
    const { route } = props;
    return (<Provider {...store}>
        <Layout className="version-detail">
            {/*<VersionDetailAside />*/}
            <Row style={{
                // borderBottom: "1px solid var(--tiklab-gray)",
                backgroundColor: "#fff"
            }}>
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "24", offset: "0" }} xxl={{ span: "24", offset: "0" }}>
                    <div style={{
                        padding: "0 20px ",
                        display: "flex",
                        lineHeight: "55px",
                        gap: "60px"
                    }}>
                        {
                            version &&
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <svg className="icon-22" aria-hidden="true" onClick={goBack}>
                                    <use xlinkHref="#icon-left"></use>
                                </svg>
                                <p className="version-title">{project?.projectName}</p>
                            </div>
                        }
                        {/*<SprintDetailAside />*/}

                        <div className="version-detail-tabs">
                            {
                                versionTab.map(item => {
                                    return <div
                                        className={`version-tab ${item.key === selectTab ? "version-tab-active" : ""}`}
                                        key={item.key}
                                        onClick={() => handleTabClick(item.key, item.id)}
                                    >
                                        <span>{item.title}</span>
                                    </div>
                                })
                            }
                        </div>

                        <div className={"version-detail-operate"}>
                            <VersionAddmodal
                                name="编辑版本"
                                type="edit"
                                id={versionId}
                                // findVersion={findVersion}
                                getUseList={getUseList}
                                userList={userList}
                                versionStore={VersionStore}
                                {...props}
                            />
                            <PrivilegeProjectButton code={'ProjectVersionDelete'} domainId={projectId}  {...props}>
                                <DeleteModal deleteFunction={deletVersionList} id={versionId} />
                            </PrivilegeProjectButton>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                {
                    version ?
                        <Layout className="version-detail-content">
                            {renderRoutes(route.routes)}
                        </Layout>
                        :
                        <div className="version-detail-empty">
                            <ProjectEmpty description="版本不存在或者已被删除"></ProjectEmpty>
                        </div>
                }
            </Row>

        </Layout>
    </Provider>
        
    )
}
// export default observer(UserVerify(Versiondetail,"/noAuth", "kanass"));
export default observer(Versiondetail);