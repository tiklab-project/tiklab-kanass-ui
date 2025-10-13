/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 15:57:05
 * @Description: 事项列表列
 */
import React from "react";
import UserIcon from "../../common/UserIcon/UserIcon";
import ImgComponent from "../../common/imgComponent/ImgComponent";
import {Progress} from "antd";

const setStatuStyle = (id) => {
    let name;
    switch (id) {
        case "TODO":
            name = "work-status-todo";
            break;
        case "DONE":
            name = "work-status-done";
            break;
        default:
            name = "work-status-process";
            break;
    }
    return name;
}

/**
 * 小屏的事项列表列设置
 */
const xxlColumn = (goWorkItemDetail, sortArray) => {
    return [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            className: `work-first-col ${sortArray.indexOf("title") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 1
            },
            render: (text, record, index) => (
                <div className="work-title" title = {text} onClick={() => goWorkItemDetail(record, index)}>
                    <div className="work-icon">
                        <ImgComponent
                            src={record.workTypeSys?.iconUrl}
                            alt=""
                            className="icon-28"
                        />
                    </div>
                    <div className="work-title-content">
                        <div className="work-title-top">
                            {text}
                        </div>
                        <div className="work-title-bottom">
                            <span>{record.code}</span>
                            {/*<span>{record.builder.nickname}</span>*/}
                        </div>
                    </div>

                </div>
            )
        },

        {
            title: '状态',
            dataIndex: ['workStatusNode', 'name'],
            key: 'workStatus',
            className: `${sortArray.indexOf("workStatus") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 2
            },
            render: (text, record) => <div className={`work-status ${setStatuStyle(record.workStatusCode)}`}>
                {text}
            </div>
        },
        {
            title: '优先级',
            dataIndex: ['workPriority', 'name'],
            key: 'workPriority',
            className: `${sortArray.indexOf("workPriority") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 3
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img">
                    <ImgComponent
                        src={record.workPriority?.iconUrl}
                        alt=""
                        // isRemote={true}
                        className="img-icon-right icon-10"
                    />
                </div>
                <div className="work-info-text">{text || "暂无设置"}</div>
            </div>
        },
        {
            title: '进度',
            dataIndex: 'estimateTime',
            key: 'estimateTime',

            className: `${sortArray.indexOf("estimateTime") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            render: (text, record) =><div className={`work-info`}>
                <div className={"table-progress"}>
                    <Progress
                        type="circle"
                        width={25}
                        percent={
                            record?.estimateTime === 0 || null ? 0 : (record?.estimateTime - record?.surplusTime) * 100 / record?.estimateTime
                        }
                        strokeColor={"#1890ff"}  // 进度条颜色
                        strokeWidth={8}          // 加粗线条
                        trailColor={"#d5d5d5"}   // 背景颜色
                        format={(percent) => {
                            return Math.round(percent);  // 只保留整数部分，隐藏圆圈内的百分比符号
                        }}
                        status={"normal"}
                    />
                </div>
            </div>
        },

        {

            title: '负责人',
            dataIndex: ['assigner', 'nickname'],
            key: 'assignerId',
            className: `${sortArray.indexOf("assignerId") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 4
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img" style={{ marginRight: "5px" }}><UserIcon name={text} /></div>
                <div className="work-info-text work-info-master-text" title = {text}>{text}</div>
            </div>
        },
        {
            title: '模块',
            dataIndex: ['module', 'moduleName'],
            key: 'moduleId',
            className: `${sortArray.indexOf("moduleId") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 1
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-text work-info-master-text">{text ? text : "无"}</div>
            </div>
        },
        {
            title: '项目',
            dataIndex: ['project', 'projectName'],
            key: 'project',
            className: `${sortArray.indexOf("project") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 7
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img">
                    <ImgComponent
                        src={record.project?.iconUrl}
                        alt=""
                        className="img-icon-right"
                    />

                </div>
                <div className="work-info-text">{text.length > 10 ? text.slice(0, 10) + "..." : text}</div>
            </div>
        }

    ];
}

/**
 * 大屏屏的事项列表列设置
 */
const lgColumn = (goWorkItemDetail, sortArray, actionColumn) => {
    return [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            className: `work-first-col ${sortArray.indexOf("title") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 1
            },
            render: (text, record, index) => (
                <div className="work-title" title = {text} onClick={() => goWorkItemDetail(record, index)}>
                    <div className="work-icon">
                        <ImgComponent
                            src={record.workTypeSys?.iconUrl}
                            alt=""
                            className="icon-28"
                        />
                    </div>
                    <div className="work-title-content">
                        <div className="work-title-top">
                            {text}
                        </div>
                        <div className="work-title-bottom">
                            <span>{record.code}</span>
                            {/*<span>{record.builder.nickname}</span>*/}
                        </div>
                    </div>

                </div>
            )
        },
        {
            title: '状态',
            dataIndex: ['workStatusNode', 'name'],
            key: 'workStatus',
            className: `${sortArray.indexOf("workStatus") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 2
            },
            render: (text, record) => <div className={`work-status ${setStatuStyle(record.workStatusCode)}`}>
                {text}
            </div>
        },

        {
            title: '优先级',
            dataIndex: ['workPriority', 'name'],
            key: 'workPriority',
            className: `${sortArray.indexOf("workPriority") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 3
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img">
                    <ImgComponent
                        src={record.workPriority?.iconUrl}
                        // isRemote={true}
                        alt=""
                        className="img-icon-right icon-10"
                    />
                </div>
                <div className="work-info-text">{text || "暂无设置"}</div>
            </div>
        },
        {
            title: '负责人',
            dataIndex: ['assigner', 'nickname'],
            key: 'assignerId',
            className: `${sortArray.indexOf("assignerId") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 4
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img" style={{ marginRight: "5px" }}><UserIcon name={text} /></div>
                <div className="work-info-text work-info-master-text" title = {text}>{text}</div>
            </div>
        },
    ];
}

/**
 * 大屏的事项列表列设置
 */
const xxlWorkColumn = (goWorkItemDetail, sortArray, actionColumn) => {
    return [
        {
            title: 'ID',
            dataIndex: 'code',
            key: 'code',
            className: `work-first-col ${sortArray.indexOf("title") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 1
            },
            render: (text, record, index) => (
                <div className="work-id  work-first-col" title = {text} onClick={() => goWorkItemDetail(record, index)}>
                    <div className="work-icon">
                        <ImgComponent
                            src={record.workTypeSys?.iconUrl}
                            alt=""
                            className="icon-18"
                        />
                    </div>
                    <div className="work-key">
                        {record.code}
                    </div>
                </div>
            )
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            className: `${sortArray.indexOf("title") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 1
            },
            render: (text, record, index) => (
                <div className="work-title " title = {text} onClick={() => goWorkItemDetail(record, index)}>
                    {text}
                </div>
            )
        },
        {
            title: '状态',
            dataIndex: ['workStatusNode', 'name'],
            key: 'workStatus',
            className: `${sortArray.indexOf("workStatus") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 2
            },
            render: (text, record) => <div className={`work-status ${setStatuStyle(record.workStatusCode)}`}>
                {text}
            </div>
        },
        {
            title: '优先级',
            dataIndex: ['workPriority', 'name'],
            key: 'workPriority',
            className: `${sortArray.indexOf("workPriority") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 3
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img">
                    <ImgComponent
                        src={record.workPriority?.iconUrl}
                        // isRemote={true}
                        alt=""
                        className="img-icon-right icon-10"
                    />
                </div>
                <div className="work-info-text">{text || "暂无设置"}</div>
            </div>
        },
        {
            title: '进度',
            dataIndex: 'estimateTime',
            key: 'estimateTime',

            className: `${sortArray.indexOf("estimateTime") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            render: (text, record) =><div className={`work-info`}>
                <div className={"table-progress"}>
                    <Progress
                        type="circle"
                        width={25}
                        percent={
                            record?.estimateTime === 0 || null ? 0 : (record?.estimateTime - record?.surplusTime) * 100 / record?.estimateTime
                        }
                        strokeColor={"#1890ff"}  // 进度条颜色
                        strokeWidth={8}          // 加粗线条
                        trailColor={"#d5d5d5"}   // 背景颜色
                        format={(percent) => {
                            return Math.round(percent);  // 只保留整数部分，隐藏圆圈内的百分比符号
                        }}
                        status={"normal"}
                    />
                </div>
            </div>
        },

        {
            title: '负责人',
            dataIndex: ['assigner', 'nickname'],
            key: 'assignerId',
            className: `${sortArray.indexOf("assignerId") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 4
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img" style={{ marginRight: "5px" }}><UserIcon name={text} /></div>
                <div className="work-info-text work-info-master-text" title = {text}>{text}</div>
            </div>
        },
        {
            title: '创建时间',
            dataIndex: "buildTime",
            key: 'buildTime',
            className: `${sortArray.indexOf("buildTime") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 6
            },
            render: (text, record) => <div className="work-info-text">
                {text.slice(0, 10)}
            </div>
        },
        actionColumn

    ];
}

/**
 * 小屏的事项列表列设置
 */
const lgWorkColumn = (goWorkItemDetail, sortArray, actionColumn) => {
    return [
        {
            title: 'ID',
            dataIndex: 'code',
            key: 'code',
            className: `work-first-col ${sortArray.indexOf("title") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 1
            },
            render: (text, record, index) => (
                <div className="work-id work-first-col " title = {text} onClick={() => goWorkItemDetail(record, index)}>
                    <div className="work-icon">
                        <ImgComponent
                            src={record.workTypeSys?.iconUrl}
                            alt=""
                            className="icon-18"
                        />
                    </div>
                    <div className="work-key">
                        {text}
                    </div>
                </div>
            )
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            className: `${sortArray.indexOf("title") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 1
            },
            render: (text, record, index) => (
                <div className="work-title " title = {text} onClick={() => goWorkItemDetail(record, index)}>
                    {text}
                </div>
            )
        },
        {
            title: '状态',
            dataIndex: ['workStatusNode', 'name'],
            key: 'workStatus',
            className: `${sortArray.indexOf("workStatus") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 2
            },
            render: (text, record) => <div className={`work-status ${setStatuStyle(record.workStatusCode)}`}>
                {text}
            </div>
        },
        {
            title: '优先级',
            dataIndex: ['workPriority', 'name'],
            key: 'workPriority',
            className: `${sortArray.indexOf("workPriority") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 3
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img">
                    <ImgComponent
                        src={record.workPriority?.iconUrl}
                        // isRemote={true}
                        alt=""
                        className="img-icon-right icon-10"
                    />
                </div>
                <div className="work-info-text">{text || "暂无设置"}</div>
            </div>
        },
        {
            title: '负责人',
            dataIndex: ['assigner', 'nickname'],
            key: 'assignerId',
            className: `${sortArray.indexOf("assignerId") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 4
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img" style={{ marginRight: "5px" }}><UserIcon name={text} /></div>
                <div className="work-info-text work-info-master-text" title = {text}>{text}</div>
            </div>
        },

        {
            title: '创建时间',
            dataIndex: "buildTime",
            key: 'buildTime',
            className: `${sortArray.indexOf("buildTime") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 6
            },
            render: (text, record) => <div className="work-info-text">
                {text.slice(0, 10)}
            </div>
        },
        actionColumn
    ];
}

/**
 * 设置全局事项页面的列
 * @param {屏幕尺寸} screenSize 
 * @param {跳转事项详情} goWorkItemDetail 
 * @param {排序} sortArray 
 * @param {操作列} actionColumn 
 * @returns 
 */
const getColumn = (screenSize, goWorkItemDetail, sortArray, actionColumn) => {
    if (screenSize === "xxl") {
        return xxlColumn(goWorkItemDetail, sortArray, actionColumn);
    } else {
        return lgColumn(goWorkItemDetail, sortArray, actionColumn)
    }
}

/**
 * 设置项目内事项页面的列
 * @param {屏幕尺寸} screenSize 
 * @param {跳转事项详情} goWorkItemDetail 
 * @param {排序} sortArray 
 * @param {操作列} actionColumn 
 * @returns 
 */
const getWorkColumn = (screenSize, goWorkItemDetail, sortArray, actionColumn) => {
    if (screenSize === "xxl") {
        return xxlWorkColumn(goWorkItemDetail, sortArray, actionColumn);
    } else {
        return lgWorkColumn(goWorkItemDetail, sortArray, actionColumn)
    }
}


export { getColumn, getWorkColumn };


