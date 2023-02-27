import React, { useState, useRef } from 'react';
import { Drawer, Tabs, Badge, Avatar, } from 'antd';
import { observer, inject } from "mobx-react";
import { MessageOutlined, DownOutlined } from '@ant-design/icons';
import "./MessageList.scss"
import { withRouter } from 'react-router';
import { useEffect } from 'react';


const MessageList = (props) => {
    const todoMessageList = useRef()

    const { homeStore } = props;
    const [placement, setPlacement] = useState('left');
    const { findMessageDispatchItemPage, messageTotal, messageList, isMessageReachBottom, updateMessageDispatchItem } = homeStore;
    const [currenTab, setCurrentTab] = useState("0")
    const [currentPage, setCurrentPage] = useState(0)
    const [unReadMessage, setUnReadMessage] = useState(0)
    const [open, setOpen] = useState(false);
    const messageRef = useRef()

    useEffect(() => {
        if (open) {
            findMessageDispatchItemPage({ page: 1, status: currenTab })
        }
        findMessageDispatchItemPage({ page: 1, status: "0" }).then(res => {
            if(res.code === 0) {
                setUnReadMessage(res.data.totalRecord)
            }
        })
    }, [open])

    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    },[])

    const closeModal = (e) => {
        if (!messageRef.current) {
            return;
        }
        if (!messageRef.current.contains(e.target) && messageRef.current !== e.target) {
            setOpen(false)
        }
    }


    const changePage = () => {
        const current = currentPage + 1
        setCurrentPage(current)
        findMessageDispatchItemPage({ page: current, status: currenTab })
    }


    const onClose = () => {
        setOpen(false);
    };
    const onChange = (e) => {
        // setPlacement(e.target.value);
        setCurrentTab(e)
        findMessageDispatchItemPage({ page: 1, status: e })

    };

    const goToWork = (id) => {
        props.history.push(`/index/work/workone/${id}`)
        setOpen(false)
    }

    const goToMessage = (link,id) => {
        // props.history.push(link)
        
        const value = {
            id: id,
            status: "1"
        }
        updateMessageDispatchItem(value)
        window.location.href = link
    }
    return (
        <div ref = {messageRef}>
            <a className="frame-header-language" data-title="消息提示" onClick={() => setOpen(true)}>
                <Badge count={unReadMessage} size="small">
                    <Avatar
                        size="small" style={{ background: "transparent", fontSize: "22px" }} icon={<MessageOutlined style={{ color: "#fff" }} />} />
                </Badge>
            </a>
            <Drawer
                title="消息"
                placement={"right"}
                closable={true}
                onClose={onClose}
                visible={open}
                key={placement}
                className="frame-header-drawer"
                mask={false}
                destroyOnClose={true}
                width={375}
                getContainer = {false}
            >
                <div className="message-content">
                    <Tabs onChange={onChange} size = "small" activeKey = {currenTab}>
                        <Tabs.TabPane tab="未读" key="0">
                            <div className="message-box" ref={todoMessageList}>
                                {
                                    messageList && messageList.length > 0 && messageList.map(item => {
                                        return <div className="message-list" key={item.id} >
                                            <div
                                                dangerouslySetInnerHTML={{ __html: item.content }}
                                                onClick = {() => goToMessage(item.link,item.id)}
                                                style={{flex: 1}}
                                            />
                                            <div className={`message-status ${item.status === 0 ? "status-unread" : "status-read"}`}></div>
                                        </div>
                                    })
                                }
                                {
                                    messageTotal > 1 && 
                                        (isMessageReachBottom ? 
                                            <div className="message-list-bottom" onClick={() => changePage()}>点击加载更多</div> : <div className="message-list-bottom">第{currentPage}页/总{messageTotal}页</div>)
                                }
                                
                            </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="已读" key="1">
                            <div className="message-box" ref={todoMessageList}>
                                {
                                    messageList && messageList.length > 0 && messageList.map(item => {
                                        return <div className="message-list" key={item.id} >
                                            <div
                                                dangerouslySetInnerHTML={{ __html: item.content }}
                                                className = "message-item"
                                                style={{flex: 1}}
                                                onClick = {() => goToMessage(item.link,item.id)}
                                            />
                                            <div className={`message-status ${item.status === 1 ? "status-read" : "status-unread"}`}></div>
                                        </div>
                                    })
                                }
                                { messageTotal > 1 && 
                                    (isMessageReachBottom ? 
                                        <div className="message-list-bottom" onClick={() => changePage()}>点击加载更多</div> : <div className="message-list-bottom">第{currentPage}页/总{messageTotal}页</div>)}
                            </div>
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </Drawer>
        </div>
    );
};
export default withRouter(inject('homeStore')(observer(MessageList)));
