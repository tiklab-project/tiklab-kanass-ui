/*
 * @Descripttion: 史诗详情
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
import "./EpicDetail.scss";
import EpicPlan from "./EpicPlan"
import { withRouter } from "react-router";
import Button from "../../../common/button/Button";

const EpicDetail = (props) => {
    const { epicStore } = props;
    const { findEpic, findEpicList, updateEpic, deleteEpic } = epicStore;
    // 史诗信息
    const [epicInfo, setEpicInfo] = useState()
    // 史诗id
    const epicId = props.match.params.epicId;
    // 项目类型
    // 是否显示切换史诗弹窗
    const [showMenu, setShowMenu] = useState(false);
    // 弹窗ref
    const modelRef = useRef();
    // 项目id
    const projectId = props.match.params.id;
    // 史诗列表
    const [epicList, setEpicList] = useState([])
    // 日历格式
    const dateFormat = 'YYYY-MM-DD';
    // 史诗标题ref
    const inputRef = useRef()
    // 编辑的史诗名称
    const [editName, setEditName] = useState(false)
    /**
     * 获取史诗信息和史诗列表
     */
    useEffect(() => {
        if (epicId !== "") {
            findEpic({ id: epicId }).then(data => {
                if(data.code === 0){
                    setEpicInfo(data.data)
                }
            })
        }
        findEpicList({ projectId: projectId }).then((res) => {
            if (res.code === 0) {
                setEpicList(res.data)
            }
            // setLoading(false)
        })

        return;
    }, [epicId])
    // 要修改字段的key
    const [fieldName, setFieldName] = useState("")
    
    /**
     * 聚焦改变样式
     * @param {值} value 
     */
    const changeStyle = (value) => {
        setFieldName(value)
    }
    
    /**
     * 监听鼠标点击事件，控制弹窗的显示与不显示
     */
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [showMenu])

    /**
     * 关闭弹窗
     * @param {鼠标点击dom} e 
     * @returns 
     */
    const closeModal = (e) => {
        if (!modelRef.current) {
            return;
        }
        if (!modelRef.current.contains(e.target) && modelRef.current !== e.target) {
            setShowMenu(false)
        }
    }

    /**
     * 切换史诗
     * @param {史诗id} item 
     */
    const selectKeyFun = (epicId) => {
        props.history.push(`/index/projectDetail/${projectId}/epic/${epicId}`)
        setShowMenu(false)
    }

    /**
     * 修改发布日期，开始日期
     * @param {修改字段的key} key 
     * @param {*} value 
     * @param {带格式的日期} dateString 
     */
    const changeDate = (key, value, dateString) => {
        updateEpic({ id: epicId, [key]: dateString })
    }

    // 失去焦点编辑标题
    const updateNameByBlur = (event, id) => {
        event.stopPropagation();
        event.preventDefault()
        updateTitle()
    }

    //回车修改标题
    const updateNameByKey = (event) => {
        if (event.keyCode === 13) {
            event.stopPropagation();
            event.preventDefault()
            updateTitle()
        }
    }

    // 掉接口更新标题
    const updateTitle = () => {
        const name = inputRef.current.textContent;
        const params = {
            epicName: name,
            id: epicId
        }

        if (inputRef.current.textContent !== epicInfo.title) {
            updateEpic(params).then(res => {
                if (res.code === 0) {
                    epicInfo.epicName = inputRef.current.textContent;
                }
            })
        }
        inputRef.current.blur()
        setEditName(false)
    }

    // 删除史诗
    const deEpic = () => {
        deleteEpic({id: epicId}).then(res => {
            if(res.code === 0){
                props.history.push(`/index/ProjectDetail/${projectId}/linemap`)
            }
        })
    }

    return (
        <Row >
            <Col lg={{ span: "22", offset: "1" }} xxl={{ span: "18", offset: "3" }}>
                <div className="epic-detail">
                    {
                        epicInfo && <Fragment>
                            <div className="epic-detail-top">
                                <div className="epic-breadcrumb">
                                    <span className="epic-breadcrumb-first" onClick={() => props.history.push(`/index/projectDetail/${projectId}/linemap`)}>需求集</span>
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-right1"></use>
                                    </svg>
                                    <div className="epic-breadcrumb-dropdown">
                                        <div
                                            onClick={() => setShowMenu(true)}
                                            style={{ cursor: "pointer" }}
                                            className="epic-breadcrumb-text"

                                        >
                                            {epicInfo?.epicName}
                                            <DownOutlined style={{ fontSize: '12px', marginLeft: "10px" }} />
                                        </div>
                                        <div
                                            className={`epic-breadcrumb-dropdown-modal ${showMenu ? "epic-menu-show" : "epic-menu-hidden"}`}
                                            ref={modelRef}
                                        >
                                            <ul className="epic-menu">
                                                {
                                                    epicList && epicList.map(item => {
                                                        return <div className={`epic-menu-submenu ${item.id === epicInfo?.id ? "epic-menu-select" : ""}`}
                                                            key={item.id}
                                                            onClick={() => selectKeyFun(item.id)}
                                                        >
                                                            {/* <svg className="icon" aria-hidden="true">
                                                            <use xlinkHref={`#icon-${item.icon}`}></use>
                                                        </svg> */}
                                                            <span>
                                                                {item.epicName}
                                                            </span>
                                                        </div>
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <Button onClick = {() => deEpic()}>删除</Button>
                            </div>

                            <div className="epic-title">
                                <div className={`${editName ? "epic-name-edit" : "epic-name"}`}
                                    onBlur={() => updateNameByBlur(event, "blur")}
                                    onKeyDown={() => updateNameByKey(event, "enter")}
                                    onClick={() => setEditName(true)}
                                    contentEditable={editName}
                                    suppressContentEditableWarning
                                    ref={inputRef}
                                >
                                    {epicInfo?.epicName}
                                </div>
                            </div>
                            <div className="epic-info">
                                <div className="epic-date">
                                    <div className="epic-lable">开始日期：</div>
                                    <DatePicker
                                        locale={locale}
                                        format={dateFormat}
                                        allowClear={false}
                                        className="work-select"
                                        bordered={fieldName === "planStartTime" ? true : false}
                                        showarrow={fieldName === "planStartTime" ? "true" : "false"}
                                        onFocus={() => changeStyle("planStartTime")}
                                        onBlur={() => setFieldName("")}
                                        onChange={(data, dateString) => changeDate("startTime", data, dateString)}
                                        suffixIcon={false}
                                        defaultValue={moment(epicInfo.startTime, dateFormat)}
                                    />
                                </div>
                                <div className="epic-date">
                                    <div className="epic-lable">发布日期：</div>
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
                                        defaultValue={moment(epicInfo.endTime, dateFormat)}
                                        onChange={(data, dateString) => changeDate("endTime", data, dateString)}
                                    />
                                </div>
                            </div>
                            <EpicPlan epicId={epicId} />

                        </Fragment>
                    }
                </div>
            </Col>
        </Row>
    )

}
export default withRouter(inject("epicStore")(observer(EpicDetail)));