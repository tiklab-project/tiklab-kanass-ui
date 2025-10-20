import {observer} from "mobx-react";
import React, { useEffect, useState } from "react";
import {Empty, Space, Table} from "antd";
import FunctionSetResultDrawer from "../../../testplan/function/components/FunctionSetResultDrawer";
import functionInstanceStore from "../store/functionInstanceStore";
import {CheckCircleTwoTone, CloseCircleTwoTone, MinusCircleTwoTone} from "@ant-design/icons";
import "./FunctionInstanceList.scss"
import UserIcon from "../../../../common/UserIcon/UserIcon";

const FunctionInstanceList = (props) => {
    const { findRecentCaseFunctionInstanceList } = functionInstanceStore;
    const { caseId, inDetail } = props

    const [loading, setLoading] = useState(true);
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            setLoading(true);
            const params = {
                functionId: caseId
            }
            try {
                const res = await findRecentCaseFunctionInstanceList(params);
                if (isMounted) {
                    setDataList(Array.isArray(res) ? res : (res?.dataList || []));
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchData();
        return () => { isMounted = false }
    }, [findRecentCaseFunctionInstanceList]);

    const resultMap = {
        0: { text: "失败", color: "#ff4d4f", icon: <CloseCircleTwoTone twoToneColor="#ff4d4f" /> },
        1: { text: "成功", color: "#52c41a", icon: <CheckCircleTwoTone twoToneColor="#52c41a" /> },
        2: { text: "无法执行", color: "#ffa325", icon: <CheckCircleTwoTone twoToneColor="#ffa325" /> },
    };
    // 结果展示
    const showResult = (result) => {
        const item = resultMap[result];
        console.log("********测试结果********",result)
        if (!item) {
            return <Space size={"small"}>
                <MinusCircleTwoTone twoToneColor={"#d3d3d3"}/>
                <span className="font-12">未执行</span>
            </Space>
        }
        return <Space size={"small"}>
            {item.icon}
            <span className="font-12" style={{color: item.color}}>{item.text}</span>
        </Space>
    };
    
    const columns = [
        {
            title: "测试计划",
            dataIndex: ["testPlan", "name"],
            key: "testPlanName",
            ellipsis: true,
            width: "35%",
            render: (text, record) => (
                <span>{record?.testPlan?.name || "---"}</span>
            )
        },
        {
            title: "执行结果",
            key: "result",
            width: "20%",
            render: (text, record) =>(
                <>
                    {showResult(record.result)}
                </>
            )
            
        },
        {
            title: "执行人",
            dataIndex: ["createUser", "nickname"],
            key: "createUserNickname",
            width: "20%",
            render: (text, record) => (
                <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                    <UserIcon name={record?.createUser?.nickname} />
                    <span>{record?.createUser?.nickname || "---"}</span>
                </div>

            )
        },
        {
            title: "创建时间",
            dataIndex: "createTime",
            key: "createTime",
            ellipsis: true,
            width: "25%",
        },
    ]

    return (
        <>
            {
                inDetail &&
                <div className={"title-bold"}>
                    执行结果
                </div>
            }
            {
                dataList && dataList.length > 0 ?
                    <div className={"table-list-box"} style={{margin: "16px 0"}}>
                        <Table
                            className={'function-instance-table'}
                            columns={columns}
                            dataSource={dataList}
                            rowKey={record => record.id}
                            loading={loading}
                            pagination={false}
                            locale={{
                                // emptyText: <div style={{color: "#999"}}>暂无结果</div>,
                                emptyText: <Empty description="暂无结果"/>,
                            }}
                        />
                    </div>
                    :
                    <Empty description="暂无结果"/>
            }

        </>
    )
}


export default (observer(FunctionInstanceList));