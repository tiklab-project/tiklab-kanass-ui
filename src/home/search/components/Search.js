/*
 * @Descripttion: 全局搜索框加弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { Fragment, useEffect, useRef, useState, useCallback } from "react";
import { SearchOutlined } from '@ant-design/icons';
import "../components/Search.scss";
import { Empty, Modal } from "antd";
import { observer, inject } from "mobx-react";
import { getUser } from "thoughtware-core-ui";
import SearchStore from "../store/Search";
import { useDebounce } from "../../../common/utils/debounce"
import WorkStore from '../../../work/store/WorkStore';
import { withRouter } from "react-router";
import { setSessionStorage } from "../../../common/utils/setSessionStorage";
import setImageUrl from "../../../common/utils/setImageUrl";

const Search = (props) => {
    const { isShowText } = props;
    const theme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "default";
    const { getSearchSore, setKeyWord, findRecentList,
        updateRecent, findWorkItemByKeyWorks, findProjectList, } = SearchStore;
    // 最近查看的项目列表
    const [projectList, setProjectList] = useState([]);
    const { setWorkId } = WorkStore;
    const [workItemList, setWorkItemList] = useState([]);
    const [isSeach, setIsSeach] = useState(false);

    const [keyboardIndex, setKeyboardIndex] = useState({ modal: "project", index: 0 });
    const [keyboards, setKeyboards] = useState();
    // 查找结果的弹窗是否显示
    const [show, setShow] = useState(false)
    const [showLong, setShowLong] = useState(false)
    // 登录者id
    // const userId = getUser().userId;
    const tenant = getUser().tenant;
    // 搜索下拉框ref
    const dropDown = useRef();
    const inputRef = useRef();
    const userId = getUser().userId;

    useEffect(() => {
        function keyBordar(e) {
            if (e.code === 'ArrowDown') {
                if (keyboardIndex.modal === "project" && keyboardIndex.index + 1 < projectList.length) {
                    setKeyboardIndex(keyboardIndex => ({ modal: keyboardIndex.modal, index: keyboardIndex.index + 1 }))
                    // setKeyboards(keyBordars => keyBordars + 1)
                }
                if (keyboardIndex.modal === "project" && keyboardIndex.index + 1 === projectList.length) {
                    setKeyboardIndex({ modal: "workItem", index: 0 })
                }
                if (keyboardIndex.modal === "workItem" && keyboardIndex.index + 1 < workItemList.length) {
                    setKeyboardIndex({ modal: "workItem", index: keyboardIndex.index + 1 })
                }

                if (keyboardIndex.modal === "workItem" && keyboardIndex.index + 1 === workItemList.length) {
                    setKeyboardIndex({ modal: "project", index: 0 })
                }
            }
            if (e.code === 'ArrowUp') {
                if (keyboardIndex.modal === "project" && keyboardIndex.index > 0) {
                    setKeyboardIndex({ modal: "project", index: keyboardIndex.index - 1 })
                }
                if (keyboardIndex.modal === "project" && keyboardIndex.index === 0) {
                    setKeyboardIndex({ modal: "workItem", index: workItemList.length - 1 })
                }
                if (keyboardIndex.modal === "workItem" && keyboardIndex.index > 0) {
                    setKeyboardIndex({ modal: "workItem", index: keyboardIndex.index - 1 })
                }

                if (keyboardIndex.modal === "workItem" && keyboardIndex.index === 0) {
                    setKeyboardIndex({ modal: "project", index: projectList.length - 1 })
                }
            }
            if (e.keyCode === 13) {
                if (isSeach) {
                    if (keyboardIndex.modal === "workItem") {
                        toSearchWorkItem(workItemList[keyboardIndex.index])

                    }

                    if (keyboardIndex.modal === "project") {
                        toSearchProject(projectList[keyboardIndex.index])
                    }
                } else {
                    if (keyboardIndex.modal === "workItem") {
                        toWorkItem(workItemList[keyboardIndex.index])

                    }

                    if (keyboardIndex.modal === "project") {
                        toProject(projectList[keyboardIndex.index])
                    }
                }

            }
        }

        window.addEventListener("keydown", keyBordar);
        if (!show) {
            window.removeEventListener("keydown", keyBordar);
        }
        return () => {
            window.removeEventListener("keydown", keyBordar);
        };
    }, [keyboardIndex, show])



    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);

        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [show])

    const closeModal = (e) => {
        if (!dropDown.current) {
            return;
        }
        if (!dropDown.current.contains(e.target) && dropDown.current !== e.target) {
            setShow(false)
        }
    }

    const findRecent = () => {
        let projectListLength = 0;
        findRecentList({ model: "project", masterId: userId }).then(res => {
            if (res.code === 0) {
                projectListLength = res.data.length
                if (projectListLength > 5) {
                    setProjectList(res.data.slice(0, 5))
                } else {
                    setProjectList(res.data)
                }
                if (projectListLength > 0) {
                    setKeyboardIndex({ modal: "project", index: 0 })
                }
            }
        })
        findRecentList({ model: "workItem", masterId: userId }).then(res => {
            if (res.data.length > 5) {
                setWorkItemList(res.data.slice(0, 5))
            } else {
                setWorkItemList(res.data)
            }
            // if (projectListLength <= 0 && res.data.length > 0) {
            //     setKeyboardIndex({ modal: "workItem", index: 0 })
            // }
        })


    }

    const searchByKeyWork = (value) => {
        let projectListLength = 0;
        findProjectList({ projectName: value }).then(res => {
            if (res.code === 0) {
                projectListLength = res.data.length;
                if (res.data && projectListLength > 0) {
                    setProjectList(res.data)
                } else {
                    setProjectList([])
                }
                if (projectListLength > 0) {
                    setKeyboardIndex({ modal: "project", index: 0 })
                }
            }
        })

        findWorkItemByKeyWorks({ title: value }).then(res => {
            if (res.code === 0) {
                setWorkItemList(res.data.dataList)
            }
            if (projectListLength <= 0 && res.data.dataList.length > 0) {
                setKeyboardIndex({ modal: "workItem", index: 0 })
            }
        })
    }



    /**
     * 改变查找关键字时候，重新搜索
     * @param {查找关键字} value 
     */
    const changeValue = (value) => {
        setShow(true)
        search(value.target.value)

    }

    // 防抖
    const search = useDebounce((value) => {
        if (value) {
            searchByKeyWork(value)
            setIsSeach(true)
        } else {
            findRecent()
            setIsSeach(false)
        }

        setShow(true)
    }, 500)
    /**
     * 跳转到项目详情
     * @param {项目id} id 
     */
    const toProject = async (data) => {
        // 创建最近访问的信息
        updateRecent({ id: data.modelId })
        props.history.replace(`/projectDetail/${data.modelId}/workTable`)
        // location.reload();
        // 存储用于被点击菜单的回显
        sessionStorage.setItem("menuKey", "project")
        setShow(false)

    }


    const toSearchProject = async (data) => {
        // 创建最近访问的信息
        props.history.replace(`/projectDetail/${data.id}/workTable`)
        // 存储用于被点击菜单的回显
        sessionStorage.setItem("menuKey", "project")
        setShow(false)

    }
    /**
     * 跳转到事项详情
     * @param {事项id} id 
     * @param {项目id} pid 
     */

    // 有bug
    const toWorkItem = (data) => {
        updateRecent({ id: data.id })
        setWorkId(data.modelId)
        props.history.push(`/projectDetail/${data.project.id}/work/${data.modelId}`)
        setSessionStorage("detailCrumbArray", [{ id: data.modelId, code: data.code, title: data.name, iconUrl: data.iconUrl }])
        sessionStorage.setItem("menuKey", "project")
        setShow(false)

    }

    // 有bug
    const toSearchWorkItem = (data) => {
        updateRecent({ id: data.id })
        setWorkId(data.id)
        props.history.push(`/projectDetail/${data.project.id}/work/${data.id}`)
        setSessionStorage("detailCrumbArray", [{ id: data.id, code: data.code, title: data.title, iconUrl: data.workTypeSys?.iconUrl }])
        sessionStorage.setItem("menuKey", "project")
        setShow(false)

    }
    /**
     * 点击回车跳转到结果页面
     * @param {键盘值} value 
     */
    // const submit = (value) => {
    //     if (value.keyCode === 13) {
    //         getSearchSore(value.target.value)
    //         setKeyWord(value.target.value)
    //         props.history.push(`/searchResult`)
    //         setShow(false)
    //     }
    // }


    /**
     * 显示结果弹窗
     */
    const showBox = () => {
        const keyWord = inputRef.current.value;
        if (keyWord) {
            searchByKeyWork(keyWord)
            setIsSeach(true)
        } else {
            findRecent()
            setIsSeach(false)
        }
        setShow(true)
    }

    return (
        <Fragment>
            {
                isShowText ?
                    <div className="search-text first-menu-text-item">
                        <svg className="icon-15" aria-hidden="true">
                            <use xlinkHref={`${theme === "default" ? "#icon-searchtop" : "#icon-searchtop-white"}`} ></use>
                        </svg>
                        <div>搜索</div>
                    </div>

                    :
                    <div className="first-menu-link-item" data-title-right="搜索">
                        <svg className="icon-15" aria-hidden="true">
                            <use xlinkHref={`${theme === "default" ? "#icon-searchtop" : "#icon-searchtop-white"}`} ></use>
                        </svg>
                    </div>

            }
            <Modal
                title={"搜索"}
                visible={false}
                cancelText="取消"
                okText="确定"
                closable={false}
                width={800}
            >
                <div className={`show-box ${show === true ? null : "hidden-box"}`}>
                    {
                        isSeach ? <>
                            {
                                (projectList?.length !== 0 || workItemList?.length !== 0) ? <Fragment>
                                    {
                                        projectList.length > 0 && <div className="sort-box">
                                            <div className="sort-title">项目</div>
                                            {
                                                projectList.map((item, index) => {
                                                    return <div className={`item-box ${(keyboardIndex.modal === "project" && keyboardIndex.index === index) ? "keyboard-select" : ""}`} key={item.id} >
                                                        <div className="item-one" onClick={() => toSearchProject(item)}>
                                                            <img
                                                                alt=""
                                                                src={setImageUrl(item.iconUrl)}
                                                            />
                                                            <span>{item.projectName}</span>
                                                            <div className="item-desc">
                                                                {item.projectType?.name}
                                                            </div>
                                                        </div>


                                                    </div>
                                                })
                                            }
                                        </div>
                                    }

                                    {
                                        workItemList.length > 0 && <div className="sort-box">
                                            <div className="sort-title">事项</div>
                                            {
                                                workItemList.map((item, index) => {
                                                    return <div className={`item-box ${(keyboardIndex.modal === "workItem" && keyboardIndex.index === index) ? "keyboard-select" : ""}`} key={item.id}>
                                                        <div className="item-one" onClick={() => toSearchWorkItem(item)}>
                                                            <img
                                                                alt=""
                                                                src={setImageUrl(item.workTypeSys?.iconUrl)}
                                                            />
                                                            <span>{item.title}</span>
                                                            <div className="item-desc">
                                                                {item.project?.projectName}
                                                            </div>
                                                        </div>

                                                    </div>
                                                })
                                            }
                                        </div>
                                    }

                                </Fragment>
                                    :
                                    <Empty image="/images/nodata.png" description="暂时没有数据~" />
                            }
                        </>
                            :
                            <Fragment>
                                <div className="sort-box">
                                    <div className="sort-title">最近查看项目</div>
                                    {
                                        projectList.length > 0 ?
                                            <>
                                                {
                                                    projectList.map((item, index) => {
                                                        return <div className={`item-box ${(keyboardIndex.modal === "project" && keyboardIndex.index === index) ? "keyboard-select" : ""}`} key={item.id}>
                                                            <div className="item-one" onClick={() => toProject(item)}>
                                                                <img
                                                                    alt=""
                                                                    src={setImageUrl(item.iconUrl)}
                                                                />
                                                                <span>{item.name}</span>
                                                                <div className="item-desc">
                                                                    {item.recentTime}
                                                                </div>
                                                            </div>


                                                        </div>
                                                    })
                                                }
                                            </>

                                            :
                                            <Empty image="/images/nodata.png" description="暂时没有数据~" />
                                    }
                                </div>
                                <div className="sort-box">
                                    <div className="sort-title">最近查看事项</div>
                                    {
                                        workItemList.length > 0 ? <>
                                            {
                                                workItemList.map((item, index) => {
                                                    return <div className={`item-box ${(keyboardIndex.modal === "workItem" && keyboardIndex.index === index) ? "keyboard-select" : ""}`} key={item.id}>
                                                        <div className="item-one" onClick={() => toWorkItem(item)}>
                                                            <img
                                                                alt=""
                                                                src={setImageUrl(item.iconUrl)}
                                                            />
                                                            <span>{item.name}</span>
                                                            <div className="item-desc">
                                                                {item.project?.projectName}
                                                            </div>
                                                        </div>

                                                    </div>
                                                })
                                            }
                                        </>
                                            :
                                            <Empty image="/images/nodata.png" description="暂时没有数据~" />
                                    }
                                </div>
                            </Fragment>
                    }

                </div>
            </Modal>

        </Fragment>
    )
}
export default withRouter(inject("homeStore")(observer(Search)));