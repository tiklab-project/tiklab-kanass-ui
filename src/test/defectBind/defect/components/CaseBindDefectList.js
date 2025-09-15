import React, {useEffect, useState} from "react";
import {Empty, message, Popconfirm, Space, Table, Dropdown, Menu} from "antd";
import {observer} from "mobx-react";
import IconCommon from "../../../../common/caseCommon/IconCommon";
import "./workItemStyle.scss"
import workItemBindStore from "../store/WorkItemBindStore";
import DefectSelect from "./DefectSelectDrawer";
import PaginationCommon from "../../../../common/caseCommon/pagination/Page";
import WorkAddModel from "../../workItemDefectAdd/WorkAddModel";
import WorkDetailDrawer from "../../workItemInfo/WorkDetailDrawer";
import {EllipsisOutlined, DeleteOutlined, LinkOutlined, DisconnectOutlined} from "@ant-design/icons";
import workStore from "../../workItemDefectAdd/WorkStore";
import {toWorkItem} from "../../common/util/workItemCommonFn";
import {deleteWorkTestCaseFn} from "../../../testcase/components/testCaseTableFn";
import ImgComponent from "../../../../common/imgComponent/ImgComponent";
import testPlanDetailStore from "../../../testplan/plan/store/testPlanDetailStore";


/**
 * 绑定的缺陷列表
 */
const CaseBindDefectList = (props) =>{
    const {caseId,notShow,testPlanId,startTime,endTime,inDetail} = props;
    const {findWorkItemBindPage,workItemBindList,deleteWorkItemBind} = workItemBindStore
    const {deleteWork} = workStore
    const {findBindTestCaseList} = testPlanDetailStore

    const setStatuStyle = (id) => {
        let name;
        switch (id) {
            case "todo":
                name = "work-status-todo";
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

    //列表头
    const columns = [
        {
            title:`缺陷名称`,
            dataIndex: ["workItem","title"],
            key: "name",
            ellipsis:true,
            width: "35%",
            render:(text,record)=> (
                <WorkDetailDrawer
                    workItemId={record.workItem?.id}
                    name={text}
                    projectId={record.workItem?.projectId}
                    findPage={findPage}
                />
            )
        },
        // {
        //     title: `计划名称`,
        //     dataIndex: ["testPlan","name"],
        //     key: "testPlan",
        //     ellipsis:true,
        //     width: "20%",
        //     render:(text,record)=>(
        //         <>
        //             {
        //                 record.testPlan
        //                     ? <span>{record.testPlan.name}</span>
        //                     : <span style={{color:"#999"}}>---</span>
        //             }
        //         </>
        //     )
        // },
        {
            title: `状态`,
            dataIndex: ["workItem","workStatusNode","name"],
            key: "status",
            width: "10%",
            render:(text,record)=>(
                <div className={`work-status ${setStatuStyle(record.workItem.workStatusNode.id)}`}>
                    {text}
                </div>
            )
        },
        {
            title: `优先级`,
            dataIndex: ["workItem","workPriority","name"],
            key: "priority",
            width: "10%",
            render:(text,record)=>(
                <>
                    <div style={{display:"flex",alignItems:"center"}}>
                        <ImgComponent
                            src={record.workItem.workPriority?.iconUrl}
                            alt=""
                            // isRemote={true}
                            className="img-icon-right"
                        />
                        <div className="work-info-text">{text || "暂无设置"}</div>
                    </div>
                </>
            )
        },
        {
            title: `创建时间`,
            dataIndex: "createTime",
            key: "createTime",
            ellipsis:true,
            width: "15%",
        },

    ]

    const actionColumn = {
        title: `操作`,
        key: "action",
        width:"10%",
        render: (text, record) => {
            const menu = (
                <Menu>
                    <Menu.Item key="unbind" icon={<DisconnectOutlined />}>
                        <Popconfirm
                            title="确定解绑该缺陷？"
                            onConfirm={() => {
                                deleteWorkItemBind(record.id).then(() => {
                                    findPage()
                                }
                                // findWorkItemBindPage({
                                //     // caseId: caseId,
                                //     // testPlanId: testPlanId
                                //     // 暂时不考虑一个用例对应多个计划的关系
                                // })
                                )
                                deleteWorkTestCaseFn(caseId, record.workItem?.id)
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
                                // await deleteWorkTestCaseFn(caseId, record.workItem?.id)
                                findPage()
                                // await findWorkItemBindPage({
                                //     caseId: caseId,
                                //     // testPlanId: testPlanId
                                //     // 暂时不考虑一个用例对应多个计划的关系
                                // })
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
    };


    const [tableLoading,setTableLoading] = useState(true);
    const [totalPage, setTotalPage] = useState();
    const [totalRecord, setTotalRecord] = useState();
    const [pageSize] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [testCaseIdList, setTestCaseIdList] = useState()

    useEffect(async ()=>{
        if (!caseId){
            findBindTestCaseList({testPlanId: testPlanId}).then(res => {
                console.log("testPlanRes:   ",res)
                let idList = [];
                res.map(item => {
                    idList.push(item.id)
                })
                setTestCaseIdList(idList)
                findPage({caseIds: idList})
            })
        }else {
            const idList = [];
            idList.push(caseId);
            setTestCaseIdList(idList)
            findPage({caseIds: idList})
        }

    },[])


    const findPage = (params) =>{
        setTableLoading(true)
        let param = {
            pageParam: {
                pageSize: pageSize,
                currentPage:1
            },
            startTime:startTime,
            endTime:endTime,
            caseIds:testCaseIdList,
            // caseId:caseId,
            // testPlanId:testPlanId,
            // 暂时不考虑一个用例对应多个计划的关系
            ...params
        }
        findWorkItemBindPage(param).then((res)=>{
            setTotalPage(res.totalPage);
            setTotalRecord(res.totalRecord)
            // setDataList(res.dataList)
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
            {/*{*/}
            {/*    inDetail &&*/}
            {/*    <div className={"title-bold"}>*/}
            {/*        关联缺陷*/}
            {/*    </div>*/}
            {/*}*/}
            <div style={{padding: "0 0 20px"}}>

                {
                    notShow
                        ? null
                        : <div className={"display-flex-between"} style={{margin: "10px 5px"}}>
                            <div className={"list-size-title"}>共{workItemBindList.length}个</div>

                            <Space>
                                <WorkAddModel
                                    caseId={caseId}
                                    testPlanId={testPlanId}
                                    inDetail={inDetail}
                                />

                                <DefectSelect
                                    caseId={caseId}
                                    testPlanId={testPlanId}
                                    inDetail={inDetail}
                                />
                            </Space>
                        </div>
                }

                <div className={"table-list-box"} style={{margin: "16px 0"}}>
                    <Table
                        className={`${inDetail ? 'case-bind-table-list':'tablelist'}`}
                        columns={notShow ? columns : [...columns, actionColumn]}
                        dataSource={workItemBindList}
                        rowKey={record => record.id}
                        loading={tableLoading}
                        pagination={false}
                        locale={{
                            emptyText: inDetail ? <div style={{height: 100}}/>
                                :<Empty
                                    imageStyle={{height: 100}}
                                    description={<span>暂无数据</span>}
                                />
                        }}
                    />
                </div>
                {/*<PaginationCommon*/}
                {/*    currentPage={currentPage}*/}
                {/*    totalPage={totalPage}*/}
                {/*    changePage={onTableChange}*/}
                {/*    totalRecord={totalRecord}*/}
                {/*    findPage={findPage}*/}
                {/*/>*/}
            </div>
        </>
    )
}

export default observer(CaseBindDefectList);