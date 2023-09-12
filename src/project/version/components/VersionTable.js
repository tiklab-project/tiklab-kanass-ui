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

const { RangePicker } = DatePicker;

const VersionTable = (props) => {
    const store = {
        versionStore: VersionStore
    }
    const { versionList, getVersionList, deleVersion, createRecent, 
        findVersionFocusList, createVersionFocus, deleteVersionFocus, findFocusVersionList } = VersionStore;
    const project = JSON.parse(localStorage.getItem("project"));
    // 项目id
    const projectId = props.match.params.id;
    // tab的key
    const [activeTabs, setActiveTabs] = useState("pending")
    const userId = getUser().userId;
    // 初始化
    useEffect(() => {
        const params = {
            masterId: userId,
            projectId: projectId
        }
        getFocusVersion(params)
        findVersion({ projectId: projectId })
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

        props.history.push(`/index/projectDetail/${projectId}/versionDetail/${id}`)
    }

    const statusName = {
        "0": "未开始",
        "1": "进行中",
        "2": "已结束"
    }

    /**
    * 获取关注的迭代列表
    */
    const getFocusVersion = (params) => {
        findVersionFocusList(params).then(data => {
            if (data.code === 0) {
                let list = []
                if (data.data.length > 0) {
                    data.data.map(item => {
                        list.push(item.version.id)
                    })
                }
                setFocusVersionList([...list])
            }
        })
    }

     /**
     * 添加关注的迭代
     * @param {迭代id} versionId 
     */
     const addFocusVersion = (versionId) => {
        const params = {
            version: {id: versionId},
            masterId: userId,
            projectId: projectId
        }
        createVersionFocus(params).then(data => {
            if (data.code === 0) {
                focusVersionList.push(versionId)
                setFocusVersionList([...focusVersionList])
            }
        })
    }

     /**
     * 取消关注
     * @param {迭代id} versionId 
     */
     const deleteFocusVersion = (versionId) => {
        const params = {
            version: {id: versionId},
            masterId: userId,
            projectId: projectId
        }
        deleteVersionFocus(params).then(data => {
            if (data.code === 0) {
                const index = focusVersionList.indexOf(versionId);
                if (index > -1) {
                    focusVersionList.splice(index, 1);
                }
                setFocusVersionList([...focusVersionList])
            }
        })
    }


    // 列表的列
    const columns = [
        {
            title: "版本名称",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <>

                    <span className="version-name" onClick={() => goDetail(record.id, text)}>{text}</span>
                </>

            ),
        },
        {
            title: "所属项目",
            dataIndex: ["project", "projectName"],
            key: "project.projectName",
            render: (text) => <span>{text}</span>,
        },

        {
            title: "开始日期",
            dataIndex: "startTime",
            key: "versionTime",
            align: "left",
        },
        {
            title: "发布日期",
            dataIndex: "startTime",
            key: "startTime",
            align: "left",

        },
        {
            title: "实际发布日期",
            dataIndex: "relaPublishDate",
            key: "relaPublishDate",
            align: "left",
            render: (text) => <span>{text ? text : "---"}</span>,
        },
        {
            title: "状态",
            dataIndex: "versionState",
            key: "versionTime",
            align: "left",
            render: (text) => <span>{statusName[text]}</span>,
        },
        {
            title: "操作",
            key: "action",
            width: "100px",
            render: (text, record) => (
                <Space size="middle">
                    {
                        focusVersionList.indexOf(record.id) !== -1 ?
                            <svg className="svg-icon" aria-hidden="true" onClick={() => deleteFocusVersion(record.id)}>
                                <use xlinkHref="#icon-view"></use>
                            </svg>
                            :
                            <svg className="svg-icon" aria-hidden="true" onClick={() => addFocusVersion(record.id)}>
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
    const selectTabs = (key) => {
        setActiveTabs(key)
        // setFilterType(key)
        switch (key) {
            case "pending":
                getVersionList({ projectId: projectId, versionState: "1" });
                break;
            case "creating":
                getVersionList({ projectId: projectId, versionState: "0" });
                break;
            case "ending":
                getVersionList({ projectId: projectId, versionState: "2" });
                break;
            case "all":
                getVersionList({ projectId: projectId, versionState: null });
                break;
            case "focus":
                findFocusVersionList({ projectId: projectId, master: userId });
                break;

            default:
                break;
        }
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
                                            onClick={() => selectTabs(item.key)}
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
                                    pagination={false}

                                    loading={loading}
                                    onSearch={onSearch}
                                    onChange={false}
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
