import React, { useEffect, useState, useRef, Fragment } from "react";
import {observer} from "mobx-react";
import {Button, Drawer, Dropdown, Form, message, Modal} from "antd";
// import WorkBasicInfo from "./WorkBasicInfoDefect";
import workStore from "../workItemDefectAdd/WorkStore";
import WorkBasicInfo from "./WorkBasicInfoDefect";
import "./WorkDetail.scss";
import {DownOutlined, SwapRightOutlined,CloseOutlined} from "@ant-design/icons";

const WorkDetailDrawer = (props) => {
    const {workItemId,name,projectId,findPage} = props

    const {findWorkItemDetailMetaData,findTransitionList,editWork} = workStore

    const [visible, setVisible] = useState(false);
    const [workInfo, setWorkInfo] = useState({});
    const [workDetailMetaData, setWorkDetailMetaData] = useState({});
    const [transitionList, setTransitionList] = useState([]);
    const [transitionLoading, setTransitionLoading] = useState(false);


    const [detailForm] = Form.useForm();



    const showModal =async () => {
        let res = await findWorkItemDetailMetaData(workItemId)
        if(res.code === 0){
            setWorkDetailMetaData(res.data)
            let workInfo = res.data.workItem

            setWorkInfo(workInfo)
            await getTransitionList(workInfo?.workStatusNode?.id, workInfo?.workType?.flow?.id)

            setVisible(true);
        }else {
            message.error("查询失败")
        }

    };

    const hideModal = () => {
        setVisible(false);
    };


    /**
     * 获取状态转换列表
     * @param fromNodeId
     * @param flowId
     */
    const getTransitionList =async (fromNodeId, flowId)=>{
        setTransitionLoading(true);
        try {
            const params = {
                fromNodeId: fromNodeId,
                flowId: flowId,
                domainId: workItemId
            }
            let res = await findTransitionList(params)
            if(res.code === 0){
                setTransitionList(res.data || [])
            } else {
                message.error('获取状态转换列表失败');
                setTransitionList([])
            }
        } catch (error) {
            console.error('获取状态转换列表出错:', error);
            message.error('获取状态转换列表失败');
            setTransitionList([])
        } finally {
            setTransitionLoading(false);
        }
    }


    const menu = (
        <div className="work-flow-transition">
            {transitionLoading ? (
                <div className="work-flow-loading">
                    <span>加载中...</span>
                </div>
            ) : transitionList.length > 0 ? (
                transitionList.map(item => {
                    return (
                        <div
                            className="work-flow-item"
                            key={item.id}
                            onClick={() => changeStatus(item)}
                        >
                            <span className="work-flow-name">{item.name}</span>
                            <SwapRightOutlined className="work-flow-arrow" />
                            <span className="work-flow-text">{item.toNode.name}</span>
                        </div>
                    )
                })
            ) : (
                <div className="work-flow-empty">
                    <span>暂无可用转换</span>
                </div>
            )}
        </div>
    );


    /**
     * 处理状态转换点击
     * @param {转换项} transition
     */
    const changeStatus = (transition) => {
        Modal.confirm({
            title: "修改之后不能撤回，确认修改状态？",
            className: "edit-status-modal",
            // getContainer: workDetailTop.current,
            onOk: () => {
                const value = {
                    updateField: "workStatusNode",
                    workStatusNode: transition?.toNode?.id,
                    transitionId: transition.id,
                    flowId: transition.flow.id,
                    id: workItemId
                }
                editWork(value).then((res) => {
                    if (res.code === 0) {
                        findWorkItemDetailMetaData(workItemId).then((res) => {

                            if (res.code===0) {
                                let workItemInfo = res.data.workItem
                                setWorkInfo(workItemInfo)
                                getTransitionList(workItemInfo.workStatusNode.id, workItemInfo.workType.flow.id)
                                findPage&&findPage()
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


    return (
        <Fragment>
            <span className={"link-text"} onClick={showModal}>{name}</span>
            <Drawer
                title="缺陷信息"
                visible={visible}
                placement="right"
                onClose={hideModal}
                width={800}
                className={"work-item-drawer"}
            >
                <div className={"workItem-header-action"}>
                    <div className="header-row">
                        <div className="title">缺陷信息</div>
                        <CloseOutlined className="close-btn" onClick={hideModal} />
                    </div>
                    <div className="content-row">
                        <div className="code">{workInfo?.code}</div>

                        <Dropdown
                            overlay={menu}
                            trigger={"click"}
                            placement="bottomRight"
                            // getPopupContainer={() => formRef.current}
                            disabled={transitionLoading}
                        >
                            <Button
                                className="botton-background work-status-dropdown"
                                style={{marginRight: "10px"}}
                                loading={transitionLoading}
                            >
                                <div className={"project-dashed"}>{workInfo?.workStatusNode?.name || '未知状态'}</div>
                                <DownOutlined/>
                            </Button>
                        </Dropdown>
                    </div>
                </div>


                <WorkBasicInfo
                    workId={workItemId}
                    workInfo={workInfo}
                    setWorkInfo={setWorkInfo}
                    workStore={workStore}
                    projectId={projectId}
                    workDetailMetaData={workDetailMetaData}
                    detailForm={detailForm}
                    findPage={findPage}
                />
            </Drawer>
        </Fragment>
    )
};


export default observer(WorkDetailDrawer);
