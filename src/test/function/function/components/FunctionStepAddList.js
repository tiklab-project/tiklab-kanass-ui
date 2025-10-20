import React, {useEffect, useState, useRef} from 'react';
import IconCommon from "../../../../common/caseCommon/IconCommon";
import {inject, observer} from "mobx-react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {PlusOutlined, UpOutlined, CheckOutlined, CloseOutlined, FormOutlined} from "@ant-design/icons";
import {Row, Col, Empty, Popconfirm, Select, Form, Input, Button, Space, message, Tooltip} from "antd";
import stepCommonStore from "../../../common/stepcommon/store/StepCommonStore";
import {CASE_TYPE} from "../../../../common/dictionary/dictionary";
import {useLocation} from "react-router";
import functionInstanceStore from "../store/functionInstanceStore";
import funcUnitStepStore from "../store/funcUnitStepStore";
import "../../../common/styles/testcaseStyle.scss"
import HideDelete from "../../../../common/caseCommon/hideDelete/HideDelete";

const {TextArea} = Input;

const {findStepCommonList,updateStepCommon,deleteStepCommon} = stepCommonStore
const {setFunctionStepResult} = functionInstanceStore;
const {createFuncUnitStep, updateFuncUnitStep, findFuncUnitStep} = funcUnitStepStore;

