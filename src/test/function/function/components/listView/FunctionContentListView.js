import React, {useCallback, useEffect, useRef, useState} from "react";
import {inject, observer} from "mobx-react";
import "../functionStyle.scss"
import FunctionDetail from "../FunctionDetail";
import EditableTitle from "../../../../../common/caseCommon/EditableTitle";
import {CASE_TYPE} from "../../../../../common/dictionary/dictionary";
import {useParams} from "react-router";
import {LeftOutlined} from "@ant-design/icons";
import PageCenter from "../../../../../common/caseCommon/PageCenter";
import {Button, Col, Form, Row, Select, Space, TreeSelect} from "antd";
import HideDelete from "../../../../../common/caseCommon/hideDelete/HideDelete";
import TextArea from "antd/es/input/TextArea";
import FuncUnitStepTable from "../FunctionStepList";
import WorkItemBindList from "../../../../defectBind/defect/components/CaseBindDefectList";
import {showCaseTypeInList} from "../../../../../common/caseCommon/CaseCommonFn";
import Demand from "../../../../defectBind/workItem/components/Demand";
import IconCommon from "../../../../../common/caseCommon/IconCommon";
import Breadcumb from "../../../../../common/breadcrumb/Breadcrumb";
import CategoryStore from "../../../../category/store/CategoryStore";
import {Axios} from "tiklab-core-ui";
import "./FunctionContentListView.scss"
import UserIcon from "../../../../../common/UserIcon/UserIcon";
import FunctionDetailBottom from "../FunctionDetailBottom";
import FunctionInstanceList from "../FunctionInstanceList";
import {showCreateUser} from "../../../../testcase/components/testCaseTableFn";

const FunctionContentListView = (props) =>{
    const {funcUnitStore,testcaseStore} = props;
    const {deleteTestCase, updateTestCase} = testcaseStore
    const {testCaseInfo,funcUnitInfo,updateFuncUnit,findFuncUnit} = funcUnitStore
    const {findCategoryListTreeTable,categoryTableList} = CategoryStore;
    const {caseId} = useParams()
    const {testPlanId} = useParams()
    const functionId = caseId;
    const projectId = localStorage.getItem("projectId")
    const detailRef = useRef();
    const detailFormRef = useRef();
    const [form] = Form.useForm();
    const [caseInfo, setCaseInfo] = useState({});
    const [preconditionValue, setPreconditionValue] = useState("");
    const [preconditionTimer, setPreconditionTimer] = useState(null);
    const [preconditionOrigin, setPreconditionOrigin] = useState(""); // 原始前置条件
    const [preconditionEditing, setPreconditionEditing] = useState(false); // 是否正在编辑
    const [userList, setUserList] = useState([]);

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

    // 初始化数据
    useEffect(() => {
        loadFuncUnitData();
    }, [functionId]);

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

    const updateCaseDemand = (param) => {
        updateTestCase(param)
        loadFuncUnitData();
    }

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

    return(
        <div className="function-detail">
            <Row style={{ height: "100%", width: "100%", background: "#fff" }}>
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "22", offset: "1" }} xxl={{ span: "18", offset: "3"}}>
                    <div className={"function-content-modal"} style={{padding: "0 20px"}} ref={detailRef}>
                        <div style={{ display: "flex", gap: "10px", height: "100%", paddingTop: "10px" }}>
                            <div className={"func-detail-left"}>
                                <div className={"display-flex-between func-top-title"}>
                                    <div>
                                        <div style={{display:"flex",alignItems:"center"}}>
                                            <LeftOutlined
                                                onClick={()=>props.history.push(`/project/${projectId}/testcase/caseDetail/info`)}
                                                style={{marginRight:"8px"}}
                                            />
                                            <EditableTitle
                                                value={testCaseInfo?.name}
                                                onSave={handleTitleSave}
                                                level={5}
                                                placeholder="请输入用例名称"
                                            />
                                        </div>
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
                                                            {showCreateUser(null)}
                                                        </div>
                                                    }
                                                    getPopupContainer={() => detailFormRef.current}
                                                >
                                                    {
                                                        userList && userList.map(item => {
                                                            return <Option key={item?.user?.id}
                                                                           value={item?.user?.id}>
                                                                <div style={{display: "flex", alignItems: "center", gap: "3px"}}>
                                                                    {/*<UserIcon name={item?.user?.nickname}/>*/}
                                                                    {/*{item?.user?.nickname}*/}
                                                                    {showCreateUser(item?.user)}
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

                                            {/*<Form.Item label={"创建时间"} name="createTime" >*/}
                                            {/*    <Input disabled={true} placeholder={"创建时间"} />*/}
                                            {/*</Form.Item>*/}

                                            {/*<Form.Item label={"更新时间"} name="updateTime" >*/}
                                            {/*    /!*<Input disabled={true}  placeholder={"更新时间"}/>*!/*/}
                                            {/*    <span>{testCaseInfo?.updateTime}</span>*/}
                                            {/*</Form.Item>*/}

                                            {/*<Form.Item label={"评审"} name="reviewResult" >*/}
                                            {/*    <ReviewResultDisplay />*/}
                                            {/*</Form.Item>*/}

                                            {/*{*/}
                                            {/*    demand*/}
                                            {/*        ?<Form.Item label={"关联需求"} name="updateTime" >*/}
                                            {/*            {demand}*/}
                                            {/*        </Form.Item>*/}
                                            {/*        :null*/}
                                            {/*}*/}
                                        </Form>

                                        {/*<div style={{marginTop: '20px',padding: " 0 15px"}}>*/}
                                        {/*    <CaseDesc form={form} updateCase={updateCase}/>*/}
                                        {/*</div>*/}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default inject('funcUnitStore',"testcaseStore")(observer(FunctionContentListView));