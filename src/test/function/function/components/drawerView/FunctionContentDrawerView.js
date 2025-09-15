import {inject, observer, Provider} from "mobx-react";
import {Button, Col, Drawer, Form, Modal, Row, Select, Space, TreeSelect} from "antd";
import React, {useCallback, useEffect, useRef, useState} from "react";
import EditableTitle from "../../../../../common/caseCommon/EditableTitle";
import FuncUnitStore from "../../store/funcUnitStore";
import TestcaseStore from "../../../../testcase/store/testcaseStore";
import {CASE_TYPE} from "../../../../../common/dictionary/dictionary";
import "./FunctionContentDrawerView.scss"
import CategoryStore from "../../../../category/store/CategoryStore";
import HideDelete from "../../../../../common/caseCommon/hideDelete/HideDelete";
import FuncUnitStepTable from "../FunctionStepList";
import WorkItemBindList from "../../../../defectBind/defect/components/CaseBindDefectList";
import TextArea from "antd/es/input/TextArea";
import IconCommon from "../../../../../common/caseCommon/IconCommon";
import {showCaseTypeInList} from "../../../../../common/caseCommon/CaseCommonFn";
import {Axios} from "tiklab-core-ui";
import Demand from "../../../../defectBind/workItem/components/Demand";
import FunctionDetailBottom from "../FunctionDetailBottom";
import UserIcon from "../../../../../common/UserIcon/UserIcon";
import FunctionInstanceList from "../FunctionInstanceList";

