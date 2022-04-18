import React, { useRef, useEffect, useState } from "react";
import { Breadcrumb, Input, Pagination, Space, Button, Divider, Layout, Row, Col } from 'antd';
import SprintAddmodal from "../components/spintAdd";
import { observer, inject } from "mobx-react";
import { PrivilegeProjectButton } from "doublekit-privilege-ui";
import "../components/sprint.scss";
import { getUser } from "doublekit-core-ui";
import { withRouter } from "react-router";
const { Search } = Input;


// @observer
const Sprint = (props) => {
    const [loading, setLoading] = useState(false);
    const [sprintName, setSprintName] = "";
    const projectId = localStorage.getItem("projectId")
    const { sprintStore } = props;
    const { findAllSprintState, getSprint, setSprintPageParam, totalRecord, sprintPageParams,
        addsprintlist, uselist, getUseList, sprintStateList, sprintlist, delesprintList } = sprintStore;
    const masterId = getUser().userId
    /**
     * 点击别处隐藏输入框
     */
    document.addEventListener("click", (e) => {
        setInputShow(false)
    });

    useEffect(() => {
        console.log(props)
        if(props.match.params && props.match.params.id){
            findSprintList({ projectId: null,master: masterId});
        }else {
            findSprintList({ projectId: projectId,master: null });
        }
        
        findAllSprintState();
        return;
    }, [])

    const findSprintList = (value) => {
        setLoading(true)
        getSprint(value).then((res) => {
            setLoading(false)
        })
    }

    /**
     * 规划迭代
     */
    const sprintPlan = () => {
        props.history.push("/index/prodetail/sprintPlan")
    }
    const goSprintDetail = (id) => {
        props.history.push({ pathname: "/index/prodetail/sprintdetail" })
        localStorage.setItem("sprintId", id);
    }

    const handleTableChange = (pagination) => {
        console.log(pagination)
        findSprintList({
            pageParam: {
                pageSize: 10,
                currentPage: pagination
            }
        });
    }

    const onSearch = (values) => {
        findSprintList({ sprintName: values })
    }

    const [inputShow, setInputShow] = useState(false)
    const sprintInput = useRef()

    /**
     * 快捷添加
     * @param {enent} event 
     */
    const addSprintByKey = (event) => {
        let sprintValue = event.target.value;
        if (event.keyCode === 13 && sprintValue) {
            addSprint(sprintValue)
        }
    }

    /**
     * 点击添加
     * @param {event} event 
     */
    const addSprintByClick = () => {
        let sprintValue = sprintInput.current.value;
        if (sprintValue) {
            addSprint(sprintValue)
        }
    }
    /**
     * 
     * @param {event} e 
     */
    const addSprint = (value) => {
        let data = {
            sprintName: value,
            project: {
                id: projectId
            },
            sprintState: {
                id: "000000"
            }
        }
        addsprintlist(data).then((res) => {
            if (res.code === 0) {
                sprintInput.current.value = ""
            }
        })
    }
    /**
     * 
     */
    const exChange = (e) => {
        setInputShow(true)

    }
    useEffect(() => {
        if (inputShow === true && sprintInput.current) {
            sprintInput.current.focus()
        }
        return;
    }, [inputShow])

    const [visible, setVisible] = React.useState(false);
    const [type, setType] = useState()
    const [sprintId, setSprintId] = useState()
    const showModal = (type, id) => {
        setType(type)
        setVisible(true)
        if (id) {
            setSprintId(id)
        }

    }
    return (
        <div>
                    <div className="project-sprint">
                        <Breadcrumb>
                            <Breadcrumb.Item>迭代管理</Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <a href="/">迭代列表</a>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <Divider />
                        <div className="search-add">
                            <Search
                                placeholder="输入迭代名称"
                                allowClear
                                onSearch={onSearch}
                                style={{ width: 300 }}
                            />
                            <div className="sprint-botton">
                                <Button className="sprint-botton-left" onClick={() => sprintPlan()}>迭代规划</Button>
                                <PrivilegeProjectButton code={'SpintAdd'} domainId={projectId}>
                                    <Button type="primary" onClick={() => showModal("add")}>
                                        +创建迭代
                                    </Button>
                                </PrivilegeProjectButton>
                            </div>

                        </div>
                        <div className="sprint-box" onClick={(event) => { event.nativeEvent.stopImmediatePropagation(event); }}>
                            <div className="sprint-list">
                                <div className="sprint-item" style={{ backgroundColor: "#f4f5f7" }}>
                                    <div>
                                        迭代名称
                                    </div>
                                    <div>
                                        所属项目
                                    </div>
                                    <div>状态</div>
                                    <div className="time">日期</div>
                                    <div>描述</div>
                                    <div className="action">
                                        操作
                                    </div>
                                </div>
                                {
                                    sprintlist && sprintlist.map(item => {
                                        return <div className="sprint-item" key={item.id}>
                                            <div className="name" onClick={() => goSprintDetail(item.id)}>
                                                <svg className="icon" aria-hidden="true">
                                                    <use xlinkHref="#iconqiyebumen"></use>
                                                </svg>
                                                {item.sprintName}
                                            </div>
                                            <div>
                                                {item.project.projectName}
                                            </div>
                                            <div>{item.sprintState.name}</div>
                                            <div className="time">{item.startTime} ~ {item.endTime}</div>
                                            <div>{item.desc}</div>
                                            <div className="action">
                                                {/* <span >编辑</span> */}
                                                <PrivilegeProjectButton code={'SprintEdit'} domainId={projectId}>
                                                    <span onClick={() => showModal("edit", item.id)} >编辑</span>
                                                </PrivilegeProjectButton>
                                                <span onClick={() => delesprintList(item.id)}>删除</span></div>
                                        </div>
                                    })
                                }

                            </div>
                            {
                                inputShow ? <div className="sprint-insert">
                                    <div className="sprint-icon">
                                        <svg className="icon" aria-hidden="true">
                                            <use xlinkHref="#iconqiyebumen"></use>
                                        </svg>
                                    </div>
                                    <input className="name"
                                        ref={sprintInput}
                                        placeholder="请输入迭代名称"
                                        onKeyDown={(event) => { addSprintByKey(event) }}
                                    />
                                    <div className="sprint-insert-button">
                                        <span className="define" onClick={() => { addSprintByClick() }}>确定</span>
                                        <span onClick={() => setInputShow(false)}>取消</span>
                                    </div>
                                </div> :
                                    <div className="sprint-add" onClick={(event) => exChange(event)}>
                                        <div>+创建迭代</div>

                                    </div>
                            }
                            <div className="sprint-page">
                                <Pagination
                                    defaultCurrent={1}
                                    current={sprintPageParams.pageParam.currentPage}
                                    total={totalRecord} onChange={handleTableChange}
                                />
                            </div>
                        </div>
                    </div>
                    <SprintAddmodal
                        type={type}
                        sprintId={sprintId}
                        projectId={projectId}
                        uselist={uselist}
                        getUseList={getUseList}
                        sprintStateList={sprintStateList}
                        setVisible={setVisible}
                        visible={visible}
                    />
                </div>
    )

}
export default withRouter(inject("sprintStore")(observer(Sprint)));