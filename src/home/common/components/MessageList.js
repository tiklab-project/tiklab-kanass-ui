/*
 * @Descripttion: 消息抽屉
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */
import React, { useState, useRef } from 'react';
import { Drawer, Tabs, Badge, Avatar, Empty, } from 'antd';
import { observer, inject } from "mobx-react";
import "./MessageList.scss"
import { withRouter } from 'react-router';
import { useEffect } from 'react';
import MessageItem from '../../../common/overviewComponent/MessageItem';


const MessageList = (props) => {
    const { homeStore, isShowText, theme } = props;
    // const theme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "default";
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
    const messageDrawerRef = useRef()
    /**
     * 获取消息列表
     */
    useEffect(() => {
        if (open) {
            findMessageDispatchItemPage({ page: 1, status: currenTab })
        }
        findMessageDispatchItemPage({ page: 1, status: "0" }).then(res => {
            if (res.code === 0) {
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

    }, [])

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
    const goToMessage = (link, id) => {
        const value = {
            id: id,
            status: "1"
        }
        updateMessageDispatchItem(value)
        window.location.href = link
    }

    return (
        <div className="message-box" ref={messageRef}>
            {
                isShowText ?
                    <div className="message-text first-menu-text-item" onClick={() => setOpen(true)}>
                        <svg className="icon-15" aria-hidden="true">
                            <use xlinkHref={`#icon-message-${theme}`} ></use>
                        </svg>
                        <div className="message-text-name">消息</div>
                        <div className="message-text-count">
                            {unReadMessage}
                        </div>
                    </div>
                    :
                    <div className="message-icon first-menu-link-item" data-title-right="消息" onClick={() => setOpen(true)}>
                        {/* <Badge count={unReadMessage} size="small">
                            <Avatar
                                size="small" style={{ fontSize: "20px" }} icon={ <svg className="icon-15" aria-hidden="true">
                                    <use xlinkHref={`${theme === "default" ? "#icon-message": "#icon-message-white"}`} ></use>
                                </svg>} />
                        </Badge> */}
                        <svg className="icon-15" aria-hidden="true">
                            <use  xlinkHref={`#icon-message-${theme}`}></use>
                        </svg>
                    </div>
            }
            <Drawer
                title="消息"
                placement={"left"}
                closable={true}
                onClose={onClose}
                visible={open}
                key={"left"}
                className={`message-drawer ${isShowText ? "message-drawer-expend" : "message-drawer-inpend"} `}
                mask={false}
                destroyOnClose={true}
                width={450}
            >
                <div className="message-content">
                    <Tabs onChange={changTab} size="small" activeKey={currenTab}>
                        <Tabs.TabPane tab="未读" key="0">
                            <div className="message-box">
                                {
                                    (messageList && messageList.length > 0) ? messageList.map(item => {
                                        return <div className="message-list" key={item.id} >
                                            {/* <div
                                                dangerouslySetInnerHTML={{ __html: item.content }}
                                                onClick = {() => goToMessage(item.link,item.id)}
                                                style={{flex: 1,width: "314px"}}
                                            /> */}
                                            <MessageItem
                                                id={item.id}
                                                content={item.data}
                                                type={item.messageType.id}
                                                status={item.status}
                                                item={item}
                                                updateMessageDispatchItem={updateMessageDispatchItem}
                                                currenTab={currenTab}
                                                setUnReadMessage={setUnReadMessage}
                                                findMessageDispatchItemPage={findMessageDispatchItemPage}
                                            />
                                            <div className={`message-status ${item.status === 0 ? "status-unread" : "status-read"}`}></div>
                                        </div>
                                    })
                                        :
                                        <Empty image="/images/nodata.png" description="没有新消息~" />
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
                                    (messageList && messageList.length > 0) ? messageList.map(item => {
                                        return <div className="message-list" key={item.id} >
                                            {/* <div
                                                dangerouslySetInnerHTML={{ __html: item.content }}
                                                className = "message-item"
                                                style={{flex: 1, width: "314px"}}
                                                onClick = {() => goToMessage(item.link,item.id)}
                                            /> */}
                                            <MessageItem
                                                id={item.id}
                                                content={item.data}
                                                type={item.messageType.id}
                                                status={item.status}
                                                updateMessageDispatchItem={updateMessageDispatchItem}
                                                item={item}
                                                currenTab={currenTab}
                                                setUnReadMessage={setUnReadMessage}
                                                findMessageDispatchItemPage={findMessageDispatchItemPage}
                                            />
                                            <div className={`message-status ${item.status === 1 ? "status-read" : "status-unread"}`}></div>
                                        </div>
                                    })
                                        :
                                        <Empty image="/images/nodata.png" description="没有消息~" />
                                }
                                {messageTotal > 1 &&
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
