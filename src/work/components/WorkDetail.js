/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-13 11:20:23
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 14:26:52
 */
import React, { useEffect, useState, useRef, Fragment } from "react";
import { Form, Space, Empty, Dropdown, Skeleton, Select, InputNumber } from "antd";
import { observer, inject } from "mobx-react";
import 'moment/locale/zh-cn';
import WorkDetailBottom from "./WorkDetailBottom";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import { getUser } from 'tiklab-core-ui'
import "./WorkDetail.scss";
import { SwapRightOutlined } from '@ant-design/icons';
import Button from "../../common/button/Button";
import UserIcon from "../../common/UserIcon/UserIcon";
import { setSessionStorage, getSessionStorage } from "../../common/utils/setSessionStorage";

const WorkDetail = (props) => {
    const [percentForm] = Form.useForm();
    const { workStore, showPage, setIsModalVisible } = props;
    const { workList, setWorkList, setWorkId, defaultCurrent, detWork, workShowType, setWorkShowType,
        getWorkConditionPageTree, getWorkConditionPage, total, workId, editWork,
        setWorkIndex, workIndex, getWorkBoardList, findToNodeList, getWorkTypeList, getModuleList,
        getsprintlist, getSelectUserList, findPriority, viewType, userList, searchWorkById,
        setAlertText, setIsShowAlert, findTransitionList
    } = workStore;
    const detailCrumbArray = getSessionStorage("detailCrumbArray");
    // const workIndex = setWorkIndex(getSessionStorage("workIndex"));
    const projectId = props.match.params.id;
    const sprintId = props.match?.params?.sprint;
    const routerWorkId = props.match.params.workId;
    const workDeatilForm = useRef()
    const inputRef = useRef()
    const [workInfo, setWorkInfo] = useState();
    const [workStatus, setWorkStatus] = useState("nostatus")
    const userId = getUser().userId;
    const tenant = getUser().tenant;
    const [percentValue, setPercentValue] = useState(0)
    const [isFocus, setIsFocus] = useState()
    const path = props.match.path.split("/")[2];
    const [isTableDetail, setIsTableDetail] = useState(false)
    const [infoLoading, setInfoLoading] = useState(false)
    const [transformList, setTransformList] = useState([])
    const workDetailTop = useRef();
    const getWorkDetail = (id) => {
        setInfoLoading(true)
        searchWorkById(id).then((res) => {
            setInfoLoading(false)
            if (res) {
                setWorkInfo(res)
                getTransitionList(res.workStatusNode.id, res.workType.flow.id)
                setWorkStatus(res.workStatusNode.name ? res.workStatusNode.name : "nostatus")
                if (props.match.path === "/index/projectDetail/:id/workList") {
                    let crumbArray = [{ id: res.id, title: res.title, iconUrl: res.workTypeSys.iconUrl }];
                    setSessionStorage("detailCrumbArray", crumbArray);
                }

                percentForm.setFieldsValue({ percent: res.percent, assigner: res.assigner?.id })
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

    // useEffect(() => {
    //     if (props.match.path === "/index/projectDetail/:id/workone/:workId") {
    //         const id = props.match.params.workId;
    //         setWorkId(id)
    //         setWorkIndex(0)
    //         getWorkDetail(id)
    //         setWorkShowType("table")
    //     }
    //     if (props.match.path === "/index/projectDetail/:id/workDetail/:workId") {
    //         setWorkId(routerWorkId)
    //         setWorkIndex(getSessionStorage("workIndex"))
    //     }
    //     return
    // }, []);


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
                        getTransitionList(res.workStatusNode.id, res.workType.flow.id)
                        setWorkStatus(res.workStatusNode.name ? res.workStatusNode.name : "nostatus")
                        workList[workIndex - 1] = res;
                        setWorkList([...workList])
                    }
                })

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
            if (updateField === "assigner") {
                if (props.match.path === "/index/projectDetail/:id/work" || props.match.path === "/index/work" ||
                    props.match.path === "/index/:id/sprintdetail/:sprint/workItem") {
                    const user = userList.filter(item => {
                        return item.user.id === updateData.assigner
                    })
                    workList[workIndex - 1].assigner = user[0].user;
                    setWorkList([...workList])
                }
            }

            if (res.code === 0) {
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

    const menu = (
        <div className="work-flow-transition">
            {
                transformList.length > 0 && transformList.map(item => {
                    return <div className="work-flow-item" key={item.id} onClick={() => changeStatus(item)}>{item.name} <SwapRightOutlined /> <span className="work-flow-text">{item.toNode.name}</span> </div>
                })
            }
            <div className="work-flow-view" onClick={() => props.history.push(`/index/${path}/${projectId}/projectSetDetail/projectFlowDetail/${workInfo?.workType?.flow.id}`)}>查看工作流</div>

        </div>

    );
    const goCrumWork = (index, id) => {
        setWorkId(id)
        const array = detailCrumbArray.slice(0, index + 1)
        setSessionStorage("detailCrumbArray", array)
    }

    const changPage = (page) => {
        const workDetail = workList[page - 1]
        setWorkId(workDetail.id)
        setWorkIndex(page)
        setSessionStorage("detailCrumbArray", [{ id: workDetail.id, title: workDetail.title, iconUrl: workDetail.workTypeSys.iconUrl }])
    }

    const goWorkList = () => {
        setIsModalVisible(false)
        // if (props.match.path === "/index/projectDetail/:id/workDetail/:workId") {
        //     props.history.goBack()
        // }
        // if (props.match.path === "/index/projectDetail/:id/workone/:workId") {
        //     props.history.push(`/index/projectDetail/${projectId}/work`)
        // }
        // if (props.match.path === "/index/workDetail/:workId") {
        //     props.history.push(`/index/work/worklist`)
        // }
        // if (props.match.path === "/index/:id/sprintdetail/:sprint/workDetail/:workId") {
        //     props.history.push(`/index/${projectId}/sprintdetail/${sprintId}/workItem`)
        // }
    }

    return (
        <Skeleton loading={infoLoading} active>
            {
                workInfo ? <div className="work-detail">
                    <>
                        {
                            detailCrumbArray?.length > 0 &&
                            <div className="work-detail-crumb-col">
                                <div className="work-detail-crumb">
                                  
                                    {
                                        detailCrumbArray?.length > 0 && detailCrumbArray.map((item, index) => {
                                            let html;
                                            if (!isTableDetail && index === 0) {
                                                html = <div className="work-detail-crumb-item" key={item.id} onClick={() => goCrumWork(index, item.id)}>
                                                    <img
                                                        src={version === "cloud" ?
                                                            (upload_url + item.iconUrl + "?tenant=" + tenant)
                                                            :
                                                            (upload_url + item.iconUrl)
                                                        }
                                                        alt=""
                                                        className="img-icon"
                                                    />
                                                    <span className="work-detail-crumb-text">{item.id}</span>
                                                </div>
                                            } else {
                                                html = <div className="work-detail-crumb-item" key={item.id} onClick={() => goCrumWork(index, item.id)}>
                                                    <span style={{ padding: "0 10px" }}>/</span>
                                                    <img
                                                        src={(upload_url + item.iconUrl)}
                                                        alt=""
                                                        className="img-icon"
                                                    />
                                                    <span className="work-detail-crumb-text">{item.id}</span>
                                                </div>
                                            }
                                            return html

                                        })
                                    }
                                </div>
                                {
                                    workShowType !== "list" && <div className="work-detail-close" onClick={()=> setIsModalVisible(false)}>
                                        <svg className="svg-icon" aria-hidden="true">
                                            <use xlinkHref="#icon-close"></use>
                                        </svg>
                                    </div>
                                }
                                
                            </div>

                        }

                        <div className="work-detail-top" ref = {workDetailTop}>
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

                                        <PrivilegeProjectButton code={'WorkDelete'} disabled={"hidden"} domainId={projectId}  {...props}>
                                            <Button style={{ marginRight: "10px" }} onClick={deleteWork}>
                                                <svg className="svg-icon" aria-hidden="true">
                                                    <use xlinkHref="#icon-delete"></use>
                                                </svg>
                                                删除
                                            </Button>
                                        </PrivilegeProjectButton>
                                        <Dropdown overlay={menu} trigger={"click"} className="sf" getPopupContainer = {() => workDetailTop.current}>
                                            <Button className="botton-background">
                                                {workStatus}
                                                <svg className="svg-icon" aria-hidden="true">
                                                    <use xlinkHref="#icon-downdrop"></use>
                                                </svg>
                                            </Button>
                                        </Dropdown>
                                        <div className="more">
                                            <svg className="svg-icon" aria-hidden="true">
                                                <use xlinkHref="#icon-more"></use>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="work-item-title-bottom">
                                    <div className="work-item-info">
                                        <div className="work-item-info-item">
                                            <span className="work-item-info-title">类型: </span>
                                            <span>{workInfo?.workTypeSys?.name}</span>
                                        </div>
                                        <div className="work-item-info-item">
                                            <span className="work-item-info-title">ID: </span>
                                            <span>{workInfo?.id}</span>
                                        </div>
                                        <div className="work-item-info-item">
                                            <div className="work-item-info-title">进度: </div>
                                            <Form form={percentForm}>
                                                <Form.Item name="percent"
                                                    hasFeedback={showValidateStatus === "percent" ? true : false}
                                                    validateStatus={validateStatus}
                                                >
                                                    <InputNumber min={1} max={100}
                                                        // value={workInfo?.percent ? workInfo?.percent : 0}
                                                        value={percentValue}
                                                        defaultValue={percentValue}
                                                        onBlur={(value) => updateSingle(workInfo.id, { percent: value.target.value }, "percent")}
                                                        style={{
                                                            width: "50px",
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Form>

                                        </div>

                                        <div className="work-item-info-item">
                                            <div className="work-item-info-title">负责人: </div>
                                            <Form form={percentForm}>
                                                <Form.Item name="assigner"
                                                >
                                                    <Select
                                                        placeholder="无"
                                                        className="work-select"
                                                        key="selectWorkUser"
                                                        bordered={fieldName === "assigner" ? true : false}
                                                        showArrow={fieldName === "assigner" ? true : false}
                                                        onFocus={() => changeStyle("assigner")}
                                                        onBlur={() => changeStyle("")}
                                                        // value={assignerId}
                                                        onChange={(value) => updateSingle(workInfo.id, { assigner: value }, "assigner")}
                                                        getPopupContainer = {() => workDetailTop.current}
                                                        style={{
                                                            width: 150,
                                                        }}
                                                    >
                                                        {
                                                            userList && userList.map((item) => {
                                                                return <Select.Option value={item.user.id} key={item.id}><Space><UserIcon name={item.user?.nickname ? item.user?.nickname : item.user?.name} />{item.user?.nickname ? item.user?.nickname : item.user?.name}</Space></Select.Option>
                                                            })
                                                        }
                                                    </Select>

                                                </Form.Item>
                                            </Form>

                                        </div>
                                    </div>
                                    <>
                                        {
                                            showPage && <>
                                                {
                                                    detailCrumbArray?.length < 2 && <div className="page-simple">
                                                        {
                                                            workIndex === 1 ? <svg className="svg-icon" aria-hidden="true">
                                                                <use xlinkHref="#icon-pageLeftDisable"></use>
                                                            </svg>
                                                                :
                                                                <svg className="svg-icon" aria-hidden="true" onClick={() => changPage(workIndex - 1)}>
                                                                    <use xlinkHref="#icon-pageLeft"></use>
                                                                </svg>
                                                        }

                                                        <span>{workIndex} / {total}</span>
                                                        {
                                                            workIndex === total ? <svg className="svg-icon" aria-hidden="true">
                                                                <use xlinkHref="#icon-pageRightDisable"></use>
                                                            </svg>
                                                                :
                                                                <svg className="svg-icon" aria-hidden="true" onClick={() => changPage(workIndex + 1)}>
                                                                    <use xlinkHref="#icon-pageRight"></use>
                                                                </svg>
                                                        }
                                                    </div>
                                                }
                                            </>
                                        }
                                    </>


                                </div>
                            </div>
                        </div>
                    </>
                    <div className="work-detail-tab">
                        {workInfo && <WorkDetailBottom workInfo={workInfo} setWorkInfo={setWorkInfo} getWorkDetail={getWorkDetail} workDeatilForm={workDeatilForm} {...props} />}
                    </div>
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
