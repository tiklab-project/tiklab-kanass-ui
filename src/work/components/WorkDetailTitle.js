import {observer} from "mobx-react";
import {Dropdown, message, Modal} from "antd";
import Button from "../../common/button/Button";
import WorkPrivilegeComponent from "./WorkPrivilegeComponent";
import WorkDeleteSelectModal from "./WorkDeleteSelectModal";
import React, {useRef, useState} from "react";
import {setWorkTitle} from "./WorkArrayChange";
import {changeWorkItemList} from "./WorkGetList";
import {getSessionStorage, setSessionStorage} from "../../common/utils/setSessionStorage";
import {SwapRightOutlined} from "@ant-design/icons";

const WorkDetailTitle = (props) => {
    const { workInfo, workStore, detailForm, delectCurrentWorkItem } = props

    const { workList, setWorkList, setWorkId, workShowType, workId, editWork,
        setWorkIndex, getWorkTypeList, getModuleList, findSprintList, getSelectUserList,
        findPriority, searchWorkById, findTransitionList, findWorkItemRelationModelCount,
        findSelectVersionList, haveChildren, findStageList, findWorkItemRoleFunctionDmCode, permissionFieldList,
        findWorkItemDetailMetaData, userList, priorityList, stageList, sprintList
    } = workStore;
    const [isFocus, setIsFocus] = useState();
    const [workStatus, setWorkStatus] = useState(workInfo.workStatusNode.name ? workInfo.workStatusNode.name : "nostatus")
    const workDetailTop = useRef();
    const inputRef = useRef()
    const [transformList, setTransformList] = useState([])

    const isPermissionField = (code) => {
        const isEdit = permissionFieldList.indexOf(code) > -1 ? true : false;
        return isEdit;
    }

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

    return (
        <div className="work-detail-top" ref={workDetailTop} >
            <div className="work-detail-top-name">
                <div className="work-item-title-top">
                    <div className={"work-item-title-top-info"}>
                        {/*<ImgComponent*/}
                        {/*    src={workInfo?.workTypeSys.iconUrl}*/}
                        {/*    alt=""*/}
                        {/*    className="img-icon-right"*/}
                        {/*/>*/}
                        {/*<span className={"work-item-code"}>{workInfo.code}</span>*/}
                        <div className={"title-top-info-content"}>
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
                            <div className={"work-item-code"}>
                                {workInfo.builder.nickname} 创建于 {workInfo.buildTime.slice(0,19)}
                            </div>
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
    )
};

export default observer(WorkDetailTitle);