/*
 * @Descripttion: 事项详情
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-13 11:20:23
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-20 16:39:38
 */
import React, { useEffect, useState, useRef, Fragment } from "react";
import {Form, Dropdown, Skeleton, Button as ButtonAntd, message, Modal, Col, Row, Select, Space} from "antd";
import { observer, inject } from "mobx-react";
import 'moment/locale/zh-cn';
import WorkDetailBottom from "./WorkDetailBottom";
import { getUser } from 'tiklab-core-ui'
import "./WorkDetail.scss";
import {CaretDownOutlined, SwapRightOutlined} from '@ant-design/icons';
import Button from "../../common/button/Button";
import { setSessionStorage, getSessionStorage } from "../../common/utils/setSessionStorage";
import { FlowChartLink } from "tiklab-flow-ui";
import { setWorkTitle } from "./WorkArrayChange";
import {changeWorkItemList, changeWorkItemParent} from "./WorkGetList";
import WorkDetailCrumb from "./WorkDetailCrumb";
import WorkDetailTab from "./WorkDetailTab";
import WorkDeleteSelectModal from "./WorkDeleteSelectModal";
import ProjectEmpty from "../../common/component/ProjectEmpty";
import WorkPrivilegeComponent from "./WorkPrivilegeComponent";
import UserIcon from "../../common/UserIcon/UserIcon";
import ImgComponent from "../../common/imgComponent/ImgComponent";
import WorkDetailSelect from "./WorkDetailSprintSelect";
import {updateWorkTree} from "../../project/stage/component/StageListTreeChange";

const rowSpan = {
    sm: 24,
    md: 24,
    lg: 24,
    xl: 24,
    xxl: 24
}

