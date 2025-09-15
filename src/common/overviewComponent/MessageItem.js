/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 14:08:20
 * @Description: 消息列表项
 */

import React from "react";
import "./MessageItem.scss"
import { withRouter } from "react-router";

const MessageListItem = (props) => {
    const { content, status, type, updateMessageDispatchItem, id, item, currenTab, setUnReadMessage, findMessageDispatchItemPage } = props;
    const data = JSON.parse(content)
    const { createUserIcon, createUser, workItemTitle, receiveTime, workItemId,
        projectId, projectSetId, oldValue, newValue, sprintName, sprintId, projectName, projectSetName, creater, fieldName, comment,
        appraisedId, appraisedName, productId, productName} = data;

    const updateMessage = () => {
        if (status === 0) {
            const value = {
                id: id,
                status: "1"
            }
            updateMessageDispatchItem(value).then(res => {
                if (res.code === 0) {
                    
                    if(item.status === 0){
                        item.status === 1
                        findMessageDispatchItemPage({ page: 1, status: "0" }).then(res => {
                            if(res.code === 0) {
                                setUnReadMessage(res.data.totalRecord)
                            }
                        })
                    }
                }
            })
        }
    }
    const goMessageDetail = () => {
        props.history.push(`/project/${projectId}/work/${workItemId}`);
        updateMessage()
    }

    const goSprintDetail = () => {
        props.history.push(`/${projectId}/sprint/${sprintId}/overview`);
        // if (status === 0) {
        //     const value = {
        //         id: id,
        //         status: "1"
        //     }
        //     updateMessageDispatchItem(value).then(res => {
        //         if (res.code === 0) {
        //             item.status === 1
        //         }
        //     })
        // }
        updateMessage()
    }

    const goProjectDetail = () => {
        props.history.push(`/project/${projectId}/workitem`);
        // if (status === 0) {
        //     const value = {
        //         id: id,
        //         status: "1"
        //     }
        //     updateMessageDispatchItem(value).then(res => {
        //         if (res.code === 0) {
        //             item.status === 1
        //         }
        //     })
        // }
        updateMessage()
    }

    const goProjectSetDetail = () => {
        props.history.push(`/projectSet/${projectSetId}/project`);
        updateMessage()
    }

    const goAppraisedDetail = () => {
        props.history.push(`/project/${projectId}/appraised/${appraisedId}`);
        updateMessage()
    }

    const goProductDetail = () => {
        props.history.push(`/product/${productId}/project`);
        // if (status === 0) {
        //     const value = {
        //         id: id,
        //         status: "1"
        //     }
        //     updateMessageDispatchItem(value).then(res => {
        //         if (res.code === 0) {
        //             item.status === 1
        //         }
        //     })
        // }
        updateMessage()
    }

    const setDom = () => {
        let dom = null;
        switch (type) {
            case "KANASS_MESSAGETYPE_UPDATESTATUS":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{createUser.nickname}修改了事项状态</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goMessageDetail()}>{workItemTitle}</div>
                                    <div
                                        className="message-work-oldvalue"
                                    >
                                        {oldValue}
                                    </div>
                                    ———
                                    <div
                                        className="message-work-newValue">
                                        {newValue}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_TASKTODO":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{createUser.nickname}给你分配了事项</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goMessageDetail()}>{workItemTitle}</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_SPRINTCREATE":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{createUser.nickname}创建了迭代</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goSprintDetail()}>{sprintName}</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_SPRINTUPDATE":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{createUser.nickname}修改了迭代状态</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goSprintDetail()}>{sprintName}</div>
                                    <div
                                        className="message-work-oldvalue"
                                    >
                                        {oldValue}
                                    </div>
                                    ———
                                    <div
                                        className="message-work-newValue">
                                        {newValue}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_JOINPROJECT":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{createUser.nickname}邀请你进入项目</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goProjectDetail()}>{projectName}</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_JOINPROSET":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{createUser.nickname}邀请你进入项目集</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goProjectSetDetail()}>{projectSetName}</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_PROJECT_UPDATESTATUS":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{creater}修改了项目状态</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goProjectDetail()}>{projectName}</div>
                                    <div
                                        className="message-work-oldvalue"
                                    >
                                        {oldValue}
                                    </div>
                                    ———
                                    <div
                                        className="message-work-newValue">
                                        {newValue}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_PROJECT_ADDUSER":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{creater}邀请你进入项目</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goProjectDetail()}>{projectName}</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_PROJECT_DELETE":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{creater}删除了项目</div>
                                <div className="message-work-item">
                                    <div className="message-work-title">{projectName}</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_PROJECT_CREATE":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{creater} 创建了项目</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goProjectDetail()}>{projectName}</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_PROJECT_UPDATE":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{creater} 编辑了项目</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goProjectDetail()}>{projectName}</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_WORKITEM_CREATE":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{creater}给你分配了事项</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goMessageDetail()}>{workItemTitle}</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_WORKITEM_UPDATE":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{creater}更新了事项</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goMessageDetail()}>{workItemTitle}  {fieldName}信息</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_WORKITEM_DELETE":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{creater}删除了事项</div>
                                <div className="message-work-item">
                                    <div className="message-work-title">{workItemTitle}</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_WORKITEM_UPDATESTATUS":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{creater}修改了事项状态</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goMessageDetail()}>{workItemTitle}</div>
                                    <div
                                        className="message-work-oldvalue"
                                    >
                                        {oldValue}
                                    </div>
                                    ———
                                    <div
                                        className="message-work-newValue">
                                        {newValue}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_WORKITEM_COMMENT":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{creater}创建了 {workItemTitle} 的评论</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goMessageDetail()}>{comment}</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_APPRAISED_CREATE":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{creater}给你分配了评审</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goAppraisedDetail()}>{appraisedName}</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_APPRAISED_UPDATE":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{creater}修改了评审</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goAppraisedDetail()}>{appraisedName}</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_PROJECTSET_DELETE":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{creater}删除了项目集</div>
                                <div className="message-work-item">
                                    <div className="message-work-title">{projectSetName}</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_PROJECTSET_CREATE":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{creater} 创建了项目集</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goProjectSetDetail()}>{projectSetName}</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_PROJECTSET_UPDATE":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{creater} 编辑了项目集</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goProjectSetDetail()}>{projectSetName}</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_PRODUCT_DELETE":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{creater}删除了产品</div>
                                <div className="message-work-item">
                                    <div className="message-work-title">{productName}</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_PRODUCT_CREATE":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{creater} 创建了产品</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goProductDetail()}>{productName}</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_MESSAGETYPE_PRODUCT_UPDATE":
                dom = (
                    <div className="message-list-item" >
                        <div className="message-list-item-left">
                            <div className="message-user-icon">{createUserIcon}</div>
                            <div className="message-content">
                                <div className="message-work-action">{creater} 编辑了产品</div>
                                <div className="message-work-item">
                                    <div className="message-work-title" onClick={() => goProductDetail()}>{productName}</div>
                                </div>

                            </div>
                        </div>
                        <div className="message-time">{receiveTime} </div>
                    </div >
                )
                break;
        }
        return dom;
    }
    return (<>
        {
            setDom()
        }

    </>

    )
}

export default withRouter(MessageListItem);