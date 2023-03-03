/*
 * @Descripttion: 迭代列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:02:38
 */

import React, { useRef, useEffect, useState, Fragment } from "react";
import { Input, Row, Col } from 'antd';
import SprintAddmodal from "./SpintAddEditModal";
import { observer, inject } from "mobx-react";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import "../components/sprint.scss";
import { getUser } from "tiklab-core-ui";
import { withRouter } from "react-router";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import Button from "../../../common/button/Button";
import InputSearch from '../../../common/input/InputSearch'

const Sprint = (props) => {
    const projectId = props.match.params.id
    const { sprintStore } = props;
    const { findAllSprintState, findSprintList, uselist, getUseList, sprintStateList, 
        sprintlist, delesprintList,createSprintFocus, findSprintFocusList, 
        deleteSprintFocus, findFocusSprintList,setFilterType
    } = sprintStore;
    // 登录者id
    const masterId = getUser().userId;
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
    const goSprintDetail = (id) => {
        props.history.push({ pathname: `/index/${projectId}/sprintdetail/${id}/survey` })
        localStorage.setItem("sprintId", id);
    }

    /**
     * 根据名字模糊搜索迭代
     * @param {输入框的值} data 
     */
    const onSearch = (data) => {
        findSprintList({ sprintName: data.target.value })
    }

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
            masterId: masterId,
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
            masterId: masterId,
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
            masterId: masterId,
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
                findFocusSprintList({ projectId: projectId, master: masterId });
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
            if(res.code === 0){
                selectTabs("all")
            }
            
        })
    }
    return (
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
                                <div className="sprint-table">

                                    <div className="sprint-item sprint-table-head">
                                        <div style={{ flex: 1 }}>
                                            迭代名称
                                        </div>
                                        <div className="time">日期</div>
                                        <div style={{ width: "120px" }}>状态</div>

                                        <div className="action" style={{ width: "120px" }}>
                                            操作
                                        </div>
                                    </div>
                                    {
                                        sprintlist && sprintlist.length > 0 ?
                                            <Fragment>
                                                <div className="sprint-list" >
                                                    {
                                                        sprintlist && sprintlist.map((item, index) => {
                                                            return <div className="sprint-item" key={item.id}>
                                                                <div className="name" onClick={() => goSprintDetail(item.id)}>
                                                                    <svg className="icon" aria-hidden="true">
                                                                        <use xlinkHref="#icon-plan"></use>
                                                                    </svg>
                                                                    {item.sprintName}
                                                                </div>

                                                                <div className="time">{item.startTime} ~ {item.endTime}</div>
                                                                <div style={{ width: "120px" }}>
                                                                    <span className="sprint-state">
                                                                        {item.sprintState.name}
                                                                    </span>
                                                                </div>
                                                                <div className="action" style={{ width: "120px", display: "flex", gap: "15px" }}>
                                                                    {
                                                                        focusSprintList.indexOf(item.id) !== -1 ?
                                                                            <svg className="svg-icon" aria-hidden="true" onClick={() => deleteFocusSprint(item.id)}>
                                                                                <use xlinkHref="#icon-view"></use>
                                                                            </svg>
                                                                            :
                                                                            <svg className="svg-icon" aria-hidden="true" onClick={() => addFocusSprint(item.id)}>
                                                                                <use xlinkHref="#icon-noview"></use>
                                                                            </svg>
                                                                    }
                                                                    <PrivilegeProjectButton code={'SprintEdit'} domainId={projectId}  {...props}>
                                                                        <svg className="svg-icon" aria-hidden="true" onClick={() => showModal("edit", item.id)} style={{ cursor: "pointer" }}>
                                                                            <use xlinkHref="#icon-edit"></use>
                                                                        </svg>

                                                                    </PrivilegeProjectButton>
                                                                    <svg className="svg-icon" aria-hidden="true" onClick={() => deleSprintList(item.id)} style={{ cursor: "pointer" }}>
                                                                        <use xlinkHref="#icon-delete"></use>
                                                                    </svg>

                                                                </div>
                                                            </div>
                                                        })
                                                    }
                                                </div>
                                            </Fragment>
                                            :
                                            <div className="sprint-item">暂无数据</div>
                                    }
                                </div>


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
                {...props}
            />
        </div>
    )

}
export default withRouter(inject("systemRoleStore", "sprintStore")(observer(Sprint)));