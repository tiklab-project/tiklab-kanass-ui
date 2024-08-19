/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-13 11:20:23
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 14:26:52
 */
import React, { useEffect, useState, useRef, Fragment } from "react";
import { Form, Space, Empty, Dropdown, Skeleton, Button as ButtonAntd, Select, InputNumber, Popconfirm, message, Modal, Col, Row } from "antd";
import { observer, inject } from "mobx-react";
import 'moment/locale/zh-cn';
import WorkDetailBottom from "./WorkDetailBottom";
import { PrivilegeProjectButton } from "thoughtware-privilege-ui";
import { getUser } from 'thoughtware-core-ui'
import "./WorkDetail.scss";
import { SwapRightOutlined } from '@ant-design/icons';
import Button from "../../common/button/Button";
import { setSessionStorage, getSessionStorage } from "../../common/utils/setSessionStorage";
import { FlowChartLink } from "thoughtware-flow-ui";
import { setWorkTitle } from "./WorkArrayChange";
import { changeWorkItemList } from "./WorkGetList";
import WorkDetailCrumb from "./WorkDetailCrumb";
import WorkDetailTab from "./WorkDetailTab";
import WorkDeleteSelectModal from "./WorkDeleteSelectModal";
import ProjectEmpty from "../../common/component/ProjectEmpty";

