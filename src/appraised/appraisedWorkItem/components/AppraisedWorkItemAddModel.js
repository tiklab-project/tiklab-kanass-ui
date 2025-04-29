import React, {useEffect, useState} from "react";
import {Form, Input, Modal, Select, Row, Col, Table, Tooltip, Space} from "antd";
import Button from "../../../common/button/Button";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import UserIcon from "../../../common/UserIcon/UserIcon";
import WorkTypeTab from "../../../work/components/WorkTypeTab";
import WorkTableFilter from "../../../work/components/WorkTableFilter";
import InputSearch from "../../../common/input/InputSearch";
import "./AppraisedWorkItemAddModel.scss"
const AppraisedWorkItemAddModel = (props) => {

    const {showAddModel ,setShowAddModel, appraisedWorkItemStore, projectId, appraisedId, searchTable } = props
    const { searchCanConnectWorkItem, canConnectWorkItemList, workItemSearchCondition, workItemTotal,createAppraisedWorkItem, appraisedWorkItemList } = appraisedWorkItemStore

    const [tableList, setTableList] = useState();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const handleOk = () => {
        // console.log("绑定")
        setShowAddModel(false);
    }

    // 初始化
    useEffect(() => {
        searchModalTable();
        setSelectedRowKeys([]);
        // selectTabs(activeTabs, 1);
        // getUserList(projectId);
        // console.log(JSON.stringify(userList));
        return;
    }, [appraisedWorkItemList]);

    const handleCancel = () => {
        // form.resetFields();
        setShowAddModel(false);
    }
    // const [form] = Form.useForm();

    const columns = [
        {
            title: '序号',
            dataIndex: 'code',
            key: 'code',
            width: "20%",
            render: (text, record, index) => <Space >
                <ImgComponent
                    src={record.workTypeSys?.iconUrl}
                    alt=""
                    className="menu-icon"
                />
                <div className="appraised-key">{record.code}</div>
            </Space>
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => <Tooltip title={text}>
                {text.length > 15 ? text.substring(0, 15) + "..." : text}
            </Tooltip>
        },
        {
            title: '事项类型',
            dataIndex: 'workTypeSys',
            key: 'workTypeSys',
            render: (text, record) => <Space >
                {record.workTypeSys?.name}
            </Space>
        },
        {
            title: '状态',
            dataIndex: 'workStatusNode',
            key: 'workStatusNode',
            render: (text, record) => <div className={`appraised-status ${setStatuStyle(record.workStatusNode.id)}`}>
                {record.workStatusNode.name}
            </div>
        },
        {
            title: '创建人',
            dataIndex: 'assigner',
            key: 'assigner',
            render: (text, record) => <Space>
                <UserIcon userInfo={record.builder?.id} name={record.builder?.nickname} />
                {record.builder?.nickname}
            </Space>
        },
        {
            title: '创建时间',
            dataIndex: 'buildTime',
            key: 'buildTime',
            render: (text, record) => <div className="appraised-info-text">
                {text.slice(0, 10)}
            </div>
        },
    ];

    const setStatuStyle = (id) => {
        let name;
        switch (id) {
            case "todo":
                name = "appraised-status-todo";
                break;
            case "progress":
                name = "appraised-status-process";
                break;
            case "done":
                name = "appraised-status-done";
                break;
            default:
                name = "appraised-status-process";
                break;
        }
        return name;
    }

    const onSearch = (e) => {
        console.log(e.target.value)
    }
    const onFinish = () => {
        console.log("选中的行数" + selectedRowKeys);
        const value = {
            appraised: {
              id: appraisedId
            },
            workItemIds: selectedRowKeys
        }
        createAppraisedWorkItem(value).then(res => {
            searchModalTable();
            setShowAddModel(false);
            searchTable();
        });
    }

    const searchModalTable = (value) => {
        searchCanConnectWorkItem({ projectId: projectId, appraisedId: appraisedId, ...value }).then(res => {
            setTableList(res.data.dataList);
        })
    }

    const changePage = (page, pageSize) => {
        const values = {
            pageParam: {
                pageSize: 5,
                currentPage: page,
            }
        }
        searchModalTable(values);
    }

    // 表格多选框配置
    const rowSelection = {
        type: "checkbox",
        selectedRowKeys, // 当前选中的行键
        onChange: (newSelectedRowKeys, selectedRows) => {
            setSelectedRowKeys(newSelectedRowKeys); // 更新选中的行键
            console.log("Selected Rows:", selectedRows); // 如果需要选中的完整数据，可以使用 selectedRows
        },
    };

    return (
        <Modal
            title={"关联事项"}
            visible={showAddModel}
            width={1000}
            className="appraisedWorkItem-addmodel"
            destroyOnClose={true}
            onOk={handleOk}
            onCancel={handleCancel}
            cancelText="取消"
            okText="确定"
            closable={false}
            footer={null}
            maskClosable={false}
        >
            <Row >
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "20", offset: "2" }} xxl={{ span: "18", offset: "3" }}>
                    <div className="work-add-page">
                        <div className="appraised-filter">
                            <div className="appraised-tabs">
                                {/*<WorkTypeTab*/}
                                {/*    workStore={WorkStore}*/}
                                {/*    workCalendarStore={WorkCalendarStore}*/}
                                {/*></WorkTypeTab>*/}
                            </div>
                            <div className="appraised-filter-right">
                                <InputSearch
                                    placeholder="搜索事项"
                                    allowClear
                                    style={{ width: 200 }}
                                    onChange={onSearch}
                                />
                            </div>
                        </div>
                        <div className="work-add-page-content">
                            <Table
                                className={"appraised-table-box"}
                                columns={columns}
                                rowSelection={rowSelection}
                                dataSource={canConnectWorkItemList}
                                rowKey={(record) => record.id}
                                pagination={{
                                    total: workItemTotal,
                                    pageSize: workItemSearchCondition?.pageParam?.pageSize,
                                    current: workItemSearchCondition?.pageParam?.currentPage,
                                    onChange: changePage,
                                    position: ["bottomCenter"],
                                    hideOnSinglePage: true,
                                    simple: true
                                }}
                                onSearch={onSearch}
                                scroll={{ x: "100%" }}
                            >

                            </Table>
                            <div className="work-add-button">
                                <Button type="primary" onClick={() => onFinish()}>创建</Button>
                                <Button onClick={() => handleCancel()}>取消</Button>
                            </div>
                        </div>
                    </div>

                </Col>
            </Row>

        </Modal>
    )
}
export default AppraisedWorkItemAddModel;