/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-13 11:20:23
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 14:26:52
 */
import React, { useEffect, useState, useRef, Fragment } from "react";
import { Form, Space, Empty, Dropdown, Skeleton, Select, InputNumber, Popconfirm, message } from "antd";
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
import setImageUrl from "../../common/utils/setImageUrl";
import { removeNodeInTree, removeTableTree } from "../../common/utils/treeDataAction";
import { setWorkDeatilInList } from "./WorkSearch";
import { setWorkTitle } from "./WorkArrayChange";
const WorkDetail = (props) => {
    const [detailForm] = Form.useForm();
    // const [percentForm] = Form.useForm();
    
    const { workStore, showPage, setIsModalVisible } = props;
    const { workList, setWorkList, setWorkId, defaultCurrent, detWork, workShowType,
        getWorkConditionPageTree, getWorkConditionPage, total, workId, editWork,
        setWorkIndex, workIndex, getWorkBoardList, getWorkTypeList, getModuleList,
        getsprintlist, getSelectUserList, findPriority, viewType, userList, searchWorkById,
        findTransitionList, findWorkItemRelationModelCount, findVersionList
    } = workStore;
    const [detailCrumbArray, setDetailCrumbArray] = useState(getSessionStorage("detailCrumbArray"));
    const projectId = props.match.params.id;
    const userId = getUser().userId;
    const workDeatilForm = useRef()
    const inputRef = useRef()
    const [workInfo, setWorkInfo] = useState();
    const [workStatus, setWorkStatus] = useState("nostatus")
    const [isFocus, setIsFocus] = useState();
    const [isTableDetail, setIsTableDetail] = useState(false)
    const [infoLoading, setInfoLoading] = useState(false)
    const [transformList, setTransformList] = useState([])
    const [assigner, setAssigner] = useState()
    const workDetailTop = useRef();
    const [relationModalNum, setRelationModalNum] = useState();
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const getWorkDetail = (id) => {
        setInfoLoading(true)
        searchWorkById(id).then((res) => {
            setInfoLoading(false)
            if (res) {
                setWorkInfo(res)
                getTransitionList(res.workStatusNode.id, res.workType.flow.id)
                setWorkStatus(res.workStatusNode.name ? res.workStatusNode.name : "nostatus")
                setAssigner({ label: res.assigner?.nickname, value: res.assigner?.id })
                findWorkItemRelationModelCount({ workItemId: res.id, workTypeCode: res.workTypeCode }).then(res => {
                    if (res.code === 0) {
                        setRelationModalNum(res.data)
                    }
                })
                console.log(props.match.path)
                if (props.match.path === "/projectDetail/:id/work/:workId") {
                    console.log(id)
                    setSessionStorage("detailCrumbArray", [{ id: res.id, title: res.title, iconUrl: res.workTypeSys.iconUrl}])
                    setDetailCrumbArray(getSessionStorage("detailCrumbArray"))
                }
            }
        })
    }
    const isDetail = () => {
        let isView = false;
        if(props.match.path === "/projectDetail/:id/work/:workId" || props.match.path === "/:id/versiondetail/:version/work/:workId"
        || props.match.path === "/:id/sprintdetail/:sprint/work/:workId"){
            isView = true;
        }
        return isView;
    }
    useEffect(() => {
        // if (isDetail()) {
        //     const id = props.match.params.workId;
        //     console.log(id)
        //     setWorkId(id)
        // }
        if(props.match.path === "/projectDetail/:id/work/:workId" || props.match.path === "/:id/versiondetail/:version/work/:workId"
        || props.match.path === "/:id/sprintdetail/:sprint/work/:workId"){
            const id = props.match.params.workId;
            setWorkId(id)
        }
    }, [props.match.params.workId])

    useEffect(() => {
        setWorkInfo()
        if (workId && workId.length > 0) {
            getWorkTypeList({ projectId: projectId });
            getModuleList(projectId)
            getsprintlist(projectId)
            getSelectUserList(projectId);
            findVersionList(projectId)
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
    }, [workId, workShowType])

    const deleteWork = () => {
        detWork(workId).then(() => {
            if (workShowType === "table") {
                setIsModalVisible(false)
                removeTableTree(workList, workId)
                //如果本页被删除完，重新请求接口
                if (workList.length == 0) {
                    if (viewType === "tree") {
                        getWorkConditionPageTree()
                    }
                    if (viewType === "tile") {
                        getWorkConditionPage()
                    }
                } else {
                    setWorkList([...workList])
                }

            }
            if (workShowType === "bodar") {
                getWorkBoardList()
            }
            if (workShowType === "list") {
                removeNodeInTree(workList, workId, setWorkId, setSessionStorage)
                setWorkList([...workList])
                if (workList.length == 0) {
                    setWorkDeatilInList(workStore)
                } else {
                    setWorkList([...workList])
                }
            }
        })
    }

    const changeStatus = (transition) => {
        if (userId !== workInfo.assigner?.id) {
            message.error("没有权限")
            return
        }
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
                        workInfo.assigner = res.assigner;
                        getTransitionList(res.workStatusNode.id, res.workType.flow.id)
                        setWorkStatus(res.workStatusNode.name ? res.workStatusNode.name : "nostatus")
                        workList[workIndex - 1].workStatusNode = res.workStatusNode;
                        workList[workIndex - 1].workStatusCode = res.workStatusCode;
                    }
                })
            }
            if (res.code === 40000) {
                message.error(res.msg)
            }
        })
    }


    const getTransitionList = (nodeId, flowId) => {
        findTransitionList({ fromNodeId: nodeId, flowId: flowId }).then(res => {
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
            console.log(workId)
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
        inputRef.current.focus()
        setIsFocus(true)
    }

    const viewFlow = () => {
        setShowFlow(true)
        const newDetailCrumbArray = getSessionStorage("detailCrumbArray")
        newDetailCrumbArray.push({ id: "流程", iconUrl: "/images/flow.png", type: "flow" })
        setSessionStorage("detailCrumbArray", newDetailCrumbArray)
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
    const goCrumWork = (index, id) => {
        const lastCrum = detailCrumbArray[detailCrumbArray.length - 1];
        if (lastCrum.type === "flow") {
            setShowFlow(false)
        } else {
            setWorkId(id)
        }

        const array = detailCrumbArray.slice(0, index + 1)
        setSessionStorage("detailCrumbArray", array)
    }

    const changPage = (page) => {
        const workDetail = workList[page - 1]
        setWorkId(workDetail.id)
        setWorkIndex(page)
        setSessionStorage("detailCrumbArray", [{ id: workDetail.id, title: workDetail.title, iconUrl: workDetail.workTypeSys.iconUrl }])
    }

    const closeDrawer = () => {
        setIsModalVisible(false)
        setWorkId(0)
    }
    const [showFlow, setShowFlow] = useState(false);
    const goWorkList = () => {


        if(props.match.path === "/projectDetail/:id/work/:workId"){
            props.history.push(`/projectDetail/${projectId}/workTable`)
        }
        if(props.match.path === "/:id/versiondetail/:version/work/:workId"){
            props.history.push(`/${projectId}/versiondetail/${versionId}/workTable`)
        }
        if(props.match.path === "/:id/sprintdetail/:sprint/work/:workId"){
            props.history.push(`/${projectId}/sprintdetail/${sprintId}/workTable`)
        }
        
    }
    return (
        <Skeleton loading={infoLoading} active>
            {
                workInfo ? <div className="work-detail">
                    {
                        detailCrumbArray?.length > 0 &&
                        <div className="work-detail-crumb-col">
                            <div className="work-detail-crumb">

                                {
                                    isDetail() &&
                                    <div className="work-detail-crumb-item" onClick={() =>goWorkList() }> 
                                    <svg className="svg-icon work-detail-crumb-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-pageLeft"></use>
                                    </svg>
                                     事项 &nbsp;/ &nbsp;</div>
                                }
                                {
                                    detailCrumbArray?.length > 0 && detailCrumbArray.map((item, index) => {
                                        let html;
                                        if (!isTableDetail && index === 0) {
                                            html = <div className="work-detail-crumb-item" key={item.id} onClick={() => goCrumWork(index, item.id)}>
                                                {
                                                    item.type === "flow" ? <img
                                                        src={item.iconUrl}
                                                        alt=""
                                                        className="img-icon-right"
                                                    />
                                                        :
                                                        <img
                                                            src={setImageUrl(item.iconUrl)}
                                                            alt=""
                                                            className="img-icon-right"
                                                        />
                                                }

                                                <span className="work-detail-crumb-text">{item.id}</span>
                                            </div>
                                        } else {
                                            html = <div className="work-detail-crumb-item" key={item.id} onClick={() => goCrumWork(index, item.id)}>
                                                <span style={{ padding: "0 10px" }}>/</span>
                                                {
                                                    item.type === "flow" ? <img
                                                        src={item.iconUrl}
                                                        alt=""
                                                        className="img-icon-right"
                                                    />
                                                        :
                                                        <img

                                                            src={setImageUrl(item.iconUrl)}
                                                            alt=""
                                                            className="img-icon-right"
                                                        />
                                                }
                                                <span className="work-detail-crumb-text">{item.id}</span>
                                            </div>
                                        }
                                        return html

                                    })
                                }
                            </div>
                            {
                                workShowType !== "list" && <div className="work-detail-close" onClick={() => closeDrawer()}>
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-close"></use>
                                    </svg>
                                </div>
                            }
                        </div>

                    }

                    {
                        !showFlow ? <>
                            <div className="work-detail-top" ref={workDetailTop}>
                                <div className="work-detail-top-name">
                                    <div className="work-item-title-top">
                                        <div
                                            className={`work-item-title ${isFocus ? "work-item-title-focus" : ""}`}
                                            onClick={() => focusTitleInput()}

                                        >
                                            <div
                                                contentEditable={true}
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

                                            <Dropdown overlay={menu} trigger={"click"} getPopupContainer={() => workDetailTop.current}>
                                                <Button className="botton-background" style={{ marginRight: "10px" }}>
                                                    {workStatus}
                                                    <svg className="svg-icon" aria-hidden="true">
                                                        <use xlinkHref="#icon-downdrop"></use>
                                                    </svg>
                                                </Button>
                                            </Dropdown>
                                            <PrivilegeProjectButton code={'WorkDelete'} disabled={"hidden"} domainId={projectId}  {...props}>
                                                <Popconfirm
                                                    title="确定删除事项?"
                                                    onConfirm={() => deleteWork()}
                                                    // onCancel={cancel}
                                                    okText="是"
                                                    cancelText="否"
                                                    getPopupContainer={() => workDetailTop.current}
                                                >
                                                    <Button  >
                                                        <svg className="img-icon-right" aria-hidden="true">
                                                            <use xlinkHref="#icon-delete"></use>
                                                        </svg>
                                                        删除
                                                    </Button>
                                                </Popconfirm>
                                            </PrivilegeProjectButton>
                                            <div className="more">
                                                <svg className="svg-icon" aria-hidden="true">
                                                    <use xlinkHref="#icon-more"></use>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="work-detail-tab">
                                {workInfo && <WorkDetailBottom
                                    workInfo={workInfo}
                                    setWorkInfo={setWorkInfo}
                                    getWorkDetail={getWorkDetail}
                                    workDeatilForm={workDeatilForm}
                                    relationModalNum={relationModalNum}
                                    detailForm = {detailForm}
                                    {...props}
                                />}
                            </div>
                        </>
                            :
                            <FlowChartLink flowId={workInfo.workType.flow.id} />
                    }

                </div>
                    :
                    <div style={{ marginTop: "200px" }}>
                        <Empty image="/images/nodata.png" description="暂时没有事项~" />
                    </div>

            }
        </Skeleton>

    )
};
export default inject("workStore")(observer(WorkDetail));
