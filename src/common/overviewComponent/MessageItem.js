import React from "react";
import "./MessageItem.scss"
import { withRouter } from "react-router";
const MessageListItem = (props) => {
    const { content, status, type, updateMessageDispatchItem, id, item, currenTab, setUnReadMessage, findMessageDispatchItemPage } = props;
    const data = JSON.parse(content)
    const { createUserIcon, createUser, workItemTitle, receiveTime, workItemId,
        projectId, projectSetId, oldValue, newValue, sprintName, sprintId, projectName, projectSetName } = data;

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
        props.history.push(`/projectDetail/${projectId}/work/${workItemId}`);
        updateMessage()
    }

    const goSprintDetail = () => {
        props.history.push(`/${projectId}/sprintdetail/${sprintId}/workTable`);
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
        props.history.push(`/projectDetail/${projectId}/workTable`);
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
        props.history.push(`/projectSetdetail/${projectSetId}/projectSetProjectList`);
        if (status === 0) {
            const value = {
                id: id,
                status: "1"
            }
            updateMessageDispatchItem(value).then(res => {
                if (res.code === 0) {
                    item.status === 1
                }
            })
        }
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