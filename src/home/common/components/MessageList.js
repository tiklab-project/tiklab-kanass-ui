/*
 * @Descripttion: 消息抽屉
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */
import React, { useState, useRef } from 'react';
import { Drawer, Tabs, Badge, Avatar, } from 'antd';
import { observer, inject } from "mobx-react";
import { MessageOutlined } from '@ant-design/icons';
import "./MessageList.scss"
import { withRouter } from 'react-router';
import { useEffect } from 'react';


const MessageList = (props) => {
    const { homeStore } = props;
    const { findMessageDispatchItemPage, messageTotal, messageList, isMessageReachBottom, updateMessageDispatchItem } = homeStore;
    // 当前的tab的key
    const [currenTab, setCurrentTab] = useState("0")
    // 当前的页数
    const [currentPage, setCurrentPage] = useState(0)
    // 未读消息条数，显示在图标上
    const [unReadMessage, setUnReadMessage] = useState(0)
    //抽屉的打开与关闭
    const [open, setOpen] = useState(false);
    // 消息的ref 
    const messageRef = useRef()

    /**
     * 获取消息列表
     */
    useEffect(() => {
        if (open) {
            findMessageDispatchItemPage({ page: 1, status: currenTab })
        }
        findMessageDispatchItemPage({ page: 1, status: "0" }).then(res => {
            if(res.code === 0) {
                setUnReadMessage(res.data.totalRecord)
            }
        })
        return;
    }, [open])

     /**
     * 挂载监听点击事件
     */
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
        
    },[])
    
    /**
     * 点击抽屉之外的地方关闭抽屉
     * @param {抽屉dom} e 
     * @returns 
     */
    const closeModal = (e) => {
        if (!messageRef.current) {
            return;
        }
        if (!messageRef.current.contains(e.target) && messageRef.current !== e.target) {
            setOpen(false)
        }
    }

    /**
     * 翻页
     */
    const changePage = () => {
        const current = currentPage + 1
        setCurrentPage(current)
        findMessageDispatchItemPage({ page: current, status: currenTab })
    }

    /**
     * 关闭抽屉
     */
    const onClose = () => {
        setOpen(false);
    };

    /**
     * tab 切换
     * @param {tab key} e 
     */
    const changTab = (e) => {
        // setPlacement(e.target.value);
        setCurrentTab(e)
        findMessageDispatchItemPage({ page: 1, status: e })

    };

    /**
     * 查看消息详情
     * @param {跳转地址} link 
     * @param {改变消息为已读} id 
     */
    const goToMessage = (link,id) => {
        const value = {
            id: id,
            status: "1"
        }
        updateMessageDispatchItem(value)
        window.location.href = link
    }
    
    return (
        <div ref = {messageRef}>
            <div className="frame-header-message" data-title-bottom="消息提示" onClick={() => setOpen(true)}>
                <Badge count={unReadMessage} size="small">
                    <Avatar
                        size="small" style={{ background: "transparent", fontSize: "22px" }} icon={<MessageOutlined style={{ color: "#fff" }} />} />
                </Badge>
            </div>
            <Drawer
                title="消息"
                placement={"right"}
                closable={true}
                onClose={onClose}
                visible={open}
                key={"left"}
                className="frame-header-drawer"
                mask={false}
                destroyOnClose={true}
                width={375}
                getContainer = {false}
            >
                <div className="message-content">
                    <Tabs onChange={changTab} size = "small" activeKey = {currenTab}>
                        <Tabs.TabPane tab="未读" key="0">
                            <div className="message-box">
                                {
                                    messageList && messageList.length > 0 && messageList.map(item => {
                                        return <div className="message-list" key={item.id} >
                                            <div
                                                dangerouslySetInnerHTML={{ __html: item.content }}
                                                onClick = {() => goToMessage(item.link,item.id)}
                                                style={{flex: 1,width: "314px"}}
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
                            <div className="message-box">
                                {
                                    messageList && messageList.length > 0 && messageList.map(item => {
                                        return <div className="message-list" key={item.id} >
                                            <div
                                                dangerouslySetInnerHTML={{ __html: item.content }}
                                                className = "message-item"
                                                style={{flex: 1, width: "314px"}}
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