const WorkDetail = (props) => {
    const [detailForm] = Form.useForm();

    const { workStore, setIsModalVisible, delectCurrentWorkItem, rowSpan, closeModal } = props;
    const { workList, setWorkList, setWorkId, workShowType, workId, editWork,
        setWorkIndex, getWorkTypeList, getModuleList, findSprintList, getSelectUserList,
        findPriority, searchWorkById, findTransitionList, findWorkItemRelationModelCount,
        findSelectVersionList, haveChildren, findStageList, findWorkItemRoleFunctionDmCode, permissionFieldList,
        findWorkItemDetailMetaData, userList, priorityList, stageList, sprintList
    } = workStore;
    const [detailCrumbArray, setDetailCrumbArray] = useState(getSessionStorage("detailCrumbArray"));
    const projectId = props.match.params.id;
    const userId = getUser().userId;
    const workDeatilForm = useRef()
    const inputRef = useRef()
    const [workInfo, setWorkInfo] = useState();
    const [workStatus, setWorkStatus] = useState("nostatus")
    const [isFocus, setIsFocus] = useState();
    const [infoLoading, setInfoLoading] = useState(true)
    const [transformList, setTransformList] = useState([])
    const [assigner, setAssigner] = useState()
    const workDetailTop = useRef();
    const [relationModalNum, setRelationModalNum] = useState();
    const [tabValue, setTabValue] = useState(1);
    const [workDetailMetaData, setWorkDetailMetaData] = useState();
    const [detailTopForm] = Form.useForm();
    const [nickName, setNickName] = useState("")
    const [iconUrl, setIconUrl] = useState("")
    const detailTopFormRef = useRef();
    // 鼠标放置的字段的名字
    const [hoverFieldName, setHoverFieldName] = useState("")
    // 聚焦的字段的名字
    const [fieldName, setFieldName] = useState("")
    // 点击字段
    const changeStyle = (value, fieldCode) => {
        if (isPermissionField(fieldCode)) {
            return;
        }
        setFieldName(value)
    }
    /**
     * 鼠标进入表单，显示为编辑模式
     * @param {*} code
     */
    const onMouseEnter = (code) => {
        if (isPermissionField(code)) {
            setHoverFieldName(code)
        }

    }
    const setStatuStyle = (status) => {
        let name;
        switch (status) {
            case "TODO":
                name = "work-status-todo";
                break;
            case "DONE":
                name = "work-status-done";
                break;
            default:
                name = "work-status-process";
                break;
        }
        return name;
    }

    const changeWorkItemInfo = (changedValues, allValues) => {
        let changeKey = Object.keys(changedValues)[0];
        if (!Object.values(changedValues)[0]) {
            changedValues[Object.keys(changedValues)[0]] = "nullstring"
        }

        if (changeKey === "workPriority") {
            const priority = priorityList.filter(item => {
                return item.id === changedValues.workPriority
            })
            changedValues.workPriority = priority[0];
        }

        if (changeKey === "assigner") {
            changedValues.assigner = {
                id: changedValues.assigner
            }
        }

        let data = {
            ...changedValues,
            id: workId,
            updateField: changeKey
        }
        update(data, changedValues, changeKey)

        setFieldName("")
    }

    const update = (data, changedValues, changeKey) => {
        editWork(data).then(res => {
            if (res.code === 0) {
                setWorkInfo({ ...workInfo, ...changedValues })
                getTransitionList(workInfo?.workStatusNode?.id, workInfo?.workType?.flow?.id)
                //  更新列表数据
                if (props.match.path.indexOf("/work") > -1 && (changeKey === "assigner" || changeKey === "workPriority")
                ) {
                    searchWorkById(workId).then((res) => {
                        if (res) {
                            // 修改列表中数据
                            const list = changeWorkItemList(workList, res)
                            setWorkList([...list])

                            if (changeKey === "assigner"){
                                setNickName(res.assigner?.nickname)
                            }
                            if (changeKey === "workPriority"){
                                setIconUrl(res.workPriority?.iconUrl)
                            }
                        }
                    })
                }
            }
            if (res.code === 3001) {
                message.info(res.msg)

            }
        })
    }


    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;

    const getWorkDetail = (id) => {
        setInfoLoading(true)
        findWorkItemDetailMetaData(id).then((result) => {
            setInfoLoading(false)
            setTabValue(1)
            if (result){
                setWorkDetailMetaData(result.data);
                const res = result.data.workItem;
                setWorkInfo(res);

                setWorkStatus(res.workStatusNode.name ? res.workStatusNode.name : "nostatus")
                setAssigner({ label: res.assigner?.nickname, value: res.assigner?.id })

                detailTopForm.setFieldsValue({
                    assigner: res.assigner?.id,
                    workPriority: res.workPriority?.id,
                    sprint: res.sprint?.id,
                    stage: res.stage?.id,
                })
                setNickName(res.assigner?.nickname)
                setIconUrl(res.workPriority?.iconUrl)
                getTransitionList(res.workStatusNode.id, res.workType.flow.id)

                findWorkItemRelationModelCount({ workItemId: res.id, workTypeCode: res.workTypeCode }).then(res => {
                    if (res.code === 0) {
                        setRelationModalNum(res.data)
                    }
                })

                // 获取字段权限
                // 获取表单字段权限
                const data = {
                    workTypeId: res.workType.id,
                    workId: workId,
                    userId: userId,
                    domainId:projectId
                }
                findWorkItemRoleFunctionDmCode(data).then(res => {
                    if(res.code === 0){
                        console.log(res.data)
                    }
                })

                if (props.match.path === "/project/:id/work/:workId") {
                    setSessionStorage("detailCrumbArray", [{ id: res.id, code: res.code, title: res.title, iconUrl: res.workTypeSys.iconUrl }])
                    setDetailCrumbArray(getSessionStorage("detailCrumbArray"))
                }
            }
        })
    }

    useEffect(() => {
        console.log("进入详情了     " + props.match.path)
        if (props.match.path === "/project/:id/work/:workId" || props.match.path === "/:id/version/:version/work/:workId"
            || props.match.path === "/:id/sprint/:sprint/work/:workId" || props.match.path === "/index/todoList/:workId") {
            const id = props.match.params.workId;
            setWorkId(id)
            if (id) {
                // findPriority()
                getWorkDetail(id)
    
            }
            if (id === 0) {
                setWorkDetailMetaData(null);
                setWorkInfo(null)
                setInfoLoading(false)
            }
        }
        return null;
    }, [props.match.params.workId])

    useEffect(() => {
        setWorkInfo()
        setWorkDetailMetaData();
        if (props.match.path !== "/project/:id/work/:workId" && props.match.path !== "/:id/version/:version/work/:workId"
            && props.match.path !== "/:id/sprint/:sprint/work/:workId") {
                if (workId && workId.length > 0) {
                    findPriority()
                    getWorkDetail(workId)
        
                }
                if (workId === 0) {
                    setWorkDetailMetaData(null);
                    setWorkInfo(null)
                    setInfoLoading(false)
                }
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
                                            <Row className="work-detail-top-row">
                                                <Col {...rowSpan} style={{ background: "#fff", width: "100%" }}>
                                                    <Skeleton loading={infoLoading} active>
                                                        <WorkDetailCrumb
                                                            detailCrumbArray={detailCrumbArray}
                                                            setDetailCrumbArray={setDetailCrumbArray}
                                                            setShowFlow={setShowFlow}
                                                            setWorkId={setWorkId}
                                                            setIsModalVisible={setIsModalVisible}
                                                            workShowType={workShowType}
                                                            projectId={projectId}
                                                            sprintId={sprintId}
                                                            versionId={versionId}
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
                                                                        <WorkPrivilegeComponent code={'WorkItemDelete'} workId ={workId}  {...props}>
                                                                            <WorkDeleteSelectModal
                                                                                getPopupContainer={workDetailTop}
                                                                                delectCurrentWorkItem={delectCurrentWorkItem}
                                                                                haveChildren={haveChildren}
                                                                                workId={workId}
                                                                                setWorkId={setWorkId}
                                                                            />
                                                                        </WorkPrivilegeComponent>

                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                        <div className="work-detail-top-info" ref={detailTopFormRef}>
                                                            <Skeleton loading={infoLoading} active>
                                                                <Form
                                                                    className="work-detail-top-info-form"
                                                                    form={detailTopForm}
                                                                    initialValues={{ remember: true }}
                                                                    labelAlign="left"
                                                                    layout="vertical"
                                                                    onValuesChange={(changedValues, allValues) => changeWorkItemInfo(changedValues, allValues)}
                                                                >
                                                                    <Row style={{width: "100%"}}>
                                                                        <Col span={4}>
                                                                            <div style={{
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                gap: "5px"
                                                                            }}>
                                                                                <UserIcon name={nickName} size={"big"} />
                                                                                <Form.Item label="负责人" name="assigner"
                                                                                >
                                                                                    <Select
                                                                                        placeholder="无"
                                                                                        className="work-select"
                                                                                        key="selectAssigner"
                                                                                        bordered={fieldName === "assigner" ? true : false}
                                                                                        suffixIcon={fieldName === "assigner" || hoverFieldName == "assigner" ? <CaretDownOutlined /> : false}
                                                                                        onFocus={() => changeStyle("assigner", "assigner")}
                                                                                        onBlur={() => setFieldName("")}
                                                                                        onMouseEnter={() => onMouseEnter("assigner")}
                                                                                        onMouseLeave={() => setHoverFieldName("")}
                                                                                        getPopupContainer={() => detailTopFormRef.current}
                                                                                        disabled={!isPermissionField("assigner")}
                                                                                        dropdownMatchSelectWidth={false} // 下拉菜单不自适应宽度
                                                                                    >
                                                                                        {
                                                                                            userList && userList.map((item) => {
                                                                                                return <Select.Option value={item.user?.id} key={item.user?.id}>
                                                                                                    <div style={{
                                                                                                        display: "flex",
                                                                                                        alignItems: "center",
                                                                                                        gap: "10px"
                                                                                                    }}>

                                                                                                        {item.user?.nickname ? item.user?.nickname : item.user?.name}
                                                                                                    </div>
                                                                                                </Select.Option>
                                                                                            })
                                                                                        }
                                                                                    </Select>
                                                                                </Form.Item>
                                                                            </div>
                                                                        </Col>
                                                                        <Col span={4} offset={1}>
                                                                            <div style={{
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                gap: "5px"
                                                                            }}>
                                                                                <ImgComponent
                                                                                    src={iconUrl}
                                                                                    alt=""
                                                                                    className="icon-25"
                                                                                />
                                                                                <Form.Item label="优先级" name="workPriority"
                                                                                           hasFeedback={false}
                                                                                           validateStatus={"validating"}
                                                                                >
                                                                                    <Select
                                                                                        placeholder="无"
                                                                                        className="work-select"
                                                                                        key="selectWorkPriority"
                                                                                        bordered={fieldName === "workPriority" ? true : false}
                                                                                        suffixIcon={fieldName === "workPriority" || hoverFieldName == "workPriority" ? <CaretDownOutlined /> : false}
                                                                                        onFocus={() => changeStyle("workPriority", "workPriority")}
                                                                                        onBlur={() => setFieldName("")}
                                                                                        onMouseEnter={() => onMouseEnter("workPriority")}
                                                                                        onMouseLeave={() => setHoverFieldName("")}
                                                                                        allowClear
                                                                                        getPopupContainer={() => detailTopFormRef.current}
                                                                                        disabled={!isPermissionField("workPriority")}
                                                                                        dropdownMatchSelectWidth={false} // 下拉菜单不自适应宽度
                                                                                    >
                                                                                        {
                                                                                            priorityList && priorityList.map((item) => {
                                                                                                return <Select.Option value={item.id} key={item.id}>
                                                                                                    <div style={{
                                                                                                        display: "flex",
                                                                                                        alignItems: "center",
                                                                                                        gap: "10px"
                                                                                                    }}>
                                                                                                        {item.name}
                                                                                                    </div>
                                                                                                </Select.Option>
                                                                                            })
                                                                                        }
                                                                                    </Select>
                                                                                </Form.Item>
                                                                            </div>
                                                                        </Col>
                                                                        <Col span={4} offset={1}>
                                                                            <Form.Item label="状态" name="workStatus"
                                                                            >
                                                                                <div className={`work-status ${setStatuStyle(workInfo.workStatusNode?.status)}`} style={{ padding: "0 11px" }}>{workInfo.workStatusNode?.name}</div>
                                                                            </Form.Item>
                                                                        </Col>
                                                                    </Row>






                                                                </Form>
                                                            </Skeleton>

                                                        </div>
                                                        <WorkPrivilegeComponent roleId = {userId} domainId = {projectId} workTypeId = {workInfo.workType.id}/>
                                                        <WorkDetailTab
                                                            workInfo={workInfo}
                                                            relationModalNum={relationModalNum}
                                                            setTabValue={setTabValue}
                                                            tabValue={tabValue}
                                                        />

                                                    </Skeleton>
                                                </Col>
                                            </Row>
                                            <Row className="work-detail-info-row">
                                                <Col {...rowSpan} style={{ background: "#fff" }}>
                                                    <Skeleton loading={infoLoading} active>
                                                        <WorkDetailBottom
                                                            workInfo={workInfo}
                                                            setWorkInfo={setWorkInfo}
                                                            workDetailMetaData={workDetailMetaData}
                                                            setWorkDetailMetaData={setWorkDetailMetaData}
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
                                <Row style={{ flex: 1, height: "100%" }}>
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