const FunctionContentDrawerView = (props) => {
    const {isModalVisible, setIsModalVisible, caseId, inTestCase, detailWidth, testPlanId,} = props;
    const {deleteTestCase, updateTestCase} = TestcaseStore
    const {testCaseInfo,funcUnitInfo,updateFuncUnit,findFuncUnit} = FuncUnitStore
    const {findCategoryListTreeTable,categoryTableList} = CategoryStore;
    const functionId = caseId;
    const projectId = localStorage.getItem("projectId")
    const [caseInfo, setCaseInfo] = useState({});
    const [preconditionValue, setPreconditionValue] = useState("");
    const [preconditionTimer, setPreconditionTimer] = useState(null);
    const [preconditionOrigin, setPreconditionOrigin] = useState(""); // 原始前置条件
    const [preconditionEditing, setPreconditionEditing] = useState(false); // 是否正在编辑
    const [userList, setUserList] = useState([]);
    const detailRef = useRef();
    const detailFormRef = useRef();
    const [form] = Form.useForm();

    const store = {
        testcaseStore: TestcaseStore,
        funcUnitStore: FuncUnitStore,
        categoryStore: CategoryStore
    }

    const getModalWidth = () => {
        const width = window.innerWidth;

        if (width >= 1600) {
            return 1200;
        } else if (width < 1600 && width >= 1200) {
            return 987;
        } else if (width < 1200 && width >= 992) {
            return 750;
        } else if (width < 992 && width >= 768) {
            return 700;
        } else if (width < 768){
            return 700;
        }
    }

    const getModalHeight = () => {
        const height = window.innerHeight;

        if (height >= 900) {
            return 700;
        } else if (height >= 768) {
            return 600;
        } else if (height >= 576) {
            return 500;
        } else {
            return 500;
        }
    };

    /**
     * 手动关闭事项详情抽屉
     */
    const closeDrawer = () => {
        setIsModalVisible(false);
    };
    // 处理标题保存
    const handleTitleSave = async (newTitle) => {
        const params = {
            id:funcUnitInfo.id,
            testCase: {
                ...funcUnitInfo.testCase,
                name:newTitle,
            }
        }
        updateFuncUnit(params).then(()=>{
            findFuncUnit(functionId)
        })
    };
    const deleteFn = async () => {
        await deleteTestCase(funcUnitInfo.id,CASE_TYPE.FUNCTION)
        window.dispatchEvent(new CustomEvent('testcase-close-tab', { detail: { tabKey: functionId } }));
    }

    // 更新测试用例
    const updateCase = useCallback(async () => {
        try {
            const newData = await form.getFieldsValue();
            const params = {
                id: funcUnitInfo.id,
                testCase: {
                    ...funcUnitInfo.testCase,
                    name: newData.name,
                    module: { id: newData.category || "nullstring" },
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
    }, [functionId]);

    // useEffect(()=>{
    //     if (isModalVisible){
    //         findCategoryListTreeTable(projectId)
    //     }
    // },[isModalVisible])
    //
    // useEffect(async ()=>{
    //     if (isModalVisible){
    //         const params = {domainId:projectId};
    //         const res = await Axios.post("/dmUser/findDmUserPage",params);
    //         if(res.code===0){
    //             setUserList(res.data.dataList)
    //         }
    //     }
    //
    // },[isModalVisible])

    // 加载功能单元数据
    const loadFuncUnitData = useCallback(async () => {
        try {
            console.log("初始化用例数据了")
            findCategoryListTreeTable({projectId: projectId})

            const params = {domainId:projectId};
            const dmUserRes = await Axios.post("/dmUser/findDmUserPage",params);
            if(dmUserRes.code===0){
                setUserList(dmUserRes.data.dataList)
            }

            const res = await findFuncUnit(functionId);
            const testCase = res.testCase;
            setCaseInfo(testCase);
            setPreconditionValue(res?.precondition || "");
            setPreconditionOrigin(res?.precondition || ""); // 同步原始值
            setPreconditionEditing(false); // 重置编辑状态

            form.setFieldsValue({
                name: testCase.name,
                category: testCase.module?.id,
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

    const updateCaseDemand = (param) => {
        updateTestCase(param)
        loadFuncUnitData();
    }

    return (
        <Provider {...store}>
            <Drawer
                title={"用例详情"}
                placement="right"
                onClose={closeDrawer}
                visible={isModalVisible}
                className={`${isModalVisible ? "function-drawer-view" : ''} `}
                closable={true}
                destroyOnClose={true}
                width={getModalWidth()}
                mask={true}
                maskClosable={true}
            >
                <div className={"function-content-modal"} style={{padding: "0 20px"}} ref={detailRef}>

                    <div style={{ display: "flex", gap: "10px", height: "100%", paddingTop: "10px" }}>
                        <div className={"func-detail-left"}>
                            <div className={"display-flex-between func-top-title"}>
                                <div>
                                    <EditableTitle
                                        value={testCaseInfo?.name}
                                        onSave={handleTitleSave}
                                        level={5}
                                        placeholder="请输入用例名称"
                                    />
                                    <div className={"case-create-info"}>
                                        <span>{testCaseInfo?.createUser.nickname} 创建于 {testCaseInfo?.createTime}</span>
                                    </div>
                                </div>
                                <Space>
                                    {deleteFn && <HideDelete deleteFn={deleteFn} />}
                                </Space>
                            </div>
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
                                <div style={{ marginBottom: "16px" }}>
                                    <FuncUnitStepTable functionId={functionId} {...props} />
                                </div>
                            </div>
                            <div>
                                {
                                    testPlanId &&
                                        <FunctionDetailBottom
                                            testPlanId={testPlanId}
                                            caseId={functionId}
                                            {...props}
                                        />
                                }
                            </div>
                            {
                                !testPlanId && (
                                    <FunctionInstanceList
                                        caseId={functionId}
                                        inDetail={true}
                                    />
                                )
                            }
                        </div>
                        <div className={"func-detail-right"}>
                            <div className="case-header-key">
                                <div className={"func-detail-form"} ref={detailFormRef}>
                                    <Form
                                        form={form}
                                        layout="vertical"
                                        onValuesChange={updateCase}
                                        className={"base-info-form"}
                                        style={{padding: " 0 15px"}}
                                    >
                                        {/*<Form.Item label={"名称"} name="name">*/}
                                        {/*    <Input placeholder={"名称"}/>*/}
                                        {/*</Form.Item>*/}

                                        <Form.Item label={"用例类型"}>
                                            <div style={{width: "fit-content"}}>
                                                {showCaseTypeInList(caseInfo?.caseType)}
                                            </div>
                                        </Form.Item>

                                        <Form.Item label={"关联需求"}>
                                            <Demand
                                                workItemId={testCaseInfo?.demand?.id}
                                                caseInfo={funcUnitInfo}
                                                updateFn={updateCaseDemand}
                                                demandInfo={testCaseInfo?.demand}
                                            />
                                        </Form.Item>

                                        <Form.Item label={"负责人"} name="director">
                                            <Select
                                                className={"func-select"}
                                                bordered={false}
                                                placeholder={
                                                    <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                                        <UserIcon name={"未"} size={"small"} />
                                                        <span>未设置</span>
                                                    </div>
                                                }
                                                getPopupContainer={() => detailFormRef.current}
                                            >
                                                {
                                                    userList && userList.map(item => {
                                                        return <Option key={item?.user?.id}
                                                                       value={item?.user?.id}>
                                                            <div style={{display: "flex", alignItems: "center", gap: "3px"}}>
                                                                <UserIcon name={item?.user?.nickname}/>
                                                                {item?.user?.nickname}
                                                            </div>
                                                        </Option>
                                                    })
                                                }
                                            </Select>
                                        </Form.Item>

                                        <Form.Item label={"模块"} name="category">
                                            <TreeSelect
                                                className={"func-select"}
                                                bordered={false}
                                                style={{width: '100%'}}
                                                getPopupContainer={() => detailFormRef.current}
                                                dropdownStyle={{
                                                    maxHeight: 400,
                                                    overflow: 'auto',
                                                }}
                                                placeholder="未设置"
                                                treeDefaultExpandAll
                                                treeData={categoryTableList.map(item => ({
                                                    title: item.moduleName,
                                                    key: item.id,
                                                    value: item.id,
                                                    children: item.children?.map(child => ({
                                                        title: child.moduleName,
                                                        key: child.id,
                                                        value: child.id,
                                                        children: child.children?.map(grandChild => ({
                                                            title: grandChild.moduleName,
                                                            key: grandChild.id,
                                                            value: grandChild.id
                                                        }))
                                                    }))
                                                }))}
                                            />
                                        </Form.Item>

                                        <Form.Item label={"优先级"} name="priorityLevel" >
                                            <Select
                                                className={"func-select"}
                                                bordered={false}
                                                placeholder={"未设置"}
                                                style={{flex: 1}}
                                                getPopupContainer={() => detailFormRef.current}
                                            >
                                                <Option value={0}>
                                                    <div className={"display-flex-gap"}>
                                                        <IconCommon
                                                            className={"icon-s"}
                                                            icon={"icon_level1"}
                                                            style={{cursor: "pointer"}}
                                                        />
                                                        <div>低</div>
                                                    </div>
                                                </Option>
                                                <Option value={1}>
                                                    <div className={"display-flex-gap"}>
                                                        <IconCommon
                                                            className={"icon-s"}
                                                            icon={"icon_level2"}
                                                            style={{cursor: "pointer"}}
                                                        />
                                                        <div>中</div>
                                                    </div>
                                                </Option>
                                                <Option value={2}>
                                                    <div className={"display-flex-gap"}>
                                                        <IconCommon
                                                            className={"icon-s"}
                                                            icon={"icon_level3"}
                                                            style={{cursor: "pointer"}}
                                                        />
                                                        <div>高</div>
                                                    </div>
                                                </Option>
                                            </Select>
                                        </Form.Item>


                                    </Form>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </Drawer>
        </Provider>
    )
}

export default observer(FunctionContentDrawerView);