/*
 * @Descripttion: 迭代列表， 自定义列表
 * @sprint: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:02:38
 */

import React, { useRef, useEffect, useState, Fragment } from "react";
import { Space, Row, Col, Table, Dropdown, Menu, Modal } from 'antd';
import SprintAddmodal from "./SpintAddEditModal";
import "./sprintList.scss";
import { getUser } from "thoughtware-core-ui";
import { withRouter } from "react-router";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import Button from "../../../common/button/Button";
import InputSearch from '../../../common/input/InputSearch'
import SprintStore from "../store/SprintStore";
import { Provider, observer } from "mobx-react";
import { useDebounce } from "../../../common/utils/debounce";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import { SelectSimple, SelectItem } from "../../../common/select";
import ColorIcon from "../../../common/colorIcon/ColorIcon"
const Sprint = (props) => {
    const store = {
        sprintStore: SprintStore
    }
    const projectId = props.match.params.id;
    const { findAllSprintState, findSprintPage, uselist, getUseList,
        sprintList,setSprintList, delesprintList, createSprintFocus, findSprintFocusList,
        deleteSprintFocus, total, createRecent, sprintPageParams
    } = SprintStore;

    const project = JSON.parse(localStorage.getItem("project"));
    // 登录者id
    const userId = getUser().userId;
    // tab的key
    const [activeTabs, setActiveTabs] = useState("all")
    // 弹窗显示
    const [visible, setVisible] = React.useState(false);
    // 操作类型， edit,add
    const [type, setType] = useState();

    // 迭代id
    const [sprintId, setSprintId] = useState();

    const [sprintStateList, setsprintStateList] = useState([])
    /**
     * 获取关注的迭代, 获取项目的所有迭代，获取所有迭代状态
     */
    useEffect(() => {
        // getFocusSprint()
        // findSprintList({ projectId: projectId });
        findAllSprintState().then(res => {
            if(res.code === 0){
                setsprintStateList(res.data)
            }
        });
        selectTabs(activeTabs, 1)
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
        props.history.push({ pathname: `/${projectId}/sprintdetail/${id}/workTable` })
        localStorage.setItem("sprintId", id);
    }

    /**
     * 根据名字模糊搜索迭代
     * @param {输入框的值} data 
     */
    const onSearch = useDebounce((data) => {
        findSprintPage({ sprintName: data })
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
    * 取消关注
    * @param {迭代id} sprintId 
    */
    const deleteFocusSprint = (sprintId, index) => {
        const params = {
            sprintId: sprintId,
            masterId: userId,
            projectId: projectId
        }
        deleteSprintFocus(params).then(data => {
            if (data.code === 0) {
                sprintList[index].focusIs = false
                setSprintList([...sprintList])
            }
        })
    }


    /**
     * 添加关注的迭代
     * @param {迭代id} sprintId 
     */
    const addFocusSprint = (sprintId, index) => {
        const params = {
            sprintId: sprintId,
            masterId: userId,
            projectId: projectId
        }
        createSprintFocus(params).then(data => {
            if (data.code === 0) {
                sprintList[index].focusIs = true
                setSprintList([...sprintList])
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
            title: '我创建的',
            key: 'build',
            icon: "programconcern"
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
    const selectTabs = (key, page) => {
        setActiveTabs(key)
        const params = {
            projectId: projectId,
            pageParam: {
                pageSize: sprintPageParams.pageParam.pageSize,
                currentPage: page,
            }
        }
        switch (key) {
            case "all":
                findSprintPage({ followersId: null, builderId: null, ...params });
                break;
            case "build":
                findSprintPage({ builderId: userId, followersId: null, ...params });
                break;
            case "focus":
                findSprintPage({ followersId: userId, builderId: null, ...params });
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
                selectTabs(activeTabs, 1)
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

    const changePage = (page, pageSize) => {
        selectTabs(activeTabs, page)
    }

    const selectaSprintState = (value) => {
        console.log(value)
        const params = {
            sprintStateIds: value,
            pageParam: {
                pageSize: sprintPageParams.pageParam.pageSize,
                currentPage: 1,
            }
        }
        findSprintPage(params);
    }

    const columns = [
        {
            title: "迭代名称",
            dataIndex: "sprintName",
            key: "sprintName",
            width: "25%",
            render: (text, record) => (
                <div className="sprint-item" onClick={() => goSprintDetail(record.id, text)}>
                    {/* <img
                        src={'/images/sprint.png'}
                        alt=""
                        className="icon-32"
                    /> */}
                    <ColorIcon name = {text} className = "icon-32" color = {record.color}/>
                    <span className="sprint-name" onClick={() => goSprintDetail(record.id, text)}>{text}</span>
                </div>
            ),
        },
        {
            title: "计划日期",
            dataIndex: "data",
            key: "startTime",
            align: "left",
            width: "25%",
            render: (text, record) => <span>{record.startTime?.slice(0, 10)} ~ {record.endTime?.slice(0, 10)}</span>,
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
            render: (text, record, index) => (
                <Space size="middle">
                    {
                        record.focusIs ?
                            <svg className="svg-icon" aria-hidden="true" onClick={() => deleteFocusSprint(record.id, index)}>
                                <use xlinkHref="#icon-view"></use>
                            </svg>
                            :
                            <svg className="svg-icon" aria-hidden="true" onClick={() => addFocusSprint(record.id, index)}>
                                <use xlinkHref="#icon-noview"></use>
                            </svg>
                    }

                    <DeleteModal deleteFunction={deleSprintList} id={record.id} />
                </Space>

            ),
        },
    ];

    return (<Provider {...store}>
        <div className="project-sprint">
            <Row>
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "20", offset: "2" }} xxl={{ span: "18", offset: "3" }}>
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
                                            onClick={() => selectTabs(item.key, 1)}
                                        >
                                            {item.title}
                                        </div>
                                    })
                                }
                            </div>
                            <div className="sprint-filter-right">
                                <SelectSimple
                                    name="sprintStateIds"
                                    onChange={(value) => selectaSprintState(value)}
                                    title={"状态"}
                                    ismult={true}
                                    value={sprintPageParams?.sprintStateIds}
                                >
                                    {
                                        sprintStateList.map(item => {
                                            return <SelectItem
                                                value={item.id}
                                                label={item.name}
                                                key={item.id}
                                            />
                                        })
                                    }
                                </SelectSimple>
                                <InputSearch
                                    placeholder="迭代名称"
                                    allowClear
                                    style={{ width: 200 }}
                                    onChange={onSearch}
                                />
                            </div>

                        </div>
                        <div className="project-sprint-contant">
                            <div className="sprint-box">
                                <Table
                                    columns={columns}
                                    dataSource={sprintList}
                                    rowKey={(record) => record.id}
                                    // pagination={false}
                                    onSearch={onSearch}
                                    pagination={{
                                        total: total,
                                        pageSize: sprintPageParams.pageParam.pageSize,
                                        current: sprintPageParams.pageParam.currentPage,
                                        onChange: changePage,
                                        position: ["bottomCenter"],
                                        hideOnSinglePage: true,
                                        simple: true
                                    }}
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
                setActiveTabs={setActiveTabs}
                selectTabs = {selectTabs}
                {...props}
            />
        </div>
    </Provider>

    )

}
export default withRouter(observer(Sprint));