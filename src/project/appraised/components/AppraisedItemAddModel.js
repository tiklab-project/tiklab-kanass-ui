import React, {useEffect, useState} from "react";
import {Form, Input, Modal, Select, Row, Col, Table, Tooltip, Space, Empty} from "antd";
import Button from "../../../common/button/Button";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import UserIcon from "../../../common/UserIcon/UserIcon";
import WorkTypeTab from "../../../work/components/WorkTypeTab";
import WorkTableFilter from "../../../work/components/WorkTableFilter";
import InputSearch from "../../../common/input/InputSearch";
import "./AppraisedItemAddModel.scss"
import {inject, observer} from "mobx-react";
import IconCommon from "../../../common/caseCommon/IconCommon";
const AppraisedItemAddModel = (props) => {

    const {showAddModel ,setShowAddModel, appraisedItemStore, projectId, appraisedId, searchTable, appraisedStores } = props
    const { searchCanConnectWorkItem, canConnectItemList, canConnectSearchCondition,
        total,createAppraisedItem, appraisedItemList,
        searchCanConnectTestCase, searchCanConnectDocument
    } = appraisedItemStore
    const { searchAppraisedById } = appraisedStores;

    const [tableList, setTableList] = useState();
    const [appraised, setAppraised] = useState();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const handleOk = () => {
        // console.log("绑定")
        setShowAddModel(false);
    }

    // 初始化
    useEffect(async () => {

        if (showAddModel){
            setSelectedRowKeys([]);
            const res = await searchAppraisedById(appraisedId)
            if (res.code === 0){
                setAppraised(res.data);
            }
            searchModalTable(res.data);
        }
        return;
    }, [showAddModel]);

    const handleCancel = () => {
        // form.resetFields();
        setShowAddModel(false);
    }

    const workItemColumns = [
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

    const documentColumns = [
        {
            title: '标题',
            dataIndex: ["kanassDocument","documentName"],
            key: 'documentName',
            width: "20%",
            render: (text, record, index) => <Space >
                <IconCommon icon={"file"} className={"menu-icon"} />
                <div className="appraised-key">{record?.kanassDocument.documentName}</div>
            </Space>
        },
        {
            title: '知识库',
            dataIndex: ["kanassDocument","kanassRepositoryName"],
            key: 'title',
            render: (text, record) => <Tooltip title={text}>
                {text.length > 15 ? text.substring(0, 15) + "..." : text}
            </Tooltip>
        },
        {
            title: '作者',
            dataIndex: ["kanassDocument","userName"],
            key: 'userName',
            render: (text, record) => <Space>
                <UserIcon name={record.kanassDocument?.userName} />
                {record.kanassDocument?.userName}
            </Space>
        },
        {
            title: '创建时间',
            dataIndex: ["kanassDocument","createTime"],
            key: 'createTime',
            render: (text, record) => <div className="appraised-info-text">
                {text.slice(0, 10)}
            </div>
        },
    ];

    const testCaseColumns = [
        {
            title: '序号',
            dataIndex: 'caseKey',
            key: 'caseKey',
            width: "20%",
            render: (text, record, index) => <Space >
                <IconCommon icon={"gongneng1"} className={"menu-icon"} />
                <div className="appraised-key">{record.caseKey}</div>
            </Space>
        },
        {
            title: '标题',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <Tooltip title={text}>
                {text.length > 15 ? text.substring(0, 15) + "..." : text}
            </Tooltip>
        },
        {
            title: '用例类型',
            dataIndex: 'caseType',
            key: 'caseType',
            render: (text, record) => <Space >
                {"功能用例"}
            </Space>
        },
        {
            title: '创建人',
            dataIndex: ["createUser", "name"],
            key: 'createUser',
            render: (text, record) => <Space>
                <UserIcon userInfo={record.createUser?.id} name={record.createUser?.nickname} />
                {record.createUser?.nickname}
            </Space>
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
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
            targetIds: selectedRowKeys,
            appraisedType: {
                id: appraised?.appraisedType.id
            }
        }
        createAppraisedItem(value).then(res => {
            searchModalTable(appraised, {});
            setShowAddModel(false);
            searchTable();
        });
    }

    const searchModalTable = (appraised, value) => {

        const param = { projectId: projectId, appraisedId: appraisedId, ...value }
        console.log("appraised:      --------",appraised)
        switch (appraised?.appraisedType.id){
            case "000000":
                searchCanConnectWorkItem(param).then(res => {
                    setTableList(res.data.dataList);
                })
                break;
            case "111111":
                searchCanConnectTestCase(param).then(res => {
                    setTableList(res.data.dataList);
                })
                break;
            case "222222":
            case "333333":
                searchCanConnectDocument(param).then(res => {
                    setTableList(res.data.dataList);
                })
                break;
        }


    }

    const changePage = (page, pageSize) => {
        const values = {
            pageParam: {
                pageSize: 5,
                currentPage: page,
            }
        }
        searchModalTable(appraised, values);
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

    // 表格列
    const getTableColumn = () => {
        switch (appraised?.appraisedType.id) {
            case "000000" :return workItemColumns;
            case "111111" :return testCaseColumns;
            case "222222" :
            case "333333" :return documentColumns;
        }
    }
    return (
        <Modal
            title={`${appraised?.appraisedType.name}`}
            visible={showAddModel}
            width={1000}
            height={450}
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
            <div className="work-add-page">
                        <div className="appraised-filter">
                            {/*<div className="appraised-tabs">*/}
                            {/*    <p>关联需求</p>*/}
                            {/*</div>*/}
                            <div className="appraised-filter-right">
                                <InputSearch
                                    placeholder="搜索需求"
                                    allowClear
                                    style={{ width: 200 }}
                                    onChange={onSearch}
                                />
                            </div>
                        </div>
                        <div className="work-add-page-content">
                            <div className="work-add-table">
                                <Table
                                    className={"appraised-table-box"}
                                    columns={getTableColumn()}
                                    rowSelection={rowSelection}
                                    dataSource={canConnectItemList}
                                    rowKey={(record) => record.id}
                                    pagination={{
                                        total: total,
                                        pageSize: canConnectSearchCondition?.pageParam?.pageSize,
                                        current: canConnectSearchCondition?.pageParam?.currentPage,
                                        onChange: changePage,
                                        position: ["bottomCenter"],
                                        hideOnSinglePage: true,
                                        simple: true
                                    }}
                                    onSearch={onSearch}
                                    scroll={{ x: "100%" }}
                                    locale={{
                                        emptyText: <Empty
                                            imageStyle={{height: 100}}
                                            description={<span>暂无数据</span>}
                                        />
                                    }}
                                >
                                </Table>
                            </div>
                            <div className="work-add-button">
                                <Button type="primary" onClick={() => onFinish()}>创建</Button>
                                <Button onClick={() => handleCancel()}>取消</Button>
                            </div>
                        </div>
                    </div>
        </Modal>
    )
}
export default inject("appraisedItemStore", "appraisedStores")(observer(AppraisedItemAddModel));