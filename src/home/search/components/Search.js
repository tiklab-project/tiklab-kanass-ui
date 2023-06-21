/*
 * @Descripttion: 全局搜索框加弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { Fragment, useEffect, useState } from "react";
import { SearchOutlined } from '@ant-design/icons';
import "../components/Search.scss"
import project from "../../../assets/images/project.png"

import { observer, inject } from "mobx-react";
import { getUser } from "tiklab-core-ui";
import SearchStore from "../store/Search";
const Search = (props) => {
    const { getSearch, searchList, getSearchSore, setKeyWord, statProjectWorkItem, statTodoWorkItem  } = SearchStore;
    // 最近查看的项目列表
    const [projectList, setProjectList] = useState();
    // 待办事项列表
    const [workItemProcessList, setWorkItemProcessList] = useState();
    // 查找结果的弹窗是否显示
    const [show, setShow] = useState("hidden")
    // 登录者id
    const userId = getUser().userId;

    useEffect(() => {
        // 获取最近查看的项目列表
        statProjectWorkItem(userId).then((res) => {
            if (res.code === 0 && res.data.length > 0) {
                setProjectList(res.data)
            }
        })

        // 获取待办事项列表
        statTodoWorkItem({pageSize: 1}).then((res) => {
            if (res.code === 0) {
                if (res.data.length > 5) {
                    setWorkItemProcessList(res.data.dataList.slice(0, 5))
                } else {
                    setWorkItemProcessList(res.data.dataList)
                }

            }
        })

        return
    }, [])

    /**
     * 改变查找关键字时候，重新搜索
     * @param {查找关键字} value 
     */
    const changeValue = (value) => {
        console.log(searchList, show)
        setShow("show")
        getSearch(value.target.value)

    }

    /**
     * 跳转到项目详情
     * @param {项目id} id 
     */
    const toProject = async (id) => {
        localStorage.setItem("projectId", id)
        await props.history.push("/index/prodetail/survey")
        setShow("hidden")

    }  

    /**
     * 跳转到事项详情
     * @param {事项id} id 
     * @param {项目id} pid 
     */
    const toWorkItem = async (id, projectId) => {
        // setWorkId(id)
        localStorage.setItem("projectId", projectId)
        await props.history.push("/index/prodetail/work")
        setShow("hidden")
        // location.reload();

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
            setShow("hidden")
        }
    }

    /**
     * 隐藏结果弹窗
     */
    const hiddenBox = () => {
        setShow("hidden")
    }

    /**
     * 显示结果弹窗
     */
    const showBox = () => {
        setShow("show")
    }
    return (
        <Fragment>
            <div className="search"
                tabIndex="-1"
                onFocus={showBox}
                onBlur={hiddenBox}
            >
                <div className="search-box" >
                    <SearchOutlined />
                    <input
                        className="search-input"
                        onChange={changeValue}
                        onKeyDown={submit}
                        placeholder = "搜索项目、事项"
                    />
                </div>
                <div className={`show-box ${(show === "show") ?  null : "hidden-box" }`}>
                    {
                        searchList && searchList.length !== 0 ? searchList.map((item, index) => {
                            return (
                                <div className="sort-box" key={index}>
                                    {
                                        (() => {
                                            switch (item.index) {
                                                case "Project":
                                                    return <div className="sort-title">项目</div>;
                                                case "WorkItem":
                                                    return <div className="sort-title">事项</div>;
                                            }
                                        })()
                                    }
                                    {
                                        item.dataList && item.dataList.map((toItem) => {
                                            return <div className="item-box" key={toItem.id}>
                                                {
                                                    (() => {
                                                        switch (item.index) {
                                                            case "Project":
                                                                return <div className="item-one" onClick={() => toProject(toItem.id)}>
                                                                    <img src={project} alt="" className="img-icon" />
                                                                    <span>{toItem.projectName}</span>
                                                                </div>;
                                                            case "WorkItem":
                                                                return <div className="item-one" onClick={() => toWorkItem(toItem.id, toItem.project.id)}>
                                                                    <img src={project} alt=""  className="img-icon"/>
                                                                    <span>{toItem.title}</span>
                                                                </div>;
                                                        }
                                                    })()
                                                }
                                            </div>
                                        })
                                    }
                                </div>)
                        })
                            :
                            <div className="recent-box">
                                <div className="recent-work">
                                    <div className="recent-work-title">最近查看的事务</div>
                                    <div className="recent-work-list">
                                        {
                                            workItemProcessList && workItemProcessList.map(item => {
                                                return <div className="work-item" key = {item.id}>
                                                    <div className="work-item-img">
                                                        <img src={`/images/project1.png`} alt="" className="img-icon"/>
                                                        {item.title}
                                                    </div>
                                                    <div className="work-item-project" >
                                                        项目1
                                                    </div>
                                                    <div className="work-item-status">
                                                        {item.remark}
                                                    </div>
                                                </div>
                                            })
                                        }

                                    </div>
                                </div>
                                <div className="recent-project">
                                    <div className="recent-project-title">最近查看的项目</div>
                                    <div className="recent-project-list">
                                        {
                                            projectList && projectList.map(item => {
                                                return <div className="project-item" key={item?.project?.id}>
                                                    <div className="project-item-img">
                                                        <img src={`/images/${item?.project?.projectType.iconUrl}`} alt="" className="img-icon"/>
                                                        {item?.project?.projectName}
                                                    </div>
                                                    <div className="project-type">
                                                        {item?.project?.projectType.name}
                                                    </div>
                                                </div>
                                            })
                                        }

                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </Fragment>
    )
}
export default inject( "homeStore")(observer(Search));