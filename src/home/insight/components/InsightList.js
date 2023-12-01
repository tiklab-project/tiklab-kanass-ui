/*
 * @Descripttion: 仪表盘列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { useEffect, useState } from "react";
import { Input, Table, Space, Modal, message, Col, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { observer, Provider } from "mobx-react";
import { withRouter } from "react-router-dom";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import Button from "../../../common/button/Button";

import "../components/insightList.scss";
import InsightAddModal from "./InsightAddModal";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import InsightStore from "../store/InsightStore";
import InputSearch from "../../../common/input/InputSearch";
import { getUser } from "tiklab-core-ui";
const { confirm } = Modal;

const InsightList = (props) => {
    const store = {
        insightStore: InsightStore
    }
    const { findInsightList, deleteInsight, createRecent, findRecentInsightList, insightList,
        focusInsightList, findInsightFocusList, createInsightFocus, deleteInsightFocusByQuery, findFocusInsightList } = InsightStore;
    const [visible, setVisible] = useState(false);
    const [activeTabs, setActiveTabs] = useState("1")

    const insightTab = [
        {
            title: '所有仪表盘',
            key: '1',
            icon: "insight"
        },
        {
            title: '最近浏览',
            key: '2',
            icon: "insightrencent"
        },
        {
            title: '我创建',
            key: '3',
            icon: "insightbuild"
        },
        {
            title: '我关注',
            key: '4',
            icon: "insightconcern"
        }
    ]


    const goEditInsight = (id) => {
        props.history.push(`/index/insight/newInsight/${id}`)
    }

    const delInsight = (id) => {
        confirm({
            title: '确定删除仪表盘?',
            icon: <ExclamationCircleOutlined />,
            className: "insight-delete-modal",
            onOk() {
                const params = new FormData();
                params.append("id", id)
                deleteInsight(params).then(res => {
                    if (res.code === 0) {
                        message.info("删除成功")
                        findInsightList()
                    }
                })
            },

            onCancel() {
                console.log('Cancel');
            },
        });
    }
    const userId = getUser().userId
    useEffect(() => {
        findInsightList()
        findInsightFocusList({ masterId: userId })
        return;
    }, [])

    const addPanel = () => {
        setVisible(true)
    }
    const goInsightDetail = (record) => {
        // 创建最近查看仪表盘
        const params = {
            name: record.insightName,
            model: "insight",
            modelId: record.id
        }
        createRecent(params)
        props.history.push(`/index/insight/viewInsight/${record.id}`)
    }

    const selectTabs = (key) => {
        setActiveTabs(key)
        switch (key) {
            case "1":
                findInsightList()
                break;
            case "2":
                findRecentInsightList()
                break;
            case "3":
                findInsightList({ master: userId })
                break;
            case "4":
                findFocusInsightList({ master: userId });
                break
            default:
                break;
        }
    }

    const onSearch = value => {
        console.log(value)
        switch (activeTabs) {
            case "1":
                findInsightList({ insightName: value })
                break;
            case "2":
                findRecentInsightList({ insightName: value })
                break;
            case "3":
                findInsightList({ master: userId, insightName: value })
                break;
            case "4":
                findFocusInsightList({ master: userId, insightName: value });
                break
            default:
                break;
        }
    };

    const deleteFocusInsight = (id) => {
        const value = {
            insightId: id,
            masterId: userId
        }
        deleteInsightFocusByQuery(value).then(res => {
            if (res.code === 0) {
                findInsightFocusList({ masterId: userId })
            }
        })
    }

    const addFocusInsight = (id) => {
        const value = {
            insightId: id
        }
        createInsightFocus(value).then(res => {
            if (res.code === 0) {
                findInsightFocusList({ masterId: userId })
            }
        })
    }
    const columns = [
        {
            title: "仪表盘名称",
            dataIndex: "insightName",
            key: "insightName",
            align: "left",
            render: (text, record) => <span className="insight-name" onClick={() => goInsightDetail(record)}>
                {text}
            </span>,
        },
        {
            title: "创建人",
            dataIndex: ["master", "name"],
            key: "master",
            align: "left",
        },
        {
            title: "创建时间",
            dataIndex: "createdTime",
            key: "createdTime",
            align: "left"

        },
        {
            title: "操作",
            dataIndex: "action",
            key: "action",
            align: "left",
            width: "100px",
            render: (text, record) => (
                <Space size="middle">
                    <svg className="svg-icon" aria-hidden="true" onClick={() => goEditInsight(record.id)} style={{ cursor: "pointer", marginRight: "16px" }}>
                        <use xlinkHref="#icon-edit"></use>
                    </svg>
                    <svg className="svg-icon" aria-hidden="true" onClick={() => delInsight(record.id)} style={{ cursor: "pointer", marginRight: "16px" }}>
                        <use xlinkHref="#icon-delete"></use>
                    </svg>
                    <div className="project-icon">
                        {
                            focusInsightList.indexOf(record.id) !== -1 ?
                                <svg className="svg-icon" aria-hidden="true" onClick={() => deleteFocusInsight(record.id)}>
                                    <use xlinkHref="#icon-view"></use>
                                </svg>
                                :
                                <svg className="svg-icon" aria-hidden="true" onClick={() => addFocusInsight(record.id)}>
                                    <use xlinkHref="#icon-noview"></use>
                                </svg>
                        }

                    </div>
                </Space>
            )
        }
    ];


    return (
        <Provider {...store}>
            <Row className="insight-list-row">
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                    <div>
                        {/* <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}> */}
                        <div className="insight-list">
                            <Breadcumb firstText="仪表盘">
                                <Button type="primary" onClick={() => addPanel()}>
                                    添加仪表盘
                                </Button>
                            </Breadcumb>
                            <div className="insight-tabs-search">
                                <div className="insight-tabs">
                                    {
                                        insightTab.map(item => {
                                            return <div
                                                className={`insight-tab ${activeTabs === item.key ? "active-tabs" : ""}`}
                                                key={item.key}
                                                onClick={() => selectTabs(item.key)}
                                            >
                                                {item.title}
                                            </div>
                                        })
                                    }
                                </div>


                                <div className="search-add">
                                    <InputSearch onChange={(value) => onSearch(value)} placeholder={"仪表盘名字"} />
                                </div>
                            </div>
                            <InsightAddModal setVisible={setVisible} visible={visible} />
                            <div className="insight-table-box">
                                <Table
                                    columns={columns}
                                    dataSource={insightList}
                                    rowKey={record => record.id}
                                    // onChange={handleTableChange}
                                    pagination={false}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

        </Provider>

    )
}
export default withRouter(observer(InsightList));