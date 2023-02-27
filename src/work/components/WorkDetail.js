/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-13 11:20:23
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 14:26:52
 */
import React, { useEffect, useState, useRef, Fragment } from "react";
import { Form, Space, Empty, Dropdown, Row, Col, Select, InputNumber, Pagination } from "antd";
// import "../../common/components/projectDetail.scss";
import { observer, inject } from "mobx-react";
import 'moment/locale/zh-cn';
import WorkDetailBottom from "./WorkDetailBottom";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import { getUser } from 'tiklab-core-ui'
import "./WorkDetail.scss";
import Button from "../../common/button/Button";
import { Profile } from "tiklab-eam-ui";

const WorkDetail = (props) => {
    const [percentForm] = Form.useForm();
    const { workStore, setIsWorkList } = props;
    const { workList, setWorkId, defaultCurrent, setDefaultCurrent, statesList, detWork, workShowType,
        getWorkConditionPageTree, getWorkConditionPage, total, workId, editWork,
        setWorkIndex, getWorkBoardList, findToNodeList, getWorkTypeList, getModuleList,
        getsprintlist, getSelectUserList, findPriority, workIndex, viewType, userList, searchWorkById,
        alertText, setAlertText, isShowAlert, setIsShowAlert, createRecent, detailCrumbArray,
        setDetailCrumbArray
    } = workStore;
    const projectId = props.match.params.id;
    const workDeatilForm = useRef()
    const inputRef = useRef()
    const [workInfo, setWorkInfo] = useState();
    const [workStatus, setWorkStatus] = useState("nostatus")
    const userId = getUser().userId;
    const [percentValue, setPercentValue] = useState(0)
    const [assignerId, setAssignerId] = useState()
    const [isFocus, setIsFocus] = useState()
    const path = props.match.path.split("/")[2];
    const [isTableDetail, setIsTableDetail] = useState(false)

    const getWorkDetail = (id, index) => {
        searchWorkById(id, index).then((res) => {
            if (res) {
                setWorkInfo(res)
                setStatusList(res.workStatus.id);
                setWorkStatus(res.workStatusNode.name ? res.workStatusNode.name : "nostatus")
                setAssignerId(res.assigner?.id)
                percentForm.setFieldsValue({ percent: res.percent, assigner: res.assigner?.id })
                // setWorkTypeCode(res.workType.code)
            }
        })
    }

    useEffect(() => {
        const pathUrl = props.match.path;
        // if (pathUrl === "/index/:id/sprintdetail/:sprint/workItem" || pathUrl === "/index/projectScrumDetail/:id/work" ||
        //     pathUrl === "/index/work/worklist" || pathUrl === "/index/projectNomalDetail/:id/work"
        // ) {
        //     setIsTableDetail(true)
        // }
        setWorkInfo()
        if (workId && workId.length > 0) {
            getWorkTypeList({ projectId: projectId });
            getModuleList(projectId)
            getsprintlist(projectId)
            getSelectUserList(projectId);
            findPriority()
            getWorkDetail(workId, workIndex)

        }
        if (workId === 0) {
            setWorkInfo(null)
        }
        console.log(workId)
        return
    }, [workId]);

    const setStatusList = (id) => {
        findStatusList(id);
    }


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
                        getWorkDetail(res.dataList[0].id, defaultCurrent);
                    } else {
                        getWorkDetail(res.dataList[defaultCurrent - 1].id, defaultCurrent);
                    }
                })
            } else if ((workShowType === "list" || workShowType === "table") && viewType === "tile") {
                getWorkConditionPage().then((res) => {
                    if (total === defaultCurrent) {
                        getWorkDetail(res.dataList[0].id, defaultCurrent);
                    } else {
                        getWorkDetail(res.dataList[defaultCurrent - 1].id, defaultCurrent);
                    }
                })
            }
        })
    }

    const changeStatus = (statusId, name) => {
        const value = {
            updateField: "workStatusNode",
            workStatusNode: statusId,
            flowId: workInfo.workType.flow.id,
            // workStatusCode: nodeStatus,
            id: workId
        }
        editWork(value).then((res) => {
            if (res.code === 0) {
                setWorkStatus(name)
                searchWorkById(workId).then((res) => {
                    if (res) {
                        setStatusList(res.workStatus.id)
                    }
                })
            }
        })
    }

    const findStatusList = (stateId) => {
        let params = {
            nodeId: stateId
        }
        findToNodeList(params)
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
            params["parentWorkItem"] = workInfo.parentWorkItem.id
        }

        if (inputRef.current.textContent !== workInfo.title) {
            editWork(params).then(res => {
                if (res.code === 0) {
                    document.getElementById(workId).innerHTML = inputRef.current.textContent;
                    workInfo.title = inputRef.current.textContent;

                }
            })
        }
        inputRef.current.blur()
        setIsFocus(false)
    }

    const updateByClick = (event) => {
        event.stopPropagation();
        event.preventDefault()
        updateTitle()

    }
    const updateNameByKey = (event) => {

        if (event.keyCode === 13) {
            event.stopPropagation();
            event.preventDefault()
            updateTitle()
        }

    }
    const cancelUpdate = (event) => {
        event.stopPropagation();
        event.preventDefault()
        setIsFocus(false)
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
                setAssignerId(updateData.assigner)
            }

            if (res.code === 0) {
                setValidateStatus("success")
                setAlertText("保存成功！")
                // assignerId()
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
                statesList && statesList.map(item => {
                    return <div className="work-flow-item" key={item.id} onClick={() => changeStatus(item.id, item.name)}>{item.name}</div>
                })
            }
            <div className="work-flow-view" onClick={() => props.history.push(`/index/${path}/${projectId}/projectSetDetail/projectFlowDetail/${workInfo?.workStatus?.flow.id}`)}>查看工作流</div>

        </div>

    );
    const goCrumWork = (index, id) => {
        setWorkId(id)
        console.log(index)
        const array = detailCrumbArray.slice(0, index + 1)

        console.log(array)
        setDetailCrumbArray(array)
        console.log(detailCrumbArray)
    }

    const changPage = (page) => {
        console.log(page, workList)
        const workDetail = workList[page - 1]
        setWorkId(workDetail.id)
        setWorkIndex(page)
        setDetailCrumbArray([{ id: workDetail.id, title: workDetail.title, iconUrl: workDetail.workTypeSys.iconUrl }])
    }


    return (
        <>
            {
                workInfo ? <div className="work-detail">
                    <>
                        {
                            (workShowType === "table" || detailCrumbArray?.length > 0) && <div className="work-detail-crumb">
                                {
                                    workShowType === "table" && <div className="work-detail-crumb-item"  onClick={() => setIsWorkList(true)}>事项
                                        <svg className="img-icon" aria-hidden="true" style={{marginLeft: "5px"}}>
                                            <use xlinkHref="#icon-rightBlue"></use>
                                        </svg>
                                    </div>
                                }
                                {
                                    detailCrumbArray?.length > 0 && detailCrumbArray.map((item, index) => {
                                        let html;
                                        if (!isTableDetail && index === 0) {
                                            html = <div className="work-detail-crumb-item" key={item.id} onClick={() => goCrumWork(index, item.id)}>
                                                <img
                                                    src={('images/' + item.iconUrl)}
                                                    alt=""
                                                    className="img-icon"
                                                />
                                                <span>
                                                    {item.id}
                                                </span>
                                            </div>
                                        } else {
                                            html = <div className="work-detail-crumb-item" key={item.id} onClick={() => goCrumWork(index, item.id)}>
                                                <svg className="img-icon" aria-hidden="true">
                                                    <use xlinkHref="#icon-rightBlue"></use>
                                                </svg>
                                                <img
                                                    src={('images/' + item.iconUrl)}
                                                    alt=""
                                                    className="img-icon"
                                                />
                                                <span>
                                                    {item.id}
                                                </span>
                                            </div>
                                        }
                                        return html

                                    })
                                }
                            </div>
                        }

                        <div className="work-detail-top">
                            {/* {
                        workInfo?.workTypeSys.iconUrl ?
                            <img
                                src={('images/' + workInfo?.workTypeSys?.iconUrl)}
                                alt=""
                                className="list-img "
                            />
                            :
                            <img
                                src={('images/workType1.png')}
                                alt=""
                                className="list-img"
                            />
                    } */}

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
                                        {
                                            workInfo?.builder?.id === userId || (workInfo?.reporter && workInfo?.reporter?.id === userId) ? <Dropdown overlay={menu} trigger={"click"} className="sf">
                                                <Button className="botton-background">
                                                    {workStatus}
                                                    <svg className="svg-icon" aria-hidden="true">
                                                        <use xlinkHref="#icon-downdrop"></use>
                                                    </svg>
                                                </Button>
                                            </Dropdown> : <Dropdown overlay={menu} trigger={"click"} className="sf">
                                                <Button className="botton-background">
                                                    {workStatus}
                                                    <svg className="svg-icon" aria-hidden="true">
                                                        <use xlinkHref="#icon-downdrop"></use>
                                                    </svg>
                                                </Button>
                                            </Dropdown>
                                        }
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
                                            <span>{workInfo?.workTypeSys.name}</span>
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
                                                        style={{
                                                            width: 150,
                                                        }}
                                                    >
                                                        {
                                                            userList && userList.map((item) => {
                                                                return <Select.Option value={item.user.id} key={item.id}><Space><Profile />{item.user.name}</Space></Select.Option>
                                                            })
                                                        }
                                                    </Select>

                                                </Form.Item>
                                            </Form>

                                        </div>
                                    </div>
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

                                </div>
                            </div>
                        </div>
                    </>
                    <div className="work-detail-tab">
                        {workInfo && <WorkDetailBottom workInfo={workInfo} getWorkDetail={getWorkDetail} workDeatilForm={workDeatilForm} {...props} />}
                    </div>
                </div>
                    :
                    <div style={{ marginTop: "200px" }}>
                        <Empty image="/images/nodata.png" description="暂时没有事项~" />
                    </div>

            }
        </>

    )
};
export default inject("systemRoleStore", "workStore", "workChild")(observer(WorkDetail));
