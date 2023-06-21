/*
 * @Descripttion: 仪表盘列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { Fragment, useEffect, useState } from "react";
import { Input, Table, Space, Modal, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { observer, inject, Provider } from "mobx-react";
import { withRouter } from "react-router-dom";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import Button from "../../../common/button/Button";

import "../components/insightList.scss";
import InsightAddModal from "./insightAddModal";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import InsightStore from "../store/InsightStore"
const { confirm } = Modal;

const InsightList = (props) => {
    const store = {
        insightStore: InsightStore
    }
    const { findInsightList, deleteInsight } = InsightStore;
    const [visible, setVisible] = useState(false);
    const [insightList, setInsightList] = useState();
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
            key: '5',
            icon: "insightconcern"
        }
    ]


    const goEditInsight = (id) => {
        props.history.push(`/index/home/insight/newInsight/${id}`)
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
                        getInsightList()
                    }
                })
            },

            onCancel() {
                console.log('Cancel');
            },
        });
    }

    useEffect(() => {
        getInsightList()
    }, [])

    const getInsightList = () => {
        findInsightList().then(res => {
            if (res.code === 0) {
                setInsightList(res.data)
            }
        })
    }
    const addPanel = () => {
        setVisible(true)
    }
    const onSearch = () => {

    }
    const columns = [
        {
            title: "仪表盘名称",
            dataIndex: "insightName",
            key: "insightName",
            align: "left",
            render: (text, record) => <span className="insight-name" onClick={() => props.history.push(`/index/home/insight/viewInsight/${record.id}`)}>
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
                </Space>
            )
        }
    ];


    return (
        <Provider {...store}>
            <div>
            {/* <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}> */}
            <div className="insight-list">
                <Breadcumb firstText="仪表盘">
                    <Button type="primary" onClick={() => addPanel()}>
                        添加仪表盘
                    </Button>
                </Breadcumb>
                <div className="insight-tabs-search">
                    <div className="insight-filter">
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
                        <div className="vertical-bar" />
                        <Input
                            className="filter-search"
                            placeholder="请输入名字"
                            onChange={(value) => onSearch(value)}
                            suffix={
                                <SearchOutlined
                                    style={{
                                        color: 'rgba(0,0,0,.45)',
                                    }}
                                />
                            }
                        />
                        <div className="vertical-bar" />
                        <span className="project-num">({insightList && insightList.length}仪表盘)</span>

                    </div>

                    <div className="search-add">
                        {/* <Input
                                className="search"
                                onChange={(value) => onSearch(value)}
                                placeholder="请输入项目名字"
                                suffix={
                                    <SearchOutlined
                                        style={{
                                            color: 'rgba(0,0,0,.45)',
                                        }}
                                    />
                                }
                            /> */}

                    </div>
                </div>
                <InsightAddModal setVisible={setVisible} visible={visible} setInsightList={setInsightList} />
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
        </Provider>
        
    )
}
export default withRouter(InsightList);