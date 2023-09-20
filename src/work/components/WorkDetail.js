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
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import { getUser } from 'tiklab-core-ui'
import "./WorkDetail.scss";
import { SwapRightOutlined } from '@ant-design/icons';
import Button from "../../common/button/Button";
import { SelectSimple, SelectItem } from "../../common/select";
import { setSessionStorage, getSessionStorage } from "../../common/utils/setSessionStorage";
import { FlowChartLink } from "tiklab-flow-ui";
const WorkDetail = (props) => {
    const [percentForm] = Form.useForm();
    const { workStore, showPage, setIsModalVisible } = props;
    const { workList, setWorkList, setWorkId, defaultCurrent, detWork, workShowType,
        getWorkConditionPageTree, getWorkConditionPage, total, workId, editWork,
        setWorkIndex, workIndex, getWorkBoardList, getWorkTypeList, getModuleList,
        getsprintlist, getSelectUserList, findPriority, viewType, userList, searchWorkById,
        setAlertText, setIsShowAlert, findTransitionList
    } = workStore;
    const detailCrumbArray = getSessionStorage("detailCrumbArray");
    const projectId = props.match.params.id;
    const userId = getUser().userId;
    const workDeatilForm = useRef()
    const inputRef = useRef()
    const [workInfo, setWorkInfo] = useState();
    const [workStatus, setWorkStatus] = useState("nostatus")
    const tenant = getUser().tenant;
    const [percentValue, setPercentValue] = useState(0)
    const [isFocus, setIsFocus] = useState()
    const path = props.match.path.split("/")[2];
    const [isTableDetail, setIsTableDetail] = useState(false)
    const [infoLoading, setInfoLoading] = useState(false)
    const [transformList, setTransformList] = useState([])
    const [assigner, setAssigner] = useState()
    const workDetailTop = useRef();
    const getWorkDetail = (id) => {
        setInfoLoading(true)
        searchWorkById(id).then((res) => {
            setInfoLoading(false)
            if (res) {
                setWorkInfo(res)
                getTransitionList(res.workStatusNode.id, res.workType.flow.id)
                setWorkStatus(res.workStatusNode.name ? res.workStatusNode.name : "nostatus")
                setAssigner({ label: res.assigner?.nickname, value: res.assigner?.id })
                // percentForm.setFieldsValue({ percent: res.percent, assigner: res.assigner?.id })
            }
        })
    }

    useEffect(() => {
        setWorkInfo()
        if (workId && workId.length > 0) {
            getWorkTypeList({ projectId: projectId });
            getModuleList(projectId)
            getsprintlist(projectId)
            getSelectUserList(projectId);
            findPriority()
            getWorkDetail(workId)

        }
        if (workId === 0) {
            setWorkInfo(null)
        }
        return
    }, [workId]);


    const deleteWork = () => {
        detWork(workId).then(() => {
            if (workShowType === "bodar") {
                getWorkBoardList().then((res) => {
                    if (res[indexParams.statusIndex].workItemList.length > 0) {
                        initForm(res[indexParams.statusIndex].workItemList[0].id, indexParams.workIndex);
                    }
                })
            } else if ((workShowType === "list" || workShowType === "table") && viewType === "tree") {
                getWorkConditionPageTree().then((res) => {
                    if (total === defaultCurrent) {
                        getWorkDetail(res.dataList[0].id);
                    } else {
                        getWorkDetail(res.dataList[defaultCurrent - 1].id);
                    }
                })
            } else if ((workShowType === "list" || workShowType === "table") && viewType === "tile") {
                getWorkConditionPage().then((res) => {
                    if (total === defaultCurrent) {
                        getWorkDetail(res.dataList[0].id);
                    } else {
                        getWorkDetail(res.dataList[defaultCurrent - 1].id);
                    }
                })
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
                        percentForm.setFieldsValue({ assigner: res.assigner?.id })
                        workInfo.assigner = res.assigner;
                        getTransitionList(res.workStatusNode.id, res.workType.flow.id)
                        setWorkStatus(res.workStatusNode.name ? res.workStatusNode.name : "nostatus")
                        workList[workIndex - 1].workStatusNode = res.workStatusNode;
                        workList[workIndex - 1].workStatusCode = res.workStatusCode;
                        // setWorkList([...workList])
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
    const [validateStatus, setValidateStatus] = useState("validating")
    const [showValidateStatus, setShowValidateStatus] = useState(false)


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
                    if (document.getElementById(workId)) {
                        document.getElementById(workId).innerHTML = name;
                    }
                    if (workShowType === "list") {
                        workInfo.title = name;
                    } else {
                        workList[workIndex - 1].title = name;
                        setWorkList([...workList])
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


    const [fieldName, setFieldName] = useState("")
    const changeStyle = (value) => {
        setFieldName(value)
    }

    const updateSingle = (workId, updateData, updateField) => {
        setFieldName("")
        let data = {
            ...updateData,
            id: workId,
            updateField: updateField
        }
        setIsShowAlert(true)
        setAlertText("保存中...")

        editWork(data).then(res => {
            if (res.code === 0) {
                if (updateField === "assigner") {
                    const user = userList.filter(item => {
                        return item.user?.id === updateData.assigner
                    })
                    workList[workIndex - 1].assigner = user[0].user;
                    workInfo.assigner = user[0].user;
                    setWorkList([...workList])
                }

                setValidateStatus("success")
                setAlertText("保存成功！")

                setTimeout(() => {
                    setIsShowAlert(false)

                }, 1000)
            }
        })
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

    const [showFlow, setShowFlow] = useState(false)
    return (
        <Skeleton loading={infoLoading} active>
            {
                workInfo ? <div className="work-detail">
                    {
                        detailCrumbArray?.length > 0 &&
                        <div className="work-detail-crumb-col">
                            <div className="work-detail-crumb">
                                {
                                    props.match.path === "/index/projectDetail/:id/workDetail/:workId" && <div className="work-detail-crumb-item" onClick={() => props.history.push(`/index/projectDetail/${projectId}/workTable`)}>事项
                                        <svg className="img-icon" aria-hidden="true" style={{ marginLeft: "5px" }}>
                                            <use xlinkHref="#icon-rightBlue"></use>
                                        </svg>
                                    </div>
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
                                                        className="img-icon"
                                                    />
                                                        :
                                                        <img
                                                            src={version === "cloud" ?
                                                                (upload_url + item.iconUrl + "?tenant=" + tenant)
                                                                :
                                                                (upload_url + item.iconUrl)
                                                            }
                                                            alt=""
                                                            className="img-icon"
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
                                                        className="img-icon"
                                                    />
                                                        :
                                                        <img
                                                            src={version === "cloud" ?
                                                                (upload_url + item.iconUrl + "?tenant=" + tenant)
                                                                :
                                                                (upload_url + item.iconUrl)
                                                            }
                                                            alt=""
                                                            className="img-icon"
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
                                workShowType !== "list" && <div className="work-detail-close" onClick={() => setIsModalVisible(false)}>
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
                                                >
                                                    <Button  >
                                                        <svg className="img-icon" aria-hidden="true">
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
                                {workInfo && <WorkDetailBottom workInfo={workInfo} setWorkInfo={setWorkInfo} getWorkDetail={getWorkDetail} workDeatilForm={workDeatilForm} {...props} />}
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