const rowSpan = {
    sm: 24,
    md: 24,
    lg: 24,
    xl: 24,
    xxl: 24
}
const WorkDetail = (props) => {
    const [detailForm] = Form.useForm();

    const { workStore, setIsModalVisible, delectCurrentWorkItem, delectWorkItemAndChildren, rowSpan, closeModal } = props;
    const { workList, setWorkList, setWorkId, workShowType, workId, editWork,
        setWorkIndex, getWorkTypeList, getModuleList, findSprintList, getSelectUserList,
        findPriority, searchWorkById, findTransitionList, findWorkItemRelationModelCount,
        findSelectVersionList, haveChildren, findStageList, findStateNodeUserFieldList, permissionFieldList
    } = workStore;
    const [detailCrumbArray, setDetailCrumbArray] = useState(getSessionStorage("detailCrumbArray"));
    const projectId = props.match.params.id;
    const userId = getUser().userId;
    const workDeatilForm = useRef()
    const inputRef = useRef()
    const [workInfo, setWorkInfo] = useState();
    const [workStatus, setWorkStatus] = useState("nostatus")
    const [isFocus, setIsFocus] = useState();
    const [infoLoading, setInfoLoading] = useState(false)
    const [transformList, setTransformList] = useState([])
    const [assigner, setAssigner] = useState()
    const workDetailTop = useRef();
    const [relationModalNum, setRelationModalNum] = useState();
    const [tabValue, setTabValue] = useState(1);

    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;

    const getWorkDetail = (id) => {
        setInfoLoading(true)
        searchWorkById(id).then((res) => {
            setInfoLoading(false)
            setTabValue(1)
            if (res) {
                setWorkInfo(res)
                // 获取选项列表
                const projectId = res.project.id
                getWorkTypeList({ projectId: projectId });
                getModuleList(projectId)
                findSprintList(projectId)
                getSelectUserList(projectId);
                findSelectVersionList(projectId)

                findStageList({ projectId: projectId })

                getTransitionList(res.workStatusNode.id, res.workType.flow.id)
                setWorkStatus(res.workStatusNode.name ? res.workStatusNode.name : "nostatus")
                setAssigner({ label: res.assigner?.nickname, value: res.assigner?.id })
                findWorkItemRelationModelCount({ workItemId: res.id, workTypeCode: res.workTypeCode }).then(res => {
                    if (res.code === 0) {
                        setRelationModalNum(res.data)
                    }
                })

                // 获取字段权限
                // 获取表单字段权限
                const data = {
                    workId: workId,
                    userId: userId
                }
                findStateNodeUserFieldList(data)

                // if (props.match.path === "/project/:id/work/:workId") {

                // }
                setSessionStorage("detailCrumbArray", [{ id: res.id, code: res.code, title: res.title, iconUrl: res.workTypeSys.iconUrl }])
                setDetailCrumbArray(getSessionStorage("detailCrumbArray"))
            }
        })
    }

    useEffect(() => {
        if (props.match.path === "/project/:id/work/:workId" || props.match.path === "/:id/version/:version/work/:workId"
            || props.match.path === "/:id/sprint/:sprint/work/:workId") {
            const id = props.match.params.workId;
            setWorkId(id)
        }
        return null;
    }, [props.match.params.workId])

    useEffect(() => {
        setWorkInfo()
        if (workId && workId.length > 0) {
            // findFieldList({ code: "workPriority" }).then(res => {
            //     if (res.code === 0) {
            //         setSelectItemList(res.data[0].selectItemList)
            //     }
            // })
            findPriority()
            getWorkDetail(workId)

        }
        if (workId === 0) {
            setWorkInfo(null)
        }
        return
    }, [workId]);

    useEffect(() => {
        setDetailCrumbArray(getSessionStorage("detailCrumbArray"))
        return null;
    }, [workId, workShowType])


    const changeStatus = (transition) => {
        Modal.confirm({
            title: "修改之后不能撤回，确认修改状态？",
            className: "edit-status-modal",
            getContainer: workDetailTop.current,
            onOk: () => {
                const value = {
                    updateField: "workStatusNode",
                    workStatusNode: transition?.toNode?.id,
                    transitionId: transition.id,
                    flowId: transition.flow.id,
                    id: workId
                }
                editWork(value).then((res) => {
                    if (res.code === 0) {
                        setWorkStatus(name)
                        searchWorkById(workId).then((res) => {
                            if (res) {
                                detailForm.setFieldsValue({ assigner: res.assigner?.id })
                                getTransitionList(res.workStatusNode.id, res.workType.flow.id)
                                setWorkStatus(res.workStatusNode.name ? res.workStatusNode.name : "nostatus")

                                const list = changeWorkItemList(workList, res)
                                setWorkList([...list])
                            }
                        })
                        const data = {
                            workId: workId,
                            userId: userId
                        }
                        findStateNodeUserFieldList(data)
                    }
                    if (res.code === 40000) {
                        message.error(res.msg)
                    }
                })
            }
        })

    }


    const getTransitionList = (nodeId, flowId) => {

        const params = {
            fromNodeId: nodeId,
            flowId: flowId,
            domainId: workId,
            userId: userId
        }
        findTransitionList(params).then(res => {
            if (res.code === 0) {
                setTransformList(res.data)
            }
        })
    }

    const updateByBlur = (event, id) => {
        event.stopPropagation();
        event.preventDefault()
        updateTitle()
    }

    const updateTitle = () => {
        const name = inputRef.current.textContent;
        const params = {
            title: name,
            id: workId,
            updateField: "title",
        }
        if (workInfo.parentWorkItem) {
            params["parentWorkItem"] = { id: workInfo.parentWorkItem.id }
        }

        if (name !== workInfo.title) {
            editWork(params).then(res => {
                if (res.code === 0) {

                    if (workShowType === "list") {
                        workInfo.title = name;
                        if (document.getElementById(workId)) {
                            document.getElementById(workId).innerHTML = name;
                        }
                    } else {
                        // workList[workIndex - 1].title = name;
                        // setWorkList([...workList])
                        const list = setWorkTitle(workList, workId, name)
                        setWorkList([...list])
                    }


                }
            })
        }
        inputRef.current.blur()
        setIsFocus(false)
    }


    const updateNameByKey = (event) => {

        if (event.keyCode === 13) {
            event.stopPropagation();
            event.preventDefault()
            updateTitle()
        }

    }

    const focusTitleInput = () => {
        if (isPermissionField("title")) {
            inputRef.current.focus()
            setIsFocus(true)
        }

    }

    const viewFlow = () => {
        setShowFlow(true)
        const newDetailCrumbArray = getSessionStorage("detailCrumbArray")
        newDetailCrumbArray.push({ code: "流程", iconUrl: "flow.png", type: "flow" })
        setSessionStorage("detailCrumbArray", newDetailCrumbArray)
        setDetailCrumbArray(getSessionStorage("detailCrumbArray"))
    }
    const menu = (
        <div className="work-flow-transition">
            {
                transformList.length > 0 && transformList.map(item => {
                    return <div className="work-flow-item" key={item.id} onClick={() => changeStatus(item)}>{item.name} <SwapRightOutlined />
                        <span className="work-flow-text">{item.toNode.name}</span>
                    </div>
                })
            }
            <div className="work-flow-view" onClick={() => viewFlow()}>查看工作流</div>
        </div>

    );

    const changPage = (page) => {
        const workDetail = workList[page - 1]
        setWorkId(workDetail.id)
        setWorkIndex(page)
        setSessionStorage("detailCrumbArray", [{ id: workDetail.id, code: workDetail.code, title: workDetail.title, iconUrl: workDetail.workTypeSys.iconUrl }])
    }


    const [showFlow, setShowFlow] = useState(false);
    const isPermissionField = (code) => {
        const isEdit = permissionFieldList.indexOf(code) > -1 ? true : false;
        return isEdit;
    }

    return (
        <>
            {
                workInfo ?
                    <>
                        {
                            !showFlow ?
                                <>
                                    {workInfo &&
                                        <div className="work-detail">
                                            <Row >
                                                <Col {...rowSpan} style={{ background: "#fff", width: "100%"}}>
                                                    <Skeleton loading={infoLoading} active>
                                                        <WorkDetailCrumb
                                                            detailCrumbArray={detailCrumbArray}
                                                            setDetailCrumbArray={setDetailCrumbArray}
                                                            setShowFlow={setShowFlow}
                                                            setWorkId={setWorkId}
                                                            setIsModalVisible={setIsModalVisible}
                                                            workShowType={workShowType}
                                                            projectId={projectId}
                                                            sprintId = {sprintId}
                                                            versionId = {versionId}
                                                            {...props}
                                                        />
                                                        <div className="work-detail-top" ref={workDetailTop} >
                                                            <div className="work-detail-top-name">
                                                                <div className="work-item-title-top">
                                                                    <div
                                                                        className={`work-item-title ${isFocus ? "work-item-title-focus" : ""}`}
                                                                        onClick={() => focusTitleInput()}

                                                                    >
                                                                        <div
                                                                            contentEditable={isPermissionField("title")}
                                                                            suppressContentEditableWarning
                                                                            onBlur={() => updateByBlur(event, "blur")}
                                                                            onKeyDown={() => updateNameByKey(event, workInfo.id)}
                                                                            ref={inputRef}
                                                                            className="work-item-title-left"
                                                                        >
                                                                            {workInfo?.title}
                                                                        </div>
                                                                    </div>

                                                                    <div className="work-detail-tab-botton">
                                                                        <Dropdown
                                                                            overlay={menu}
                                                                            trigger={"click"}
                                                                            getPopupContainer={() => workDetailTop.current}
                                                                            onVisibleChange={(open) => console.log(open)}
                                                                        >
                                                                            <Button className="botton-background" style={{ marginRight: "10px" }}>
                                                                                {workStatus}
                                                                                <svg className="svg-icon" aria-hidden="true">
                                                                                    <use xlinkHref="#icon-downdrop"></use>
                                                                                </svg>
                                                                            </Button>
                                                                        </Dropdown>
                                                                        <WorkDeleteSelectModal
                                                                            getPopupContainer={workDetailTop}
                                                                            delectCurrentWorkItem={delectCurrentWorkItem}
                                                                            haveChildren={haveChildren}
                                                                            workId={workId}
                                                                            setWorkId={setWorkId}
                                                                        />
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                        <WorkDetailTab
                                                            workInfo={workInfo}
                                                            relationModalNum={relationModalNum}
                                                            setTabValue={setTabValue}
                                                            tabValue={tabValue}
                                                        />

                                                    </Skeleton>
                                                </Col>
                                            </Row>
                                            <Row style={{ flex: 1 }}>
                                                <Col {...rowSpan} style={{ background: "#fff" }}>
                                                    <Skeleton loading={infoLoading} active>
                                                        <WorkDetailBottom
                                                            workInfo={workInfo}
                                                            setWorkInfo={setWorkInfo}
                                                            getWorkDetail={getWorkDetail}
                                                            workDeatilForm={workDeatilForm}
                                                            relationModalNum={relationModalNum}
                                                            detailForm={detailForm}
                                                            getTransitionList={getTransitionList}
                                                            setTabValue={setTabValue}
                                                            tabValue={tabValue}
                                                            closeModal={closeModal}
                                                            {...props}
                                                        />

                                                    </Skeleton>
                                                </Col>
                                            </Row>


                                        </div>

                                    }
                                </>
                                :
                                <Row  style={{ flex: 1, height: "100%" }}>
                                    <Col {...rowSpan} style={{ background: "#fff", height: "100%" }}>
                                        <WorkDetailCrumb
                                            detailCrumbArray={detailCrumbArray}
                                            setDetailCrumbArray={setDetailCrumbArray}
                                            setShowFlow={setShowFlow}
                                            setWorkId={setWorkId}
                                            setIsModalVisible={setIsModalVisible}
                                            {...props}
                                        />
                                        <FlowChartLink flowId={workInfo.workType.flow.id} />
                                    </Col>
                                </Row>

                        }
                    </>
                    :
                    <Row style={{ flex: 1 }}>
                        <Col {...rowSpan} style={{ background: "#fff", }}>
                            <Skeleton loading={infoLoading} active>
                                <div style={{ marginTop: "200px" }}>
                                    <ProjectEmpty description="事项不存在或者已被删除~" />
                                </div>
                            </Skeleton>
                        </Col>
                    </Row>

            }


        </ >

    )
};

WorkDetail.defaultProps = {
    rowSpan: rowSpan
};
export default inject("workStore")(observer(WorkDetail));
