import React, { useEffect, useState, useCallback } from "react";
import { Form, Select, Tag, Space, Input, Button } from "antd";
import { inject, observer } from "mobx-react";
// import Demand from "../../../integrated/teamwire/workItem/components/Demand";
import WorkItemBindList from "../../../defectBind/defect/components/CaseBindDefectList";
import DetailCommon from "../../../../common/caseCommon/DetailCommon";
import CaseContentCommon from "../../../common/CaseContentCommon";
import FuncUnitStepTable from "./FunctionStepList";
import HideDelete from "../../../../common/caseCommon/hideDelete/HideDelete";
import CaseHeaderInfo from "../../../../common/caseCommon/CaseHeaderInfo";
import "../../../common/styles/caseContantStyle.scss";
import "../../../common/styles/unitcase.scss";
import FunctionInstanceList from "./FunctionInstancePageList";

const { TextArea } = Input;
const { Option } = Select;

// 常量定义
const PRECONDITION_DEBOUNCE_DELAY = 500;

const FunctionDetail = (props) => {
    const {
        testPlanId,
        funcUnitStore,
        functionId,
        deleteFn
    } = props;

    const { findFuncUnit, updateFuncUnit, testCaseInfo, funcUnitInfo } = funcUnitStore;


    const [form] = Form.useForm();
    const projectId = localStorage.getItem("projectId");
    const [demandInfo, setDemandInfo] = useState();
    const [caseInfo, setCaseInfo] = useState({});
    const [preconditionValue, setPreconditionValue] = useState("");
    const [preconditionTimer, setPreconditionTimer] = useState(null);
    const [preconditionOrigin, setPreconditionOrigin] = useState(""); // 原始前置条件
    const [preconditionEditing, setPreconditionEditing] = useState(false); // 是否正在编辑

    // 加载功能单元数据
    const loadFuncUnitData = useCallback(async () => {
        try {
            const res = await findFuncUnit(functionId);
            const testCase = res.testCase;
            setCaseInfo(testCase);
            setPreconditionValue(res?.precondition || "");
            setPreconditionOrigin(res?.precondition || ""); // 同步原始值
            setPreconditionEditing(false); // 重置编辑状态
            
            form.setFieldsValue({
                name: testCase.name,
                category: testCase.category?.id,
                updateTime: testCase.updateTime,
                createTime: testCase.createTime,
                status: testCase.status,
                priorityLevel: testCase.priorityLevel,
                director: testCase.director?.id,
                desc: testCase.desc
            });
        } catch (error) {
            console.error("加载功能单元数据失败:", error);
        }
    }, [functionId, findFuncUnit, form]);



    // 更新测试用例
    const updateCase = useCallback(async () => {
        try {
            const newData = await form.getFieldsValue();
            const params = {
                id: funcUnitInfo.id,
                testCase: {
                    ...funcUnitInfo.testCase,
                    name: newData.name,
                    category: { id: newData.category || "nullstring" },
                    status: newData.status,
                    priorityLevel: newData.priorityLevel,
                    director: { id: newData.director },
                    desc: newData.desc
                }
            };
            
            await updateFuncUnit(params);
            await loadFuncUnitData();
        } catch (error) {
            console.error("更新测试用例失败:", error);
        }
    }, [form, funcUnitInfo, updateFuncUnit, loadFuncUnitData]);


    // 处理状态变更
    const handleStatusChange = useCallback(async (value) => {
        try {
            const params = {
                id: funcUnitInfo.id,
                testCase: {
                    ...funcUnitInfo.testCase,
                    status: value
                }
            };
            
            await updateFuncUnit(params);
            await loadFuncUnitData();
        } catch (error) {
            console.error("更新状态失败:", error);
        }
    }, [funcUnitInfo, updateFuncUnit, loadFuncUnitData]);

    // 处理优先级变更
    const handlePriorityChange = useCallback(async (value) => {
        try {
            const params = {
                id: funcUnitInfo.id,
                testCase: {
                    ...funcUnitInfo.testCase,
                    priorityLevel: value
                }
            };
            
            await updateFuncUnit(params);
            await loadFuncUnitData();
        } catch (error) {
            console.error("更新优先级失败:", error);
        }
    }, [funcUnitInfo, updateFuncUnit, loadFuncUnitData]);

    // 防抖更新前置条件
    const updatePrecondition = useCallback((value) => {
        if (preconditionTimer) {
            clearTimeout(preconditionTimer);
        }
        
        const timer = setTimeout(async () => {
            try {
                const params = {
                    id: funcUnitInfo.id,
                    precondition: value,
                    testCase: funcUnitInfo.testCase
                };
                await updateFuncUnit(params);
            } catch (error) {
                console.error("更新前置条件失败:", error);
            }
        }, PRECONDITION_DEBOUNCE_DELAY);
        
        setPreconditionTimer(timer);
    }, [funcUnitInfo, preconditionTimer, updateFuncUnit]);

    // 处理前置条件变更
    const handlePreconditionChange = useCallback((e) => {
        const value = e.target.value;
        setPreconditionValue(value);
        setPreconditionEditing(value !== preconditionOrigin); // 内容变化时显示按钮
    }, [preconditionOrigin]);

    // 保存前置条件
    const handlePreconditionSave = async () => {
        try {
            const params = {
                id: funcUnitInfo.id,
                precondition: preconditionValue,
                testCase: funcUnitInfo.testCase
            };
            await updateFuncUnit(params);
            setPreconditionOrigin(preconditionValue); // 保存后同步原值
            setPreconditionEditing(false); // 隐藏按钮
        } catch (error) {
            console.error("保存前置条件失败:", error);
        }
    };
    // 取消编辑
    const handlePreconditionCancel = () => {
        setPreconditionValue(preconditionOrigin); // 恢复原值
        setPreconditionEditing(false); // 隐藏按钮
    };

    // 组件卸载时清理定时器
    useEffect(() => {
        return () => {
            if (preconditionTimer) {
                clearTimeout(preconditionTimer);
            }
        };
    }, [preconditionTimer]);

    // 初始化数据
    useEffect(() => {
        loadFuncUnitData();
    }, [loadFuncUnitData]);

    // 加载需求信息
    // useEffect(() => {
    //     loadDemandInfo();
    // }, [loadDemandInfo]);

    // 渲染详细信息标签页
    const renderDetailTab = () => (
        <div className="case-detail-center">
            <div style={{ marginBottom: "16px" }}>
                <div className="title-bold">前置条件</div>
                <TextArea
                    className="case-detail-textarea"
                    value={preconditionValue}
                    onChange={handlePreconditionChange}
                />
                {preconditionEditing && (
                    <div style={{ marginTop: 8 }}>
                        <Button type="primary" onClick={handlePreconditionSave} style={{ marginRight: 8 }}>保存</Button>
                        <Button onClick={handlePreconditionCancel}>取消</Button>
                    </div>
                )}
            </div>
            <FuncUnitStepTable functionId={functionId} {...props} />
        </div>
    );

    const getTabItems = () => {
        const items = [
            {
                label: "用例信息",
                key: "1",
                children: renderDetailTab()
            }
        ];

        // items.push({
        //     label: <span>测试历史</span>,
        //     key: "2",
        //     children: <FunctionInstanceList
        //         functionId={functionId}
        //         testPlanId={testPlanId}
        //     />
        // })

        items.push({
            label: <span>关联缺陷</span>,
            key: "3",
            children:<WorkItemBindList
                testPlanId={testPlanId}
                caseId={functionId}
            />
        });

        return items;
    };

    return (
        <>
            <div className="case-header-key">
                <CaseHeaderInfo 
                    caseInfo={caseInfo}
                    onStatusChange={handleStatusChange}
                    onPriorityChange={handlePriorityChange}
                    moreInfo={
                        <DetailCommon
                            type={true}
                            detailInfo={funcUnitInfo}
                            updateCase={updateCase}
                            form={form}
                            // demand={
                            //     <Demand
                            //         workItemId={testCaseInfo?.workItemId}
                            //         caseInfo={funcUnitInfo}
                            //         updateFn={updateDemand}
                            //         demandInfo={demandInfo}
                            //     />
                            // }
                        />
                    }
                />
                <Space>
                    {deleteFn && <HideDelete privilegeCode={"test_case_delete"} projectId={projectId} deleteFn={deleteFn} />}
                </Space>
            </div>
            <CaseContentCommon tabItem={getTabItems()} />
        </>
    );
};

export default inject("funcUnitStore")(observer(FunctionDetail));

