import {withRouter} from "react-router";
import InputSearch from "../../common/input/InputSearch";
import {SelectItem, SelectSimple} from "../../common/select";
import ImgComponent from "../../common/imgComponent/ImgComponent";
import ProjectEmpty from "../../common/component/ProjectEmpty";
import React, {useEffect, useState} from "react";
import "./WorkProductPlanLinkModal.scss"
import {Modal, Space, Table, Tooltip} from "antd";
import ProductStore from "../../product/product/store/ProductStore";
import UserIcon from "../../common/UserIcon/UserIcon";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {searchWorkList} from "./WorkSearch";

const WorkProductPlanLinkModal = (props) => {
    const { workStore, showLinkModal, setShowLinkModal} = props
    const {workStatusList, getWorkStatus, unLinkProductPlanWorkPageCondition, findUnLinkProductPlanWorkPage, unLinkWorkTotal,
        createProductPlanWork, unLinkList, viewType, getWorkConditionPageTree, getWorkConditionPage, setLoading} = workStore;
    const {findProjectList} = ProductStore
    const [projectList, setProjectList] = useState([])
    const [workPage, setWorkPage] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const path = props.match.path;
    const workTypeCode = props.match.params.workTypeCode;
    const productId = props.match.params.productId ? props.match.params.productId : null;
    const productPlanId = props.match.params.productPlanId ? props.match.params.productPlanId : null;

    const handleOk = () => {
        console.log("确定")
        console.log("选中的行数" + selectedRowKeys);
        const value = {
            productPlanId: productPlanId,
            workItemIds: selectedRowKeys
        }
        createProductPlanWork(value).then(res => {
            searchWork()
            if (viewType === "tree") {
                getWorkConditionPageTree().then(res => {
                    setLoading(false)
                })
            }
            if (viewType === "tile") {
                getWorkConditionPage().then(res => {
                    setLoading(false)
                })
            }
        });
        setShowLinkModal(false)
    }

    const handleCancel = () => {
        console.log("取消")
        setShowLinkModal(false)
    }

    useEffect(() => {
        findProjectList({productId: productId}).then(res => {
            setProjectList(res.data)
            const param = {
                projectIds: res.data.map(item => item.id),
                workTypeCode: workTypeCode,
            }
            searchWork(param)
            getWorkStatus()
        })

    }, [workTypeCode]);

    const searchWork = (param) => {
        findUnLinkProductPlanWorkPage(param).then(res => {
            setWorkPage(res.data.dataList)
        })
    }

    /**
     * 根据事项名称搜索未被关联事项
     */
    const searchUnLinkWorkByTitle = (key, value) => {
        setSelectedRowKeys([])
        const params = {
            title: value,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        searchWork(params)
    }

    const searchUnLinkWorkByProject = (key, value) => {
        setSelectedRowKeys([])
        console.log(value)
        if (value.length === 0){
            value = projectList.map(item => item.id)
        }
        const params = {
            projectIds: value,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        searchWork(params)
    }

    const searchUnLinkWorkByStatus = (key, value) => {
        setSelectedRowKeys([])
        const params = {
            workStatusIds: value,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        searchWork(params)
    }

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
                <div className="work-key" style={{color: "var(--tiklab-gray-500)"}}>{record.code}</div>
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
            title: '项目',
            dataIndex: ["project", "projectName"],
            key: 'project',
            render: (text, record) => <Space >
                {text}
            </Space>
        },
        {
            title: '状态',
            dataIndex: 'workStatusNode',
            key: 'workStatusNode',
            render: (text, record) => <div className={`work-status ${setStatuStyle(record.workStatusNode.id)}`}>
                {record.workStatusNode.name}
            </div>
        },
        {
            title: '创建时间',
            dataIndex: 'buildTime',
            key: 'buildTime',
            render: (text, record) => <div className="work-info-text">
                {text.slice(0, 10)}
            </div>
        },
    ];

    const setStatuStyle = (id) => {
        let name;
        switch (id) {
            case "todo":
                name = "work-status-todo";
                break;
            case "progress":
                name = "work-status-process";
                break;
            case "done":
                name = "work-status-done";
                break;
            default:
                name = "work-status-process";
                break;
        }
        return name;
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

    const changePage = (page, pageSize) => {
        const values = {
            pageParam: {
                pageSize: 20,
                currentPage: page,
            }
        }
        searchWork(values)
    }

    return(
        <Modal
            visible={showLinkModal}
            width={730}
            className="work-addmodel"
            destroyOnClose={true}
            onOk={handleOk}
            onCancel={handleCancel}
            cancelText="取消"
            okText="确定"
            title={`关联${workTypeCode === "demand" ? "需求" : "缺陷"}`}
            closable={true}
            maskClosable={false}
        >
            <div className="productPlan-link">
                <div className="productPlan-link-search">
                    <InputSearch style={{ minWidth: "150px", flex: 1 }} onChange={(value) => searchUnLinkWorkByTitle(value)} placeholder={"搜索事项"} />
                    <SelectSimple name="project"
                                  onChange={(value) => searchUnLinkWorkByProject("workTypeIds", value)}
                                  title={"项目"} ismult={true}
                    >
                        {
                            projectList?.map(item => {
                                return <SelectItem
                                    value={item.id}
                                    label={item.projectName}
                                    key={item.id}
                                    color={item.color}
                                />
                            })
                        }
                    </SelectSimple>
                    {
                        workStatusList && workStatusList.length > 0 && <SelectSimple
                            name="workStatus"
                            onChange={(value) => searchUnLinkWorkByStatus("workStatusIds", value)}
                            title={"状态"}
                            ismult={true}
                        >
                            <div className="select-group-title">未开始</div>
                            {
                                workStatusList.map(item => {
                                    if (item.id === "todo") {
                                        return <SelectItem
                                            value={item.id}
                                            label={item.name}
                                            key={item.id}
                                            imgUrl={item.iconUrl}
                                        />
                                    } else {
                                        return <div></div>
                                    }

                                })
                            }
                            <div className="select-group-title">进行中</div>
                            {
                                workStatusList.map(item => {
                                    if (item.id !== "todo" && item.id !== "done" && item.id !== "start") {
                                        return <SelectItem
                                            value={item.id}
                                            label={item.name}
                                            key={item.id}
                                            imgUrl={item.iconUrl}
                                        />
                                    } else {
                                        return <div></div>
                                    }

                                })
                            }


                            <div className="select-group-title">已完成</div>
                            {
                                workStatusList.map(item => {
                                    if (item.id === "done") {
                                        return <SelectItem
                                            value={item.id}
                                            label={item.name}
                                            key={item.id}
                                            imgUrl={item.iconUrl}
                                        />
                                    } else {
                                        return <div></div>
                                    }

                                })
                            }
                        </SelectSimple>
                    }


                </div>
                <div className="productPlan-link-table">
                    {
                        <Table
                            className={"work-table-box"}
                            columns={columns}
                            rowSelection={rowSelection}
                            dataSource={unLinkList}
                            rowKey={(record) => record.id}
                            pagination={{
                                total: unLinkWorkTotal,
                                pageSize: unLinkProductPlanWorkPageCondition?.pageParam?.pageSize,
                                current: unLinkProductPlanWorkPageCondition?.pageParam?.currentPage,
                                onChange: changePage,
                                position: ["bottomCenter"],
                                hideOnSinglePage: false,
                                simple: true
                            }}
                            scroll={{ x: "100%" }}
                        >
                        </Table>
                    }
                </div>
            </div>
        </Modal>
    )
}

export default withRouter(observer(WorkProductPlanLinkModal))