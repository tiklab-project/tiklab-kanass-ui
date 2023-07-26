/*
 * @Descripttion: 全局搜索框加弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { Fragment, useEffect, useRef, useState } from "react";
import { SearchOutlined } from '@ant-design/icons';
import "../components/Search.scss"
import project from "../../../assets/images/project.png"
import { Empty } from "antd";
import { observer, inject } from "mobx-react";
import { getUser } from "tiklab-core-ui";
import SearchStore from "../store/Search";
import { useDebounce, useThrottle } from "../../../common/utils/debounce"
import WorkStore from '../../../work/store/WorkStore';
const Search = (props) => {
    const { getSearch, searchList, getSearchSore, setKeyWord, findRecentList, 
        updateRecent, findWorkItemByKeyWorks, findProjectList } = SearchStore;
    // 最近查看的项目列表
    const [projectList, setProjectList] = useState([]);
    const { setWorkId, setDetailCrumbArray, searchWorkById, setIsWorkList } = WorkStore;
    const [workItemList, setWorkItemList] = useState([]);
    const [isSeach, setIsSeach] = useState(false);
    // 待办事项列表
    const [workItemProcessList, setWorkItemProcessList] = useState();
    // 查找结果的弹窗是否显示
    const [show, setShow] = useState(false)
    // 登录者id
    const userId = getUser().userId;
    const tenant = getUser().tenant;
    // 搜索下拉框ref
    const dropDown = useRef();
    const inputRef = useRef();

    useEffect(() => {
        findRecent()
        return
    }, [])

    const findRecent = () => {
        findRecentList({ model: "project" }).then(res => {
            if (res.code === 0) {
                
                setProjectList(res.data)
            }
        })

        findRecentList({ model: "workItem" }).then(res => {
            if (res.code === 0) {
                setWorkItemList(res.data)
            }
        })

    }

    const searchByKeyWork = (value) =>{
        findWorkItemByKeyWorks({title: value}).then(res => {
            if (res.code === 0) {
                setWorkItemList(res.data.dataList)
                console.log(res.data.dataList)
            }
        })
        findProjectList({projectName: value}).then(res => {
            if (res.code === 0) {
                if(res.data && res.data.length > 0){
                    setProjectList(res.data)
                }
            }
        })
    }
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
        props.history.push(`/index/projectDetail/${data.modelId}/survey`)
        // 存储用于被点击菜单的回显
        sessionStorage.setItem("menuKey", "project")
        setShow(false)

    }


    const toSearchProject = async (data) => {
        // 创建最近访问的信息
        props.history.push(`/index/projectDetail/${data.id}/survey`)
        // 存储用于被点击菜单的回显
        sessionStorage.setItem("menuKey", "project")
        setShow(false)

    }
    /**
     * 跳转到事项详情
     * @param {事项id} id 
     * @param {项目id} pid 
     */
    const toWorkItem = (data) => {
        updateRecent({ id: data.id })
        setWorkId(data.modelId)
        setDetailCrumbArray([{ id: data.modelId, title: data.name, iconUrl: data.iconUrl }])
        setIsWorkList(false)
        props.history.push(`/index/projectDetail/${data.project.id}/workDetail/${data.modelId}`)
        sessionStorage.setItem("menuKey", "project")
        setShow(false)

    }

    const toSearchWorkItem = (data) => {
        updateRecent({ id: data.id })
        setWorkId(data.id)
        setDetailCrumbArray([{ id: data.id, title: data.title, iconUrl: data.workTypeSys.iconUrl }])
        setIsWorkList(false)
        props.history.push(`/index/projectDetail/${data.project.id}/workDetail/${data.id}`)
        sessionStorage.setItem("menuKey", "project")
        setShow(false)

    }
    /**
     * 点击回车跳转到结果页面
     * @param {键盘值} value 
     */
    const submit = (value) => {
        if (value.keyCode === 13) {
            getSearchSore(value.target.value)
            setKeyWord(value.target.value)
            props.history.push(`/index/searchResult`)
            setShow(false)
        }
    }



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
            <div className="search"
                tabIndex="-1"

                ref={dropDown}
            // onBlur={hiddenBox}
            >
                <div className={`search-box ${(show === true) ? "search-long-box" : "search-short-box"}`} >
                    <SearchOutlined />
                    <input
                        className="search-input"
                        onChange={changeValue}
                        onKeyDown={submit}
                        onFocus={showBox}
                        ref = {inputRef}
                        placeholder="搜索项目、事项"
                    />
                </div>
                <div className={`show-box ${show === true ? null : "hidden-box"}`}>
                    {
                        isSeach ? <>
                            {
                                (projectList?.length !== 0 || workItemList?.length !== 0) ? <Fragment>
                                    {
                                        projectList.length > 0 && <div className="sort-box">
                                            <div className="sort-title">项目</div>
                                            {
                                                projectList.map((item) => {
                                                    return <div className="item-box" key={item.id}>
                                                        <div className="item-one" onClick={() => toSearchProject(item)}>
                                                            <img
                                                                src={version === "cloud" ? (base_url + item.iconUrl + "?tenant=" + tenant) : (base_url + item.iconUrl)}
                                                                alt=""
                                                            />
                                                            <span>{item.projectName}</span>
                                                            <div className="item-desc">
                                                                {item.projectType.name}
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
                                                workItemList.map((item) => {
                                                    return <div className="item-box" key={item.id}>
                                                        <div className="item-one" onClick={() => toSearchWorkItem(item)}>
                                                        <img
                                                                src={version === "cloud" ? (base_url + item.workTypeSys?.iconUrl + "?tenant=" + tenant) : (base_url + item.workTypeSys?.iconUrl)}
                                                                alt=""
                                                            />
                                                            <span>{item.title}</span>
                                                            <div className="item-desc">
                                                                {item.project.projectName}
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
                                                    projectList.map((item) => {
                                                        return <div className="item-box" key={item.id}>
                                                            <div className="item-one" onClick={() => toProject(item)}>
                                                                <img
                                                                    src={version === "cloud" ? (base_url + item.iconUrl + "?tenant=" + tenant) : (base_url + item.iconUrl)}
                                                                    alt=""
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
                                                workItemList.map((item) => {
                                                    return <div className="item-box" key={item.id}>
                                                        <div className="item-one" onClick={() => toWorkItem(item)}>
                                                        <img
                                                                src={version === "cloud" ? (base_url + item.iconUrl + "?tenant=" + tenant) : (base_url + item.iconUrl)}
                                                                alt=""
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
            </div>
        </Fragment>
    )
}
export default inject("homeStore")(observer(Search));