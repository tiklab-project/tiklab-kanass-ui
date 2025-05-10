import React, {useEffect, useState} from "react";
import {Form, Modal, Select} from "antd";
import {inject, Observer} from "mobx-react";
const TestPlanAdd = (props) => {

    const {
        planVisible,
        setPlanVisible,
        projectId,
        testRepositoryStore,
        setPlanList
    } = props;
    const {
        findProjectTestRepositoryList,
        findAllTestPlan,
        findAllProjectTestRepositoryPlan,
        createProjectTestRepositoryPlan,
        deleteProjectTestRepositoryPlanByCondition,
        findProjectTestRepositoryPlanPage
    } = testRepositoryStore

    const [form] = Form.useForm();

    // 测试用例库
    const [repositoryList, setRepositoryList] = useState([]);
    // 测试计划
    const [currentPlanList, setCurrentPlanList] = useState([])
    // 已经绑定的测试计划
    const [bindPlanList, setBindPlanList] = useState([])

    useEffect(() => {
        console.log("projectId:   "+projectId);
        // 查询当前绑定的测试库和测试计划
        findProjectTestRepositoryList({ projectId: projectId }).then((res) => {
            if (res.code === 0){
                setRepositoryList(res.data);
            }
        })

    },[]);

    const handleOk =  async () => {
        form.validateFields().then(values => {
            // const { testRepository, testPlan } = values;
            console.log("表单中的数据    "+JSON.stringify(values.project))
            console.log("提交的数据：  " + values.testRepository + "   " + values.testPlan)
            const repositoryId = values.testRepository;
            const currentSelected = values.testPlan || [];
            // 计算需要新增的 ID（在 currentSelected 但不在 bindPlanList 中）
            const idsToAdd = currentSelected.filter(id => !bindPlanList.includes(id));
            // 计算需要删除的 ID（在 bindPlanList 但不在 currentSelected 中）
            const idsToRemove = bindPlanList.filter(id => !currentSelected.includes(id));
            console.log("新增的ID：  " + idsToAdd)
            console.log("删除的ID：  " + idsToRemove)
            // 新增
            const addPromises = idsToAdd.map(id => {
                const param = {
                    project:{
                        id: projectId
                    },
                    testRepository:{
                        id: repositoryId
                    },
                    testPlan:{
                        id: id
                    }
                }
                return createProjectTestRepositoryPlan(param).then(res => {
                    console.log(id+"新增成功")
                }).catch(err => console.error(id + " 新增失败", err));
            })

            // 删除
            const deletePromises = idsToRemove.map(id => {
                return deleteProjectTestRepositoryPlanByCondition(projectId, repositoryId, id).then(res => {
                    console.log(id+"删除成功")
                }).catch(err => console.error(id + " 删除失败", err))
            })

            // 等所有操作完成后再查询最新数据
            return Promise.all([...addPromises, ...deletePromises])
                .then(() => {
                    form.resetFields();
                    setPlanVisible(false);
                    findProjectTestRepositoryPlanPage({projectId: projectId}).then(res => {
                        if (res.code === 0){
                            setPlanList(res.data.dataList);
                        }
                    })
                });
        })

    };

    const handleCancel = () => {
        setPlanVisible(false);
        form.resetFields();
    };

    const changeRepository = (value) => {
        console.log("选中的id：   "+value);
        findAllTestPlan(value).then(res => {
            if (res.code === 0){
                setCurrentPlanList(res.data);
                // 查询当前绑定的测试计划
                findAllProjectTestRepositoryPlan(projectId, value).then(result => {
                    if (result.code === 0){
                        // 绑定的测试计划
                        form.setFieldsValue({
                            testPlan: []
                        })
                        var idList = [];
                        if (result.data.length > 0) {
                            result.data.map((item) => {
                                idList.push(item?.testPlan.id)
                            })
                        }
                        setBindPlanList(idList);
                        form.setFieldsValue({
                            testPlan: idList
                        })
                    }
                })
            }
        })

    }


    return <Modal
        title={"关联测试计划"}
        visible={planVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="取消"
        okText="确定"
        closable={true}
    >
        <Form
            name="basic"
            initialValues={{
                project: projectId,
                testRepository: null,
                testPlan: []
            }}
            form={form}
            layout="vertical"
        >
            <Form.Item
                label="测试项目"
                name="testRepository"
                rules={[
                    {
                        required: true,
                        message: '请选择测试项目'
                    }
                ]}
            >
                <Select
                    key={"repositoryId"}
                    placeholder="请选择测试项目"
                    onChange={changeRepository}
                >
                    {
                        repositoryList && repositoryList.map((item) => {
                            return <Select.Option
                                value={item?.id}
                                key={item?.id}
                            >{item?.testRepositoryName}</Select.Option>
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item
                label="测试计划"
                name="testPlan"
                rules={[
                    {
                        required: true,
                        message: '请选择测试计划'
                    }
                ]}
            >
                <Select
                    key={"planId"}
                    placeholder="请选择测试计划"
                    allowClear
                    mode={"multiple"}
                >
                    {
                        currentPlanList && currentPlanList.map((item) => {
                            return <Select.Option
                                value={item?.id}
                                key={item?.id}
                            >{item?.name}</Select.Option>
                        })
                    }
                </Select>
            </Form.Item>
        </Form>
    </Modal>;
};

export default TestPlanAdd;