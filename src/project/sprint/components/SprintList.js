/*
 * @Descripttion: 迭代列表， 自定义列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:02:38
 */

import React, { useRef, useEffect, useState, Fragment } from "react";
import { Space, Row, Col, Table } from 'antd';
import SprintAddmodal from "./SpintAddEditModal";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import "./sprintList.scss";
import { getUser } from "tiklab-core-ui";
import { withRouter } from "react-router";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import Button from "../../../common/button/Button";
import InputSearch from '../../../common/input/InputSearch'
import SprintStore from "../store/SprintStore";
import { Provider, observer } from "mobx-react";
import { useDebounce } from "../../../common/utils/debounce";
import UserIcon from "../../../common/UserIcon/UserIcon";
const Sprint = (props) => {
    const store = {
        sprintStore: SprintStore
    }
    const projectId = props.match.params.id;
    const { findAllSprintState, findSprintList, uselist, getUseList, sprintStateList,
        sprintList, delesprintList, createSprintFocus, findSprintFocusList,
        deleteSprintFocus, findFocusSprintList, setFilterType, createRecent
    } = SprintStore;

    const project = JSON.parse(localStorage.getItem("project"));
    // 登录者id
    const userId = getUser().userId;
    // 获取关注的迭代
    const [focusSprintList, setFocusSprintList] = useState([])
    // tab的key
    const [activeTabs, setActiveTabs] = useState("pending")
    // 弹窗显示
    const [visible, setVisible] = React.useState(false);
    // 操作类型， edit,add
    const [type, setType] = useState()
    // 迭代id
    const [sprintId, setSprintId] = useState()
    /**
     * 获取关注的迭代, 获取项目的所有迭代，获取所有迭代状态
     */
    useEffect(() => {
        getFocusSprint()
        findSprintList({ projectId: projectId });
        findAllSprintState();
        return;
    }, [])

    /**
     * 到迭代详情
     * @param {迭代id} id 
     */
    const goSprintDetail = (id, sprintName) => {
        const params = {
            name: sprintName,
            model: "sprint",
            modelId: id,
            project: { id: project.id },
            projectType: { id: project.projectType.id },
        }
        createRecent(params)
        props.history.push({ pathname: `/index/${projectId}/sprintdetail/${id}/survey` })
        localStorage.setItem("sprintId", id);
    }

    /**
     * 根据名字模糊搜索迭代
     * @param {输入框的值} data 
     */
    const onSearch = useDebounce((data) => {
        findSprintList({ sprintName: data })
    }, [500]) 

    /**
     * 显示添加或者编辑弹窗
     * @param {操作类型， edit,add} type 
     * @param {迭代id} id 
     */
    const showModal = (type, id) => {
        setType(type)
        setVisible(true)
        if (id) {
            setSprintId(id)
        }

    }

    /**
     * 获取关注的迭代列表
     */
    const getFocusSprint = () => {
        const params = {
            masterId: userId,
            projectId: projectId
        }
        findSprintFocusList(params).then(data => {
            if (data.code === 0) {
                let list = []
                if (data.data.length > 0) {
                    data.data.map(item => {
                        list.push(item.sprintId)
                    })
                }
                setFocusSprintList([...list])
            }
            console.log(data.data)
        })
    }

    /**
     * 添加关注的迭代
     * @param {迭代id} sprintId 
     */
    const addFocusSprint = (sprintId) => {
        const params = {
            sprintId: sprintId,
            masterId: userId,
            projectId: projectId
        }
        createSprintFocus(params).then(data => {
            if (data.code === 0) {

                focusSprintList.push(sprintId)
                setFocusSprintList([...focusSprintList])
            }
        })
    }

    /**
     * 取消关注
     * @param {迭代id} sprintId 
     */
    const deleteFocusSprint = (sprintId) => {
        const params = {
            sprintId: sprintId,
            masterId: userId,
            projectId: projectId
        }
        deleteSprintFocus(params).then(data => {
            if (data.code === 0) {
                const index = focusSprintList.indexOf(sprintId);
                if (index > -1) {
                    focusSprintList.splice(index, 1);
                }
                setFocusSprintList([...focusSprintList])
            }
        })
    }

    /**
     * tab 数组
     */
    const sprintTab = [
        {
            title: '全部迭代',
            key: 'all',
            icon: "all"
        },
        {
            title: '进行中的',
            key: 'pending',
            icon: "project"
        },
        {
            title: '未开始的',
            key: 'creating',
            icon: "programrencent"
        },

        {
            title: '已完成的',
            key: 'ending',
            icon: "programjoin"
        },
        {
            title: '我关注的',
            key: 'focus',
            icon: "programconcern"
        }
    ]

    /**
     * tab 切换
     * @param {tab key} key 
     */
    const selectTabs = (key) => {
        setActiveTabs(key)
        setFilterType(key)
        switch (key) {
            case "pending":
                findSprintList({ projectId: projectId, sprintStateId: "111111" });
                break;
            case "creating":
                findSprintList({ projectId: projectId, sprintStateId: "000000" });
                break;
            case "ending":
                findSprintList({ projectId: projectId, sprintStateId: "222222" });
                break;
            case "all":
                findSprintList({ projectId: projectId, sprintStateId: null });
                break;
            case "focus":
                findFocusSprintList({ projectId: projectId, master: userId });
                break;

            default:
                break;
        }
    }

    /**
     * 删除迭代
     * @param {迭代id} id 
     */
    const deleSprintList = (id) => {
        delesprintList(id).then(res => {
            if (res.code === 0) {
                selectTabs("all")
            }

        })
    }

    const setStatuStyle = (id) => {
        let name;
        switch (id) {
            case "000000":
                name = "sprint-status-todo";
                break;
            case "111111":
                name = "sprint-status-process";
                break;
            case "222222":
                name = "sprint-status-done";
                break;
            default:
                name = "sprint-status-process";
                break;
        }
        return name;
    }
    
    const columns = [
        {
            title: "迭代名称",
            dataIndex: "sprintName",
            key: "sprintName",
            render: (text, record) => (
                <div className="sprint-item" onClick={() => goSprintDetail(record.id, text)}>
                    <img
                        src={'/images/sprint.png'}
                        alt=""
                        className="img-icon-right"
                    />
                   <span className="sprint-name" onClick={() => goSprintDetail(record.id, text)}>{text}</span>
                </div>
                

            ),
        },
        {
            title: '负责人',
            dataIndex: ['master', 'nickname'],
            key: 'builderId',
            sorter: {
                multiple: 1
            },
            render: (text, record) => <div className="sprint-item">
                <div style={{ marginRight: "5px" }}><UserIcon name={text} /></div>
                <div >{text}</div>
            </div>
        },

        {
            title: "计划日期",
            dataIndex: "data",
            key: "startTime",
            align: "left",
            render: (text, record) => <span>{record.startTime} ~ {record.endTime}</span>,
        },
        {
            title: "事项",
            dataIndex: "workNumber",
            key: "workNumber",
            align: "left"
        },
        {
            title: "状态",
            dataIndex: ["sprintState", "name"],
            key: "sprintState",
            align: "left",
            render: (text, record) => <div className={`sprint-status ${setStatuStyle(record.sprintState.id)}`}>
                {text}
            </div>
        },
        {
            title: "操作",
            key: "action",
            width: "100px",
            render: (text, record) => (
                <Space size="middle">
                    {
                        focusSprintList.indexOf(record.id) !== -1 ?
                            <svg className="svg-icon" aria-hidden="true" onClick={() => deleteFocusSprint(record.id)}>
                                <use xlinkHref="#icon-view"></use>
                            </svg>
                            :
                            <svg className="svg-icon" aria-hidden="true" onClick={() => addFocusSprint(record.id)}>
                                <use xlinkHref="#icon-noview"></use>
                            </svg>
                    }
                    <svg className="svg-icon" aria-hidden="true" onClick={() => deleSprintList(record.id)} style={{ cursor: "pointer" }}>
                        <use xlinkHref="#icon-delete"></use>
                    </svg>


                </Space>

            ),
        },
    ];
    return (<Provider {...store}>
        <div className="project-sprint">
            <Row>
                <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                    <div className="project-sprint-list">
                        <Breadcumb
                            firstText="迭代"
                        >
                            <div className="sprint-botton">
                                <Button type="primary" className="sprint-botton-add" onClick={() => showModal("add")}>
                                    添加迭代
                                </Button>
                            </div>
                        </Breadcumb>
                        <div className="sprint-filter">
                            <div className="sprint-tabs">
                                {
                                    sprintTab.map(item => {
                                        return <div
                                            className={`sprint-tab ${activeTabs === item.key ? "active-tabs" : ""}`}
                                            key={item.key}
                                            onClick={() => selectTabs(item.key)}
                                        >
                                            {item.title}
                                        </div>
                                    })
                                }
                            </div>
                            <InputSearch
                                placeholder="迭代名称"
                                allowClear
                                style={{ width: 300 }}
                                onChange={onSearch}
                            />
                        </div>
                        <div className="project-sprint-contant">
                            <div className="sprint-box">
                                <Table
                                    columns={columns}
                                    dataSource={sprintList}
                                    rowKey={(record) => record.id}
                                    pagination={false}
                                    onSearch={onSearch}
                                    onChange={false}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <SprintAddmodal
                type={type}
                sprintId={sprintId}
                projectId={projectId}
                uselist={uselist}
                getUseList={getUseList}
                sprintStateList={sprintStateList}
                setVisible={setVisible}
                visible={visible}
                setActiveTabs = {setActiveTabs}
                {...props}
            />
        </div>
    </Provider>

    )

}
export default withRouter(observer(Sprint));