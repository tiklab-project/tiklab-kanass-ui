/*
 * @Descripttion: 版本列表页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-02 13:28:22
 */
import React, { useEffect, useState } from "react";
import { Table, Space, Row, Col, DatePicker } from "antd";
import VersionAddmodal from "./VersionAdd";
import { observer, inject, Provider } from "mobx-react";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import "./versionTable.scss";
import { withRouter } from "react-router";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
// import InputSearch from "../../../common/input/InputSearch";
import VersionStore from "../store/VersionStores";
import InputSearch from '../../../common/input/InputSearch';
import { getUser } from "tiklab-core-ui";
import UserIcon from "../../../common/UserIcon/UserIcon";

const { RangePicker } = DatePicker;

const VersionTable = (props) => {
    const store = {
        versionStore: VersionStore
    }
    const { versionList, setVersionList, getVersionList, deleVersion, createRecent,
        createVersionFocus, deleteVersionFocus,
        findFocusVersionList, userList, getUseList, searchCondition, total } = VersionStore;
    const project = JSON.parse(localStorage.getItem("project"));
    // 项目id
    const projectId = props.match.params.id;
    // tab的key
    const [activeTabs, setActiveTabs] = useState("pending")
    const userId = getUser().userId;
    // 初始化
    useEffect(() => {
        findVersion({ projectId: projectId, versionState: "111111" })
        return;
    }, []);

    // 加载中
    const [loading, setLoading] = useState(false)
    // 获取关注的迭代
    const [focusVersionList, setFocusVersionList] = useState([])
    // 跳转到版本详情
    const goDetail = (id, name) => {
        const params = {
            name: name,
            model: "version",
            modelId: id,
            project: { id: project.id },
            projectType: { id: project.projectType.id },
        }
        createRecent(params)

        props.history.push({ pathname: `/index/${projectId}/versionDetail/${id}/survey` })
        localStorage.setItem("sprintId", id);
    }

    const statusName = {
        "0": "未开始",
        "1": "进行中",
        "2": "已结束"
    }



    /**
    * 添加关注的迭代
    * @param {迭代id} versionId 
    */
    const addFocusVersion = (versionId, index) => {
        const params = {
            version: { id: versionId },
            masterId: userId,
            projectId: projectId
        }
        createVersionFocus(params).then(data => {
            if (data.code === 0) {
                versionList[index].focusIs = true
                setVersionList([...versionList])
                console.log(versionList)
                // focusVersionList.push(versionId)
                // setFocusVersionList([...focusVersionList])
            }
        })
    }

    /**
    * 取消关注
    * @param {迭代id} versionId 
    */
    const deleteFocusVersion = (versionId, index) => {
        const params = {
            version: { id: versionId },
            masterId: userId,
            projectId: projectId
        }
        deleteVersionFocus(params).then(data => {
            if (data.code === 0) {
                versionList[index].focusIs = false
                setVersionList([...versionList])
            }
        })
    }

    const setStatuStyle = (id) => {
        let name;
        switch (id) {
            case "000000":
                name = "version-status-todo";
                break;
            case "111111":
                name = "version-status-process";
                break;
            case "222222":
                name = "version-status-done";
                break;
            default:
                name = "version-status-process";
                break;
        }
        return name;
    }
    // 列表的列
    const columns = [
        {
            title: "版本名称",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <div className="version-master" onClick={() => goDetail(record.id, text)}>
                    <img
                        src={'/images/version.png'}
                        alt=""
                        className="img-icon-right"
                    />
                    <span className="version-name" >{text}</span>
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
            render: (text, record) => <div className="version-master">
                <div style={{ marginRight: "5px" }}><UserIcon name={text} /></div>
                <div >{text}</div>
            </div>
        },

        {
            title: "计划日期",
            dataIndex: "startTime",
            key: "startTime",
            align: "left",
            render: (text, record) => <span>
                {record.startTime} ~ {record.publishDate}
            </span>
        },
        {
            title: "实际发布日期",
            dataIndex: "relaPublishDate",
            key: "relaPublishDate",
            align: "left",
            render: (text) => <span>{text ? text : "---"}</span>,
        },
        {
            title: "事项",
            dataIndex: "workNumber",
            key: "workNumber"
        },
        {
            title: "状态",
            dataIndex: ["versionState", "name"],
            key: "versionTime",
            align: "left",
            render: (text, record) => <div className={`version-status ${setStatuStyle(record.versionState.id)}`}>
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
                            <svg className="svg-icon" aria-hidden="true" onClick={() => deleteFocusVersion(record.id, index)}>
                                <use xlinkHref="#icon-view"></use>
                            </svg>
                            :
                            <svg className="svg-icon" aria-hidden="true" onClick={() => addFocusVersion(record.id, index)}>
                                <use xlinkHref="#icon-noview"></use>
                            </svg>
                    }
                    <PrivilegeProjectButton code={'VersionDelete'} domainId={projectId}  {...props}>
                        <span className="span-botton  delete" onClick={() => deleVersion(record.id)}>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-delete"></use>
                            </svg>
                        </span>
                    </PrivilegeProjectButton>

                </Space>

            ),
        },
    ];



    /**
     * 获取版本列表，带分页
     */
    const findVersion = (value) => {
        setLoading(true)
        getVersionList(value).then((res) => {
            setLoading(false)


        })
    }

    /**
     * 通过名字搜索版本
     * @param {*} values 
     */
    const onSearch = (data) => {
        console.log(data)
        findVersion({ name: data })
        // 重置分页参数，从第一页开始搜索
        // setPageParam({ current: 1, pageSize: 10 })
    };

    /**
    * tab 数组
    */
    const versionTab = [
        {
            title: '全部版本',
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
    const selectTabs = (key, page) => {
        setActiveTabs(key)
        // setFilterType(key)
        const params = {
            projectId: projectId,
            pageParam: {
                pageSize: searchCondition.pageParam.pageSize,
                currentPage: page,
            }
        }
        switch (key) {
            case "pending":
                getVersionList({ versionState: "111111", ...params });
                break;
            case "creating":
                getVersionList({ versionState: "000000", ...params });
                break;
            case "ending":
                getVersionList({ versionState: "222222", ...params });
                break;
            case "all":
                getVersionList({ versionState: null, ...params });
                break;
            case "focus":
                findFocusVersionList({ master: userId, ...params });
                break;

            default:
                break;
        }
    }
    const changePage = (page, pageSize) => {
        console.log(page, pageSize)
        selectTabs(activeTabs, page)
        // const values = {
        //     pageParam: {
        //         pageSize: pageSize,
        //         currentPage: page,
        //     }
        // }
    }
    return (<Provider {...store}>
        <div className="project-version">
            <Row >
                <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                    <div className="project-version-list">

                        <Breadcumb
                            firstText="版本"
                        >
                            <VersionAddmodal
                                name="添加版本"
                                type="add"
                                id="0"
                                findVersion={findVersion}
                                getUseList={getUseList}
                                userList={userList}
                                setActiveTabs = {setActiveTabs}
                                {...props}
                            />
                        </Breadcumb>
                        <div className="version-filter">
                            <div className="version-tabs">
                                {
                                    versionTab.map(item => {
                                        return <div
                                            className={`version-tab ${activeTabs === item.key ? "active-tabs" : ""}`}
                                            key={item.key}
                                            onClick={() => selectTabs(item.key, 1)}
                                        >
                                            {item.title}
                                        </div>
                                    })
                                }
                            </div>
                            <InputSearch
                                placeholder="版本名称"
                                allowClear
                                style={{ width: 300 }}
                                onChange={onSearch}
                            />
                        </div>

                        <div className="project-version-contant">
                            <div className="version-table-box">
                                <Table
                                    columns={columns}
                                    dataSource={versionList}
                                    rowKey={(record) => record.id}
                                    pagination={activeTabs !== "focus" ? {
                                        total: total,
                                        pageSize: searchCondition.pageParam.pageSize,
                                        current: searchCondition.pageParam.currentPage,
                                        onChange: changePage,
                                        position: ["bottomCenter"],
                                        hideOnSinglePage: true,
                                        simple: true
                                    } : false}
                                    loading={loading}
                                    onSearch={onSearch}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    </Provider>


    );
};
export default withRouter(observer(VersionTable));
