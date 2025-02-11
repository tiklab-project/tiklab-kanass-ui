/*
 * @Descripttion: 全局搜索框加弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 11:34:04
 */

import React, { Fragment, useEffect, useRef, useState } from "react";
import "../components/Search.scss";
import { Modal, Spin } from "antd";
import { observer, inject } from "mobx-react";
import { getUser } from "tiklab-core-ui";
import SearchStore from "../store/Search";
import { useDebounce } from "../../../common/utils/debounce"
import WorkStore from '../../../work/store/WorkStore';
import { withRouter } from "react-router";
import { setSessionStorage } from "../../../common/utils/setSessionStorage";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import ProjectEmpty from "../../../common/component/ProjectEmpty";

const Search = (props) => {
    const { isShowText, theme } = props;
    const { findRecentList,updateRecent, findWorkItemByKeyWorks, findProjectList, } = SearchStore;
    // 最近查看的项目列表
    const [projectList, setProjectList] = useState([]);
    const { setWorkId } = WorkStore;
    const [workItemList, setWorkItemList] = useState([]);
    const [isSeach, setIsSeach] = useState(false);

    const [keyboardIndex, setKeyboardIndex] = useState({ modal: "project", index: 0 });
    const [searchModal, setSearchModal] = useState(false);
    // 登录者id
    // 搜索下拉框ref
    const searchBox = useRef();
    const userId = getUser().userId;
    const [recentWorkLoading, setRecentWorkLoading] = useState(true)
    const [recentProjectLoading, setRecentProjectLoading] = useState(true)

    useEffect(() => {
        function keyBordar(e) {
            if (e.code === 'ArrowDown') {
                if (keyboardIndex.modal === "project" && keyboardIndex.index + 1 < projectList.length) {
                    setKeyboardIndex(keyboardIndex => ({ modal: keyboardIndex.modal, index: keyboardIndex.index + 1 }))
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
        if (!searchModal) {
            window.removeEventListener("keydown", keyBordar);
        }
        return () => {
            window.removeEventListener("keydown", keyBordar);
        };
    }, [keyboardIndex, searchModal])



    const findRecent = () => {
        let projectListLength = 0;
        setProjectList([])
        setWorkItemList([])
        setRecentWorkLoading(true)
        setRecentProjectLoading(true)
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
                setRecentProjectLoading(false)
            }
        })
        findRecentList({ model: "workItem", masterId: userId }).then(res => {
            if (res.data.length > 5) {
                setWorkItemList(res.data.slice(0, 5))
            } else {
                setWorkItemList(res.data)
            }
            setRecentWorkLoading(false)
        })


    }
    useEffect(() => {
        if (searchModal) {
            findRecent()
        }
        return null;
    }, [searchModal])

    const searchByKeyWork = (value) => {
        let projectListLength = 0;
        setProjectList([])
        setWorkItemList([])
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


    // 防抖
    const search = useDebounce((value) => {
        if (value) {
            searchByKeyWork(value)
            setIsSeach(true)
        } else {
            findRecent()
            setIsSeach(false)
        }

    }, 500)
    /**
     * 跳转到项目详情
     * @param {项目id} id 
     */
    const toProject = async (data) => {
        // 创建最近访问的信息
        updateRecent({ id: data.id })
        props.history.replace(`/project/${data.id}/workitem`)
        // location.reload();
        // 存储用于被点击菜单的回显
        sessionStorage.setItem("menuKey", "project")

    }


    const toSearchProject = async (data) => {
        // 创建最近访问的信息
        props.history.replace(`/project/${data.id}/workitem`)
        // 存储用于被点击菜单的回显
        sessionStorage.setItem("menuKey", "project")
    }
    /**
     * 跳转到事项详情
     * @param {事项id} id 
     * @param {项目id} pid 
     */

    // 有bug
    const toWorkItem = (data) => {
        updateRecent({ id: data.id })
        setWorkId(data.id)
        props.history.push(`/project/${data.project.id}/work/${data.id}`)
        setSessionStorage("detailCrumbArray", [{ id: data.id, code: data.code, title: data.name, iconUrl: data.iconUrl }])
        sessionStorage.setItem("menuKey", "project")

    }

    // 有bug
    const toSearchWorkItem = (data) => {
        updateRecent({ id: data.id })
        setWorkId(data.id)
        props.history.push(`/project/${data.project.id}/work/${data.id}`)
        setSessionStorage("detailCrumbArray", [{ id: data.id, code: data.code, title: data.title, iconUrl: data.workTypeSys?.iconUrl }])
        sessionStorage.setItem("menuKey", "project")

    }



    const changeValue = (value) => {
        search(value.target.value)

    }

    const showSearchModal = () => {
        setSearchModal(true)
        
    }
    return (
        <div>
            {
                isShowText ?
                    <div className="search-text first-menu-text-item" onClick={() => showSearchModal()}>
                        <svg className="icon-18" aria-hidden="true">
                            <use xlinkHref={`#icon-search-${theme}`} ></use>
                        </svg>
                        <div>搜索</div>
                    </div>

                    :
                    <div className="first-menu-link-item" onClick={() => showSearchModal()}>
                        <svg className="icon-18" aria-hidden="true">
                            <use xlinkHref={`#icon-search-${theme}`} ></use>
                        </svg>
                        <div>搜索</div>
                    </div>

            }
            <div ref={searchBox}>
                <Modal
                    visible={searchModal}
                    cancelText="取消"
                    onOk={() => setSearchModal(false)}
                    onCancel={() => setSearchModal(false)}
                    okText="确定"
                    width={800}
                    footer={null}
                    className="search-modal"
                    getContainer={() => searchBox.current}
                    closable={false}
                >
                    <div className={`show-box `}>
                        <div className="search-input-box">

                            <svg className="icon-20" aria-hidden="true">
                                <use xlinkHref="#icon-search-default" ></use>
                            </svg>
                            <input
                                className={`search-input`}
                                onChange={changeValue}
                                // onFocus={showBox}
                                // ref={inputRef}
                                placeholder="搜索事项，项目"

                            />
                            <svg className="svg-icon close-icon" aria-hidden="true" onClick={() => setSearchModal(false)}>
                                <use xlinkHref="#icon-close"></use>
                            </svg>
                        </div>
                        {
                            isSeach ? <div className="search-result-box">
                                {
                                    (projectList?.length !== 0 || workItemList?.length !== 0) ? <Fragment>
                                        {
                                            projectList.length > 0 && <div className="sort-box">
                                                <div className="sort-title">项目</div>
                                                {
                                                    projectList.map((item, index) => {
                                                        return <div className={`item-box ${(keyboardIndex.modal === "project" && keyboardIndex.index === index) ? "keyboard-select" : ""}`} key={item.id} >
                                                            <div className="item-one" onClick={() => toSearchProject(item)}>

                                                                <ImgComponent
                                                                    src={item.iconUrl}
                                                                    alt=""
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

                                                                <ImgComponent
                                                                    src={item.workTypeSys?.iconUrl}
                                                                    alt=""
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
                                        <ProjectEmpty description="暂时没有数据~" />
                                }
                            </div>
                                :
                                <div className="search-result-box">
                                    <div className="sort-box">
                                        <div className="sort-title">最近查看项目</div>
                                        <Spin wrapperClassName = "search-spin" spinning={recentProjectLoading} tip="加载中..." >
                                            {
                                                projectList.length > 0 ?
                                                    <>
                                                        {
                                                            projectList.map((item, index) => {
                                                                return <div className={`item-box ${(keyboardIndex.modal === "project" && keyboardIndex.index === index) ? "keyboard-select" : ""}`} key={item.id}>
                                                                    <div className="item-one" onClick={() => toProject(item.object)}>

                                                                        <ImgComponent
                                                                            src={item.object?.iconUrl}
                                                                            alt=""
                                                                        />
                                                                        <span>{item.object?.projectName}</span>
                                                                        <div className="item-desc">
                                                                            {item.recentTime}
                                                                        </div>
                                                                    </div>


                                                                </div>
                                                            })
                                                        }
                                                    </>

                                                    :
                                                    <>
                                                        {
                                                            !recentProjectLoading && <ProjectEmpty description="暂时没有数据~" />
                                                        }
                                                    </>

                                            }
                                        </Spin>

                                    </div>
                                    <div className="sort-box">
                                        <div className="sort-title">最近查看事项</div>
                                        <Spin wrapperClassName = "search-spin" spinning={recentWorkLoading} tip="加载中..." >

                                            {
                                                workItemList.length > 0 ? <>
                                                    {
                                                        workItemList.map((item, index) => {
                                                            return <div className={`item-box ${(keyboardIndex.modal === "workItem" && keyboardIndex.index === index) ? "keyboard-select" : ""}`} key={item.id}>
                                                                <div className="item-one" onClick={() => toWorkItem(item.object)}>
                                                                    <ImgComponent
                                                                        src={item.object?.workTypeSys.iconUrl}
                                                                        alt=""
                                                                    />
                                                                    <span>{item.object?.title}</span>
                                                                    <div className="item-desc">
                                                                        {item.object?.project?.projectName}
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        })
                                                    }
                                                </>
                                                    :
                                                    <>
                                                        {
                                                            !recentWorkLoading && <ProjectEmpty description="暂时没有数据~" />
                                                        }
                                                    </>

                                            }
                                        </Spin>

                                    </div>
                                </div>
                        }

                    </div>
                </Modal>
            </div>


        </div>
    )
}
export default withRouter(inject("homeStore")(observer(Search)));