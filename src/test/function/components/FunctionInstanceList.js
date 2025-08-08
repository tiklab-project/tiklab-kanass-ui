import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import {Table, Pagination, Space} from "antd";
import functionInstanceStore from "../store/functionInstanceStore";
import {CheckCircleTwoTone, CloseCircleTwoTone, MinusCircleTwoTone} from "@ant-design/icons";
import PaginationCommon from "../../../common/caseCommon/pagination/Page";

const PAGE_SIZE = 10;

const FunctionInstanceList = ({ functionId,testPlanId }) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [pageSize] = useState(5);
    const [totalRecord, setTotalRecord] = useState(1);
    const [totalPage, setTotalPage] = useState();
    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
        findPage(currentPage);
    }, [functionId, currentPage]);

    const findPage = async (page) => {
        setLoading(true);
        const params = {
            functionId,
            testPlanInstanceId:testPlanId,
            pageParam:{
                pageSize: pageSize,
                currentPage: page,
            }
        };
        const data = await functionInstanceStore.findFunctionInstancePage(params);
        if (data) {
            setData(data.dataList);
            setTotalPage(data.totalPage);
            setTotalRecord(data.totalRecord);
        }
        setLoading(false);
    };

    // 分页
    const onTableChange = (current) => {
        setCurrentPage(current)
        let param = {
            pageParam: {
                pageSize: pageSize,
                currentPage:current
            },
        }

        findPage(param)
    }

    const columns = [
        // {
        //     title: '名称',
        //     dataIndex: 'name',
        //     key: 'name',
        //     render: (text, record) => text || record.title || '-',
        // },
        {
            title: '执行人',
            dataIndex: ['createUser',"nickname"],
            key: 'creator',
            width:"20%",
            ellipsis: true,

        },
        {
            title: '执行时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width:"20%",
            ellipsis: true,
        },
        {
            title: '结果',
            dataIndex: 'result',
            key: 'result',
            width:"20%",
            ellipsis: true,
            render: (text, record) => (showResult(record.result)),
        }
    ];

    const resultMap = {
        0: { text: "失败", color: "#ff4d4f", icon: <CloseCircleTwoTone twoToneColor="#ff4d4f" /> },
        1: { text: "成功", color: "#52c41a", icon: <CheckCircleTwoTone twoToneColor="#52c41a" /> },
    };

    // 结果展示
    const showResult = (result) => {
        const item = resultMap[result];
        if (!item) {
            return <Space size={"small"}>
                <MinusCircleTwoTone twoToneColor={"#d3d3d3"}/>
                <span className="font-12">未设置</span>
            </Space>
        }
        return <Space size={"small"}>
            {item.icon}
            <span className="font-12" style={{color: item.color}}>{item.text}</span>
        </Space>
    };


    return (
        <div className={"table-list-box"} style={{marginTop: "10px"}}>
            <div className={"list-size-title"} style={{margin: "6px"}}>共{totalRecord}个</div>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={false}
                // bordered
                style={{marginBottom: 16}}
            />
            <PaginationCommon
                currentPage={currentPage}
                totalPage={totalPage}
                changePage={onTableChange}
                totalRecord={totalRecord}
                findPage={findPage}
            />
        </div>
    );
};

export default observer(FunctionInstanceList);
