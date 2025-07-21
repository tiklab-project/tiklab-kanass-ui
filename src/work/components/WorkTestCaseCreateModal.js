import {inject, observer} from "mobx-react";
import "./WorkTestCaseCreateModal.scss"
import {Form, Input, Modal, Select, TreeSelect} from "antd";
import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import {withRouter} from "react-router";

const WorkTestCaseCreateModal = (props) => {
    const { testCaseAddModel, caseType, workTestStore} = props
    const { unRelationWorkCondition, findCategoryListTreeTable, findProjectTestRepositoryList } = workTestStore
    const [showCreateModal, setShowCreateModel] = useState(false)
    const [repositoryList, setRepositoryList] = useState([])
    const [moduleTree, setModuleTree] = useState()
    const projectId = props.match.params.id;
    const {form} = Form.useForm();

    // 暴露方法给父组件
    useImperativeHandle(testCaseAddModel, () => ({
        setShowCreateModel: setShowCreateModel
    }))

    const handleOk = () => {
        console.log(unRelationWorkCondition);
        setShowCreateModel(false)
    }

    const buildModuleTree= (dataList)=>{
        return dataList?.map(item=> {
            return item.children ?
                <TreeSelect.TreeNode value={item.id} title={item.name} key={item.id}>
                    {
                        buildModuleTree(item.children)
                    }
                </TreeSelect.TreeNode>
                :
                <TreeSelect.TreeNode value={item.id} title={item.name} key={item.id}/>
        })
    }
    useEffect(() => {
        // console.log()
        if (showCreateModal){
            // 查询系统下关联的所有测试项目
            findProjectTestRepositoryList({projectId: projectId}).then(res => {
                setRepositoryList(res.data);
            })
        }
    }, [showCreateModal]);

    // 选择项目
    const selectRepository = (value, option) => {
        getRepositoryValue(option.repository)
    }

    /**
     * 在项目内添加事项或者选择项目之后， 设置表单初始化值
     * @param {*} repository
     */
    const getRepositoryValue = (repository) => {
        const repositoryId = repository.id;
        // 获取模块
        findCategoryListTreeTable({repositoryId:repositoryId}).then(res => {
            if (res.code === 0) {
                setModuleTree(res.data)
            }
        })
    }

    return (
        <Modal
            title={caseType?.name}
            visible={showCreateModal}
            onCancel={() => {setShowCreateModel(false)}}
            onOk={handleOk}
        >

            <Form
                form={form}
                layout="vertical"
                labelAlign="right"
            >
                <Form.Item
                    label="测试项目"
                    name="testRepository"
                    rules={[{ required: true, message: '请选择测试项目' }]}
                >
                    <Select
                        placeholder="项目"
                        allowClear
                        className="work-select"
                        key="selectRepository"
                        onSelect={selectRepository}
                    >
                        {
                            repositoryList && repositoryList.map((item) => {
                                return <Select.Option repository={item} value={item.id} key={item.id}>{item.testRepositoryName}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    label="名称"
                    name="name"
                    rules={[{ required: true, message: '请输入名称' }]}
                >
                    <Input placeholder="请输入名称" />
                </Form.Item>

                <Form.Item
                    label="模块"
                    name="module"
                    rules={[{ required: true, message: '请输入模块' }]}
                >
                    <TreeSelect
                        showSearch
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="选择上级模块"
                        allowClear
                        // value = {parentId}
                        // onChange={(value)=> setParentId(value)}
                        treeDefaultExpandAll
                        disabled={props.type === 'add' && props.parent !== undefined}
                    >
                        {
                            buildModuleTree(moduleTree)
                        }
                    </TreeSelect>
                </Form.Item>
            </Form>

            {/*{*/}
            {/*    caseType?.id === 1 &&*/}
            {/*    */}
            {/*}*/}
        </Modal>
    )

};

export default withRouter(inject('workTestStore')(observer(WorkTestCaseCreateModal)));