const FunctionStepAddList = (props) => {
    const {funcUnitStore, stepList, setStepList} = props;
    const {findFuncUnit} = funcUnitStore;
    const [showAddForm, setShowAddForm] = useState(false);
    const [showAddFormIndex, setShowAddFormIndex] = useState(-1); // 跟踪在哪个索引处显示新增表单
    const [editingStepId, setEditingStepId] = useState(null);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const describedInputRef = useRef(null);

    const pathname = useLocation().pathname
    const projectId = localStorage.getItem("projectId")
    const testPlanId = sessionStorage.getItem("testPlanId")

    // useEffect(async ()=> {
    //     if (type === "edit" && functionId){
    //         await findList()
    //     }
    // },[functionId])

    // const findList = async () =>{
    //     let value ={
    //         caseId:functionId,
    //         caseType:CASE_TYPE.FUNCTION,
    //     }
    //
    //     let list = await findStepCommonList(value)
    //     setStepList(list)
    // }

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        // 如果拖拽到相同位置，不需要处理
        if (result.source.index === result.destination.index) {
            return;
        }

        const reorderedItems = Array.from(stepList);
        const [dragItem] = reorderedItems.splice(result.source.index, 1);

        // 插入到目标位置
        reorderedItems.splice(result.destination.index, 0, dragItem);

        // 更新所有项目的 sort 值为新的索引位置
        const updatedItems = reorderedItems.map((item, index) => ({
            ...item,
            sort: index // 使用数组索引作为排序值
        }));

        // 只更新前端状态
        setStepList(updatedItems);
    };

    const setStepResult =async (value,source) =>{
        const data = {
            functionStepId: source.id,
            functionId: source.caseId,
            result: value,
            testPlanId: testPlanId,
            projectId: projectId,
        };

        await setFunctionStepResult(data)
    }

    const generateRandomId = (length = 16) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const handleAddStep = async (index) => {
        try {
            let formValues = await form.validateFields();
            const values = {
                funcUnitStep: formValues,
                id: generateRandomId(16),
                sort: stepList.length
            };

            // 在指定索引位置插入新步骤
            const newStepList = [...stepList];
            newStepList.splice(index + 1, 0, values);

            // 更新排序值
            const updatedItems = newStepList.map((item, idx) => ({
                ...item,
                sort: idx
            }));

            setStepList(updatedItems);

            console.log("添加步骤成功");
            form.resetFields();
            setShowAddForm(false);
        } catch (error) {
            if (error.errorFields || error.errorFields.length > 0){
                console.error('验证表单:', error);
            }else {
                message.error("添加失败");
                console.error('添加步骤失败:', error);
            }


        }
    };

    const handleKeyPressAdd = (e, index) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleAddStep(index);
        }
    };

    const handleKeyPressEdit = (e, stepId) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleEditStep(stepId);
        }
    };

    const showAddFormHandler = () => {
        setShowAddForm(true);
        // 使用setTimeout确保DOM更新后再聚焦
        setTimeout(() => {
            if (describedInputRef.current) {
                describedInputRef.current.focus();
            }
        }, 100);
    };

    const handleEditStep = async (stepId) => {
        try {
            const formValues = await editForm.validateFields();
            stepList.map(item => {
                if (item.id === stepId) {
                    item.funcUnitStep = formValues;
                }
            })
            message.success("修改成功");
            setEditingStepId(null);
            editForm.resetFields();

        } catch (error) {
            message.error("修改失败");
            console.error('编辑步骤失败:', error);
        }
    };

    const startEdit = async (stepId) => {
        try {
            console.log("stepList",stepList);
            console.log("编辑的id",stepId);
            // const info = await findFuncUnitStep(stepId);
            const editInfo = stepList.filter(item => item.id === stepId);
            const info = editInfo[0].funcUnitStep;
            editForm.setFieldsValue(info);
            setEditingStepId(stepId);
        } catch (error) {
            console.error('获取步骤信息失败:', error);
        }
    };

    const cancelEdit = () => {
        setEditingStepId(null);
        editForm.resetFields();
    };

    const cancelAdd = () => {
        setShowAddForm(false);
        setShowAddFormIndex(null);
        form.resetFields();
    };

    const renderItemsInfo = (item,provided,step, index) =>{
        const isEditing = editingStepId === item.id;

        return(
            <Row className={"step-item-content step-row"} style={{display: "flex"}}>
                <Col className={"step-cell"} style={{width: "30px"}}>
                    <div
                        {...provided.dragHandleProps}
                        className={"step-item-box-icon"}
                    >
                        <svg className="icon-18" aria-hidden="true" style={{marginLeft: "3px", cursor: "pointer"}}>
                            <use xlinkHref="#icon-holder"></use>
                        </svg>
                    </div>
                </Col>
                <Col span={10} className={"step-cell step-item-box-text"}>
                    {isEditing ? (
                        <Form.Item
                            name="described"
                            rules={[{ required: true, message: '步骤描述' }]}
                            style={{marginBottom: 0, width: "100%"}}
                        >
                            <TextArea
                                placeholder="步骤描述(Ctrl+Enter快速保存)"
                                autoSize={{minRows: 3, maxRows: 4}}
                                onKeyDown={(e) => handleKeyPressEdit(e, item.id)}
                                bordered={false}
                            />
                        </Form.Item>
                    ) : (
                        <div onClick={(e) => {
                            e.stopPropagation();
                            startEdit(item.id);
                        }} className={"text-display"}>{step?.described}</div>
                    )}
                </Col>
                <Col span={10} className={"step-cell step-item-box-text"}>
                    {isEditing ? (
                        <Form.Item
                            name="expect"
                            rules={[{ required: true, message: '预期结果' }]}
                            style={{marginBottom: 0, width: "100%"}}
                        >
                            <TextArea
                                placeholder="预期结果(Ctrl+Enter快速保存)"
                                autoSize={{minRows: 3, maxRows: 4}}
                                onKeyDown={(e) => handleKeyPressEdit(e, item.id)}
                                bordered={false}
                            />
                        </Form.Item>
                    ) : (
                        step?.expect ? <div onClick={(e) => {
                            e.stopPropagation();
                            startEdit(item.id);
                        }} className={"text-display"}>{step?.expect}</div> : null
                    )}
                </Col>
                <Col className={"step-cell"} style={{margin:"0 auto", display: "flex",height:"20px", width: "50px", justifyContent: "center", alignItems: "center"}}>
                    {isEditing ? (
                        <Space>
                            <Tooltip title={"Ctrl + Enter 快速保存"} mouseEnterDelay={0.5}>
                                <CheckOutlined
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditStep(item.id);
                                    }}
                                    style={{cursor: "pointer", fontSize: "16px"}}
                                />
                            </Tooltip>
                            <CloseOutlined
                                onClick={(e) => {
                                    e.stopPropagation();
                                    cancelEdit();
                                }}
                                style={{cursor: "pointer", fontSize: "16px"}}
                            />
                        </Space>
                    ) : (
                        <Space>
                            <svg className="icon-18" aria-hidden="true" style={{marginLeft: "3px", cursor: "pointer"}}
                                 onClick={(e) => {
                                     e.stopPropagation();
                                     console.log("---新增步骤---",index)
                                     setShowAddFormIndex(index)
                                     showAddFormHandler(index);
                                 }}>
                                <use xlinkHref="#icon-add2"></use>
                            </svg>
                            <HideDelete deleteFn={()=>deleteFn(item)}/>
                        </Space>
                    )}
                </Col>
            </Row>
        )
    }

    const renderAddForm = (index) => {
        return (
            <div className={"step-item-box"} style={{marginTop: "10px"}}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={() => handleAddStep(index)}
                >
                    <Row className={"step-item-content"} style={{display: "flex"}}>
                        <Col className={"step-cell"} style={{width: "30px"}}>
                            <div className={"step-item-box-icon"}>
                                <svg className="icon-18" aria-hidden="true" style={{marginLeft: "3px", cursor: "pointer"}}>
                                    <use xlinkHref="#icon-holder"></use>
                                </svg>
                            </div>
                        </Col>
                        <Col span={10} className={"step-cell step-item-box-text"}>
                            <Form.Item
                                name="described"
                                rules={[{required: true, message: '步骤描述'}]}
                                style={{marginBottom: 0, width: "100%"}}
                            >
                                <TextArea
                                    ref={describedInputRef}
                                    placeholder="步骤描述(Ctrl+Enter快速保存)"
                                    autoSize={{minRows: 3, maxRows: 4}}
                                    onKeyDown={(e) => handleKeyPressAdd(e, index)}
                                    bordered={false}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={10} className={"step-cell step-item-box-text"}>
                            <Form.Item
                                name="expect"
                                rules={[{required: true, message: '预期结果'}]}
                                style={{marginBottom: 0, width: "100%"}}
                            >
                                <TextArea
                                    placeholder="预期结果(Ctrl+Enter快速保存)"
                                    autoSize={{minRows: 3, maxRows: 4}}
                                    onKeyDown={(e) => handleKeyPressAdd(e, index)}
                                    bordered={false}
                                />
                            </Form.Item>
                        </Col>
                        <Col style={{margin: "0 auto", display: "flex", height: "20px", width: "50px",
                            justifyContent: "center", alignItems: "center"}}>
                            <Space>
                                <Tooltip title={"Ctrl + Enter 快速保存"} mouseEnterDelay={0.5}>
                                    <CheckOutlined
                                        onClick={() => handleAddStep(index)}
                                        style={{cursor: "pointer", fontSize: "16px"}}
                                    />
                                </Tooltip>
                                <CloseOutlined
                                    onClick={cancelAdd}
                                    style={{cursor: "pointer", fontSize: "16px"}}
                                />
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    };

    const renderItems = (list) => {
        return list.map((item, index) => {
            let step = item.funcUnitStep
            return <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                    <>
                        <div
                            className={"step-item-box"}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                                // backgroundColor: snapshot.isDragging ? 'var(--pi-bg-grey-200)' : 'white',
                                ...provided.draggableProps.style,
                            }}
                        >
                            {editingStepId === item.id ? (
                                <Form form={editForm} layout="vertical">
                                    {renderItemsInfo(item, provided, step, index)}
                                </Form>
                            ) : (
                                renderItemsInfo(item, provided, step, index)
                            )}
                        </div>
                        {/* 在当前位置下方显示新增表单 */}
                        {showAddForm && showAddFormIndex === index && renderAddForm(index)}
                    </>
                )}
            </Draggable>
        });
    };

    const deleteFn = async (item) =>{
        setStepList(stepList.filter(step => step.id !== item.id))
    }

    return (
        <>
            <div>
                <div className={"title-bold"}>
                    <div>
                        测试步骤
                        <span className={"list-size-title"}> {stepList.length}</span>
                    </div>
                </div>
            </div>
            <div className={"table-list-box"}>
                {/*<div className={"display-flex-between"} style={{margin: "10px 5px"}}>*/}
                {/*     <div className={"list-size-title"}> 共{stepList.length}个</div>*/}
                {/*</div>*/}

                {/* 添加步骤表单 */}

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="list">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <div>
                                    {
                                        stepList && stepList.length > 0
                                            ? renderItems(stepList)
                                            : <div style={{height: "0px"}}/>
                                    }
                                </div>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                {
                    !showAddForm && stepList.length === 0 &&
                    <div className={"step-add-box"} style={{marginTop: "10px"}}>
                        <div style={{textAlign: "center"}}>
                            <span
                                className="link-text"
                                onClick={showAddFormHandler}
                                style={{cursor: "pointer", fontSize: "14px", display: "inline-flex", alignItems: "center"}}
                            >
                                <svg className="icon-20" aria-hidden="true" style={{marginRight: "5px"}}>
                                    <use xlinkHref="#icon-add2"></use>
                                </svg>
                                添加步骤
                            </span>
                        </div>
                    </div>
                }
                {/* 在列表末尾显示新增表单 */}
                {showAddForm && stepList.length === 0 && showAddFormIndex === -1 && renderAddForm(stepList.length - 1)}
                {/*{*/}
                {/*    showAddForm && (*/}
                {/*        <div className={"step-item-box"} style={{marginTop: "10px"}}>*/}
                {/*            <Form*/}
                {/*                form={form}*/}
                {/*                layout="vertical"*/}
                {/*                onFinish={handleAddStep}*/}
                {/*            >*/}
                {/*                <Row className={"step-item-content"} style={{display: "flex"}}>*/}
                {/*                    <Col className={"step-cell"} style={{width: "20px"}}>*/}
                {/*                        <div className={"step-item-box-icon"}>*/}
                {/*                            <HolderOutlined />*/}
                {/*                            /!*<div className={"step-item-box-index"}>{stepList.length + 1}</div>*!/*/}
                {/*                        </div>*/}
                {/*                    </Col>*/}
                {/*                    <Col span={10} className={"step-cell step-item-box-text"}>*/}
                {/*                        <Form.Item*/}
                {/*                            name="described"*/}
                {/*                            rules={[{required: true, message: '步骤描述'}]}*/}
                {/*                            style={{marginBottom: 0, width: "100%"}}*/}
                {/*                        >*/}
                {/*                            <TextArea*/}
                {/*                                ref={describedInputRef}*/}
                {/*                                placeholder="步骤描述(Ctrl+Enter快速保存)"*/}
                {/*                                autoSize={{minRows: 3, maxRows: 4}}*/}
                {/*                                onKeyDown={handleKeyPressAdd}*/}
                {/*                                bordered={false}*/}
                {/*                            />*/}
                {/*                        </Form.Item>*/}
                {/*                    </Col>*/}
                {/*                    <Col span={10} className={"step-cell step-item-box-text"}>*/}
                {/*                        <Form.Item*/}
                {/*                            name="expect"*/}
                {/*                            rules={[{required: true, message: '预期结果'}]}*/}
                {/*                            style={{marginBottom: 0, width: "100%"}}*/}
                {/*                        >*/}
                {/*                            <TextArea*/}
                {/*                                placeholder="预期结果(Ctrl+Enter快速保存)"*/}
                {/*                                autoSize={{minRows: 3, maxRows: 4}}*/}
                {/*                                onKeyDown={handleKeyPressAdd}*/}
                {/*                                bordered={false}*/}
                {/*                            />*/}
                {/*                        </Form.Item>*/}
                {/*                    </Col>*/}
                {/*                    <Col style={{display: "flex", height: "20px", width: "50px",*/}
                {/*                        justifyContent: "center", alignItems: "center"}}>*/}
                {/*                        <Space>*/}
                {/*                            <Tooltip title={"Ctrl + Enter 快速保存"} mouseEnterDelay={0.5}>*/}
                {/*                                <CheckOutlined*/}
                {/*                                    onClick={handleAddStep}*/}
                {/*                                    style={{cursor: "pointer", fontSize: "16px"}}*/}
                {/*                                />*/}
                {/*                            </Tooltip>*/}
                {/*                            <CloseOutlined*/}
                {/*                                onClick={() => {*/}
                {/*                                    form.resetFields();*/}
                {/*                                    setShowAddForm(false);*/}
                {/*                                }}*/}
                {/*                                style={{cursor: "pointer", fontSize: "16px"}}*/}
                {/*                            />*/}
                {/*                        </Space>*/}
                {/*                    </Col>*/}
                {/*                </Row>*/}
                {/*            </Form>*/}
                {/*        </div>*/}
                {/*    )*/}
                {/*}*/}

            </div>
        </>
    );
};

export default inject("funcUnitStore")(observer(FunctionStepAddList));