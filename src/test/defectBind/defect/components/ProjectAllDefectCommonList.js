import React, {useEffect, useState} from "react";
import {Dropdown, Empty, Menu, Popconfirm, Space, Table,message} from "antd";
import { observer} from "mobx-react";
import IconCommon from "../../../../common/IconCommon";
import "./workItemStyle.scss"
import workItemBindStore from "../store/WorkItemBindStore";
import PaginationCommon from "../../../../common/pagination/Page";
import WorkDetailDrawer from "../../workItemInfo/WorkDetailDrawer";
import {DeleteOutlined, EllipsisOutlined, LinkOutlined} from "@ant-design/icons";
import {toWorkItem} from "../../common/util/workItemCommonFn";

/**
 * 绑定的缺陷列表公共组件
 */
const ProjectAllDefectCommonList = (props) =>{
    const {notShowDelete} = props
    const {findWorkItemBindPage,deleteWorkItemBind} = workItemBindStore

    //列表头
    const columns = [
        {
            title:`缺陷名称`,
            dataIndex: ["workItem","title"],
            key: "name",
            width: "20%",
            ellipsis:true,
            render:(text,record)=> (
                <WorkDetailDrawer
                    workItemId={record.workItem?.id}
                    name={text}
                    projectId={record.workItem?.projectId}
                    findPage={findPage}
                />
            )
        },{
            title: `用例名称`,
            dataIndex:["testCase","name"],
            key: "name",
            width: "20%",
            ellipsis:true,
        },
        {
            title: `项目名称`,
            dataIndex:["workItem","project","projectName"],
            key: "projectName",
            width: "20%",
            ellipsis:true,
        },
        {
            title: `状态`,
            dataIndex: ["workItem","workStatusNode","name"],
            key: "status",
            width: "10%",
            ellipsis:true,
        },
        {
            title: `优先级`,
            dataIndex: ["workItem","workPriority","name"],
            key: "priority",
            width: "10%",
            ellipsis:true,
        },
        {
            title: `创建时间`,
            dataIndex: "createTime",
            key: "createTime",
            width: "10%",
            ellipsis:true,
        },
    ]

    let operation = {
        title: `操作`,
        key: "action",
        width:"10%",
        ellipsis:true,
        render: (text, record) => {
            const menu = (
                <Menu>
                    <Menu.Item key="unbind" icon={<LinkOutlined />}>
                        <Popconfirm
                            title="确定解绑该缺陷？"
                            onConfirm={() => {
                                deleteWorkItemBind(record.id).then(() => findWorkItemBindPage({
                                    caseId: caseId,
                                    testPlanId: testPlanId
                                }))
                            }}
                            okText='确定'
                            cancelText='取消'
                        >
                            <span>解绑</span>
                        </Popconfirm>
                    </Menu.Item>
                    <Menu.Item key="delete" icon={<DeleteOutlined />}>
                        <Popconfirm
                            title="确定删除？"
                            onConfirm={async () => {
                                await deleteWorkItemBind(record.id)
                                await deleteWork(record.workItem?.id)
                                await findPage()
                            }}
                            okText='确定'
                            cancelText='取消'
                        >
                            <span>删除</span>
                        </Popconfirm>
                    </Menu.Item>
                </Menu>
            );

            return (
                <Space>
                    <Popconfirm
                        title="确定跳转到Kanass查看？"
                        onConfirm={() => toWorkItem(record)}
                        okText='确定'
                        cancelText='取消'
                        placement={"topLeft"}
                    >
                        <IconCommon icon="dakaixinyemian" className="icon-s edit-icon" />
                    </Popconfirm>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <EllipsisOutlined style={{ cursor: 'pointer', fontSize: '20px' }} />
                    </Dropdown>
                </Space>
            );
        }
    }



    const repositoryId = sessionStorage.getItem("repositoryId")
    const [tableLoading,setTableLoading] = useState(true);
    const [totalPage, setTotalPage] = useState();
    const [totalRecord, setTotalRecord] = useState();
    const [pageSize] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataList, setDataList] = useState([]);

    useEffect(async ()=>{
        findPage()
    },[repositoryId])

    const findPage = (params) =>{
        setTableLoading(true)
        let param = {
            pageParam: {
                pageSize: pageSize,
                currentPage:1
            },
            repositoryId:repositoryId,
            startTime: props.startTime,
            endTime: props.endTime,
            ...params
        }
        findWorkItemBindPage(param).then((res)=>{
            if(!res) {
                message.error("Kanass服务异常")
                return
            }
            setTotalPage(res.totalPage);
            setTotalRecord(res.totalRecord)
            setDataList(res.dataList)
            setTableLoading(false)
        })
    }

    /**
     * 分页
     */
    const onTableChange = (current) => {
        setCurrentPage(current)
        const newParams = {
            pageParam: {
                pageSize: pageSize,
                currentPage: current
            },
        }

        findPage(newParams)
    }

    return(
        <>
            {
                props.startTime &&<div style={{margin:"10px"}}>
                    <div style={{color:"#666"}}>共{totalRecord}条</div>
                </div>
            }
            <div className={"table-list-box"} >
                <Table
                    className="tablelist"
                    columns={notShowDelete  ? columns :[...columns,operation]}
                    dataSource={dataList}
                    rowKey={record => record.id}
                    pagination={false}
                    loading={tableLoading}
                    locale={{
                        emptyText: !tableLoading
                            ?<Empty
                                imageStyle={{height: 100}}
                                description={<span>暂无缺陷</span>}
                            />
                            :<div style={{height: 100}}/>,
                    }}
                />
            </div>
            <PaginationCommon
                currentPage={currentPage}
                totalPage={totalPage}
                changePage={onTableChange}
                totalRecord={totalRecord}
                findPage={findPage}
            />
        </>
    )
}

export default observer(ProjectAllDefectCommonList);