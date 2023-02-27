/*
 * @Descripttion: 
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
    const [stageInfo, setStageInfo] = useState()
    const stageId = props.match.params.stageId;
    const path = props.match.path.split("/")[2];
    const [showMenu, setShowMenu] = useState(false);

    const [dropDown, showDropdown] = useState(false);
    const modelRef = useRef();
    const inputRef = useRef()
    // 项目id
    const projectId = props.match.params.id;
    const [stageList, setStageList] = useState([])
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
            // setLoading(false)
        })

        return;
    }, [stageId])



    const setStatusName = (value) => {
        let name = ""
        switch (value) {
            case "0":
                name = "未开始"
                break;
            case "1":
                name = "进行中"
                break;
            case "2":
                name = "已结束"
                break;
            default:
                name = "未开始"
                break;
        }
        return name;
    }
    const [fieldName, setFieldName] = useState("")
    const changeStyle = (value) => {
        setFieldName(value)
    }
    const dateFormat = 'YYYY-MM-DD';

    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [])


    const closeModal = (e) => {
        if (!modelRef.current) {
            return;
        }
        if (!modelRef.current.contains(e.target) && modelRef.current !== e.target) {
            setShowMenu(false)
        }
    }

    const selectKeyFun = (item) => {
        props.history.push(`/index/${path}/${projectId}/stageDetail/${item.id}`)
        setShowMenu(false)
    }

    const changeDate = (key, value, dateString) => {
        updateStage({ id: stageId, [key]: dateString })
    }
    const deStage = () => {
        deleteStage({ id: stageId }).then(res => {
            if (res.code === 0) {
                props.history.push(`/index/projectNomalDetail/${projectId}/stage`)
            }
        })
    }

    const [editName, setEditName] = useState(false)
    const updateNameByBlur = (event, id) => {
        event.stopPropagation();
        event.preventDefault()
        updateTitle()
    }

    const updateNameByKey = (event) => {
        if (event.keyCode === 13) {
            event.stopPropagation();
            event.preventDefault()
            updateTitle()
        }
    }

    const updateTitle = () => {
        const name = inputRef.current.textContent;
        const params = {
            stageName: name,
            id: stageId
        }

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
                                        <div className="stage-breadcrumb-dropdown" onMouseEnter={() => showDropdown(true)}
                                            onMouseLeave={() => showDropdown(false)}>
                                            <div
                                                onClick={() => setShowMenu(true)}
                                                style={{ cursor: "pointer" }}
                                                className="stage-breadcrumb-text"

                                            >
                                                {stageInfo?.stageName}
                                                <DownOutlined style={{ fontSize: '12px', marginLeft: "10px" }} />
                                            </div>
                                            <div
                                                className={`stage-breadcrumb-dropdown-modal ${showMenu ? "stage-menu-show" : "stage-menu-hidden"}`}
                                                ref={modelRef}
                                            >
                                                <ul className="stage-menu">
                                                    {
                                                        stageList && stageList.map(item => {
                                                            return <div className={`stage-menu-submenu ${item.id === stageInfo?.id ? "stage-menu-select" : ""}`}
                                                                key={item.id}
                                                                onClick={() => selectKeyFun(item)}
                                                            >
                                                                {/* <svg className="icon" aria-hidden="true">
                                                                <use xlinkHref={`#icon-${item.icon}`}></use>
                                                            </svg> */}
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
                                    <Button onClick={() => deStage()}>删除</Button>
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