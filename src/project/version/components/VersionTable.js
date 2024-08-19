/*
 * @Descripttion: 版本列表页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-02 13:28:22
 */
import React, { useEffect, useState } from "react";
import { Table, Space, Row, Col, DatePicker, Dropdown, Menu } from "antd";
import VersionAddmodal from "./VersionAdd";
import { observer, inject, Provider } from "mobx-react";
import { PrivilegeProjectButton } from "thoughtware-privilege-ui";
import "./versionTable.scss";
import { withRouter } from "react-router";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import VersionStore from "../store/VersionStores";
import InputSearch from '../../../common/input/InputSearch';
import { getUser } from "thoughtware-core-ui";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import { SelectSimple, SelectItem } from "../../../common/select";
import ColorIcon from "../../../common/colorIcon/ColorIcon"
const VersionTable = (props) => {
    const store = {
        versionStore: VersionStore
    }
    const { versionList, setVersionList, getVersionList, deleVersion, createRecent,
        createVersionFocus, deleteVersionFocus, userList, getUseList, searchCondition,
        total, findAllVersionState } = VersionStore;
    const project = JSON.parse(localStorage.getItem("project"));
    // 项目id
    const projectId = props.match.params.id;
    // tab的key
    const [activeTabs, setActiveTabs] = useState("all");
    const [versionStateList, setVersionStateList] = useState([]);
    const userId = getUser().userId;
    // 初始化
    useEffect(() => {
        // findVersion({ projectId: projectId, versionState: null })
        findAllVersionState().then(res => {
            if (res.code === 0) {
                setVersionStateList(res.data)
            }
        })
        selectTabs(activeTabs, 1)
        return;
    }, []);

    // 加载中
    const [loading, setLoading] = useState(false)
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

        props.history.push({ pathname: `/${projectId}/version/${id}/workitem` })
        localStorage.setItem("sprintId", id);
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
            }
        })
    }

    /**
    * 取消关注
    * @param {迭代id} versionId 
    */
    const deleteFocusVersion = (versionId, index) => {
        const params = {
            versionId: versionId,
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



    const deletVersionList = (id) => {
        deleVersion(id).then(res => {
            if (res.code === 0) {
                selectTabs(activeTabs, 1)
            }
        })
    }

    // 列表的列
    const columns = [
        {
            title: "版本名称",
            dataIndex: "name",
            key: "name",
            width: "25%",
            render: (text, record) => (
                <div className="version-master" onClick={() => goDetail(record.id, text)}>
                    <ColorIcon name={text} className="icon-32" color={record.color} />
                    <span className="version-name" >{text}</span>
                </div>

            ),
        },
        {
            title: "计划日期",
            dataIndex: "startTime",
            key: "startTime",
            align: "left",
            width: "25%",
            render: (text, record) => <span>
                {record.startTime?.slice(0, 10)} ~ {record.publishTime?.slice(0, 10)}
            </span>
        },
        {
            title: "实际发布日期",
            dataIndex: "relaPublishTime",
            key: "relaPublishTime",
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
                    <DeleteModal deleteFunction={deletVersionList} id={record.id} />

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
                pageSize: searchCondition.pageParam.pageSize,
                currentPage: page,
            }
        }
        switch (key) {
            case "all":
                getVersionList({ followersId: null, builderId: null, ...params });
                break;
            case "build":
                getVersionList({ builderId: userId, followersId: null, ...params });
                break;
            case "focus":
                getVersionList({ followersId: userId, builderId: null, ...params });
                break;
            default:
                break;
        }
    }

    const selectVersionState = (value) => {
        console.log(value)
        const params = {
            versionStates: value,
            pageParam: {
                pageSize: searchCondition.pageParam.pageSize,
                currentPage: 1,
            }
        }
        getVersionList(params);
    }

    const changePage = (page, pageSize) => {
        selectTabs(activeTabs, page)
    }
    return (<Provider {...store}>
        <div className="project-version">
            <Row >
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "20", offset: "2" }} xxl={{ span: "18", offset: "3" }}>
                    <div className="project-version-list">

                        <Breadcumb
                            firstText="版本"
                        >
                            <VersionAddmodal
                                name="添加版本"
                                type="add"
                                id="0"
                                // findVersion={findVersion}
                                getUseList={getUseList}
                                userList={userList}
                                setActiveTabs={setActiveTabs}
                                selectTabs={selectTabs}
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
                            <div className="version-filter-right">
                                <InputSearch
                                    placeholder="搜索版本"
                                    allowClear
                                    style={{ width: 200 }}
                                    onChange={onSearch}
                                />
                                <SelectSimple
                                    name="versionState"
                                    onChange={(value) => selectVersionState(value)}
                                    title={"状态"}
                                    ismult={true}
                                    value={searchCondition?.versionState}
                                >
                                    {
                                        versionStateList.map(item => {
                                            return <SelectItem
                                                value={item.id}
                                                label={item.name}
                                                key={item.id}
                                            />
                                        })
                                    }
                                </SelectSimple>

                            </div>

                        </div>

                        <div className="project-version-contant">
                            <div className="version-table-box">
                                <Table
                                    columns={columns}
                                    dataSource={versionList}
                                    rowKey={(record) => record.id}
                                    pagination={{
                                        total: total,
                                        pageSize: searchCondition.pageParam.pageSize,
                                        current: searchCondition.pageParam.currentPage,
                                        onChange: changePage,
                                        position: ["bottomCenter"],
                                        hideOnSinglePage: true,
                                        simple: true
                                    }}
                                    loading={loading}
                                    onSearch={onSearch}
                                    scroll={{x: "100%"}}
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
