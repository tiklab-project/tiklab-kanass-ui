import React, { Fragment, useEffect, useState } from "react";
import { Input, Table, Space, Modal, message, Popconfirm, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import Button from "../../../common/button/Button";

import "../components/insightList.scss";
import InsightAddModal from "../components/insightAddModal";
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const InsightList = (props) => {
    const { insightStore } = props;
    const { findInsightList, deleteInsight } = insightStore;
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

    // const delInsight = (id)=> {
    //     const params = new FormData();
    //     params.append("id", id)
    //     deleteInsight(params).then(res => {
    //         if (res.code === 0) {
    //             message.info("删除成功")
    //             getInsightList()
    //         }
    //     })
    // }

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
                    {/* <Popconfirm
                        title="Are you sure to delete this task?"
                        onConfirm={confirm}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    > */}
                        <svg className="svg-icon" aria-hidden="true" onClick={() => delInsight(record.id)} style={{ cursor: "pointer", marginRight: "16px" }}>
                            <use xlinkHref="#icon-delete"></use>
                        </svg>
                    {/* </Popconfirm> */}

                    {/* <span className="action-botton" onClick={() => props.history.push(`/index/insight/viewInsight/${record.id}`)}>查看</span>
                    <span className="action-botton" onClick={() => goEditInsight(record.id)}>编辑</span>
                    <span className="action-delete" onClick={() => delInsight(record.id)}>删除</span> */}
                </Space>
            )
        }
    ];


    return (
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
                <div className="table-box">
                    <Table
                        columns={columns}
                        dataSource={insightList}
                        rowKey={record => record.id}
                        // onChange={handleTableChange}
                        pagination={false}
                    />
                </div>
            </div>
            {/* </Col> */}
        </div>
    )
}
export default withRouter(inject("insightStore")(observer(InsightList)));