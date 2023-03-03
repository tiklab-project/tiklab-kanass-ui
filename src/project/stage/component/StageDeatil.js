/*
 * @Descripttion: 阶段详情
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-04-09 16:39:00
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 19:09:13
 */
import React, { Fragment, useEffect, useState, useRef } from "react";
import { observer, inject } from "mobx-react";
import { DatePicker, Select, Row, Col } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import "./stageDetail.scss";
import StagePlan from "./StagePlan"
import { withRouter } from "react-router";
import Button from "../../../common/button/Button";

const StageDetail = (props) => {
    const { stageStore } = props;
    const { findStage, findStageList, updateStage, deleteStage } = stageStore;
    // 日期格式
    const dateFormat = 'YYYY-MM-DD';
    // 阶段信息
    const [stageInfo, setStageInfo] = useState()
    // 阶段id
    const stageId = props.match.params.stageId;
    // 项目类型
    const path = props.match.path.split("/")[2];
    // 鼠标放置，添加背景色
    const [mouseActive, setMouseActive] = useState(false);
    // 修改的字段key
    const [fieldName, setFieldName] = useState("")
    // 阶段切换下拉框
    const modelRef = useRef();
    // 输入
    const inputRef = useRef()
    // 项目id
    const projectId = props.match.params.id;
    // 阶段列表
    const [stageList, setStageList] = useState([])
    // 标题是否是编辑模式
    const [editName, setEditName] = useState(false)
    /**
     * 获取阶段详情，获取阶段列表用于切换
     */
    useEffect(() => {
        if (stageId !== "") {
            findStage({ id: stageId }).then(data => {
                setStageInfo(data.data)
            })
        }
        findStageList({ projectId: projectId }).then((res) => {
            if (res.code === 0) {
                setStageList(res.data)
            }
        })

        return;
    }, [stageId])

    /**
     * 点击不同的信息，修改点击信息的样式
     * @param {修改字段key} value 
     */
    const changeStyle = (value) => {
        setFieldName(value)
    }
    
    /**
     * 监听鼠标点击关闭切换阶段弹窗
     */
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [])

    /**
     * 关闭切换弹窗
     * @param {点击event} e 
     * @returns 
     */
    const closeModal = (e) => {
        if (!modelRef.current) {
            return;
        }
        if (!modelRef.current.contains(e.target) && modelRef.current !== e.target) {
            setMouseActive(false)
        }
    }

    /**
     * 切换阶段
     * @param {*} item 
     */
    const changeStage = (item) => {
        props.history.push(`/index/${path}/${projectId}/stageDetail/${item.id}`)
        setMouseActive(false)
    }

    /**
     * 修改日期
     * @param {修改的字段key} key 
     * @param {*} value 
     * @param {日期} dateString 
     */
    const changeDate = (key, value, dateString) => {
        updateStage({ id: stageId, [key]: dateString })
    }

    /**
     * 删除节点
     */
    const deleStage = () => {
        deleteStage({ id: stageId }).then(res => {
            if (res.code === 0) {
                props.history.push(`/index/projectNomalDetail/${projectId}/stage`)
            }
        })
    }

    

    /**
     * 失去焦点更新标题
     * @param {dom} event 
     * @param {*} id 
     */
    const updateNameByBlur = (event) => {
        event.stopPropagation();
        event.preventDefault()
        updateTitle()
    }

    /**
     * 点击回车更新标题
     * @param {dom} event 
     * @param {*} id 
     */
    const updateNameByKey = (event) => {
        if (event.keyCode === 13) {
            event.stopPropagation();
            event.preventDefault()
            updateTitle()
        }
    }

    /**
     * 更新标题
     */
    const updateTitle = () => {
        const name = inputRef.current.textContent;
        const params = {
            stageName: name,
            id: stageId
        }

        // 输入框修改更新
        if (inputRef.current.textContent !== stageInfo.title) {
            updateStage(params).then(res => {
                if (res.code === 0) {
                    stageInfo.stageName = inputRef.current.textContent;
                }
            })
        }
        inputRef.current.blur()
        setEditName(false)
    }

    return (
        <Row >
            <Col lg={{ span: "22", offset: "1" }} xxl={{ span: "18", offset: "3" }}>
                <div className="stage-detail">
                    {
                        stageInfo && <Fragment>
                            <div className="stage-title">
                                <div className="stage-detail-top">
                                    <div className="stage-breadcrumb">
                                        <svg className="svg-icon" aria-hidden="true">
                                            <use xlinkHref="#icon-home"></use>
                                        </svg>
                                        <span className="stage-breadcrumb-first" onClick={() => props.history.push(`/index/projectNomalDetail/${projectId}/stage`)}>阶段</span>
                                        <svg className="svg-icon" aria-hidden="true">
                                            <use xlinkHref="#icon-right1"></use>
                                        </svg>
                                        <div className="stage-breadcrumb-dropdown" >
                                            <div
                                                onClick={() => setMouseActive(true)}
                                                style={{ cursor: "pointer" }}
                                                className="stage-breadcrumb-text"

                                            >
                                                {stageInfo?.stageName}
                                                <DownOutlined style={{ fontSize: '12px', marginLeft: "10px" }} />
                                            </div>
                                            <div
                                                className={`stage-breadcrumb-dropdown-modal ${mouseActive ? "stage-menu-show" : "stage-menu-hidden"}`}
                                                ref={modelRef}
                                            >
                                                <ul className="stage-menu">
                                                    {
                                                        stageList && stageList.map(item => {
                                                            return <div className={`stage-menu-submenu ${item.id === stageInfo?.id ? "stage-menu-select" : ""}`}
                                                                key={item.id}
                                                                onClick={() => changeStage(item)}
                                                            >
                                                                <span>
                                                                    {item.stageName}
                                                                </span>
                                                            </div>
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <Button onClick={() => deleStage()}>删除</Button>
                                </div>
                            </div>
                            <div className="stage-title">
                                <div className={`${editName ? "stage-name-edit" : "stage-name"}`}
                                    onBlur={() => updateNameByBlur(event, "blur")}
                                    onKeyDown={() => updateNameByKey(event, "enter")}
                                    onClick={() => setEditName(true)}
                                    contentEditable={editName}
                                    suppressContentEditableWarning
                                    ref={inputRef}
                                >
                                    {stageInfo?.stageName}
                                </div>
                            </div>
                            <div className="stage-info">
                                <div className="stage-date">
                                    <div className="stage-lable">开始日期：</div>
                                    <DatePicker
                                        locale={locale}
                                        format={dateFormat}
                                        allowClear={false}
                                        className="work-select"
                                        bordered={fieldName === "planStartTime" ? true : false}
                                        showarrow={fieldName === "planStartTime" ? "true" : "false"}
                                        onFocus={() => changeStyle("planStartTime")}
                                        onBlur={() => setFieldName("")}
                                        suffixIcon={false}
                                        defaultValue={moment(stageInfo.startTime, dateFormat)}
                                        onChange={(data, dateString) => changeDate("endTime", data, dateString)}
                                    />
                                </div>
                                <div className="stage-date">
                                    <div className="stage-lable">发布日期：</div>
                                    <DatePicker
                                        locale={locale}
                                        format={dateFormat}
                                        allowClear={false}
                                        className="work-select"
                                        bordered={fieldName === "endTime" ? true : false}
                                        showarrow={fieldName === "endTime" ? "true" : "false"}
                                        onFocus={() => changeStyle("endTime")}
                                        onBlur={() => setFieldName("")}
                                        suffixIcon={false}
                                        defaultValue={moment(stageInfo.endTime, dateFormat)}
                                        onChange={(data, dateString) => changeDate("endTime", data, dateString)}
                                    />
                                </div>
                            </div>
                            <StagePlan stageId={stageId} />

                        </Fragment>
                    }
                </div>
            </Col>
        </Row>
    )

}
export default withRouter(inject("stageStore")(observer(StageDetail)));