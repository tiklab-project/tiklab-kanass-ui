import React, { Fragment, useEffect, useState } from "react";
import { SearchOutlined } from '@ant-design/icons';
import "../components/Search.scss"
import project from "../../../assets/images/project.png"

import { observer, inject } from "mobx-react";
import { getUser } from "tiklab-core-ui";

const Search = (props) => {
    const { searchStore, workStore, homeStore } = props;
    const { getSearch, searchList, getSearchSore, setKeyWord } = searchStore;
    const { setWorkId } = workStore;
    const { statProjectWorkItem, statWorkItemProcess } = homeStore;
    const [projectList, setProjectList] = useState();
    const [workItemProcessList, setWorkItemProcessList] = useState();

    const userId = getUser().userId;

    useEffect(() => {
        statProjectWorkItem(userId).then((res) => {
            if (res.code === 0 && res.data.length > 0) {
                setProjectList(res.data)
            }
        })

        statWorkItemProcess({pageSize: 1}).then((res) => {
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

    // 输入中
    const changeValue = (value) => {
        console.log(searchList, show)
        setShow("show")
        getSearch(value.target.value)

    }


    const [show, setShow] = useState("hidden")
    const toProject = async (id) => {
        localStorage.setItem("projectId", id)
        await props.history.push("/index/prodetail/survey")
        setShow("hidden")

    }
    const toWorkItem = async (id, pid) => {
        setWorkId(id)
        localStorage.setItem("projectId", pid)
        await props.history.push("/index/prodetail/work")
        setShow("hidden")
        // location.reload();

    }

    const submit = (value) => {
        if (value.keyCode === 13) {
            getSearchSore(value.target.value)
            setKeyWord(value.target.value)
            props.history.push(`/index/searchResult`)
            setShow("hidden")
        }
    }
    const hiddenBox = () => {
        setShow("hidden")
    }
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
                                                return <div className="project-item" key={item.project.id}>
                                                    <div className="project-item-img">
                                                        <img src={`/images/${item.project.projectType.iconUrl}`} alt="" className="img-icon"/>
                                                        {item.project.projectName}
                                                    </div>
                                                    <div className="project-type">
                                                        {item.project.projectType.name}
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
export default inject("searchStore", "workStore", "homeStore")(observer(Search));