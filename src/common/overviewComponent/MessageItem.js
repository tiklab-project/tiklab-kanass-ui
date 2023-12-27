import React from "react";
import "./MessageItem.scss"
import { withRouter } from "react-router";
const MessageListItem = (props) => {
    const { content, status, type, updateMessageDispatchItem, id, item } = props;
    const data = JSON.parse(content)
    const { createUserIcon, createUser, workItemTitle, receiveTime, workItemId,
        projectId, oldValue, newValue, spintName } = data;
    const goMessageDetail = () => {
        props.history.push(`/projectDetail/${projectId}/work/${workItemId}`);
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
                                    <div className="message-work-title" onClick={() => goMessageDetail()}>{spintName}</div>
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