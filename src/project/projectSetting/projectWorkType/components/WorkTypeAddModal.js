import React, { useState } from "react";
import { Modal, Form, Table } from 'antd';
import "./WorkType.scss"
import Button from "../../../../common/button/Button";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router";


const WorkTypeAddModal = (props) => {

    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const { workAllTypeList, projectWorkStore } = props;
    const { findSelectWorkTypeDmList, workSelectTypeList, createWorkTypeDm } = projectWorkStore;
    const projectId = props.match.params.id;
    const [selectWorkType, setSelelctWorkType] = useState()

    const showModal = () => {
        setVisible(true);
        let ids = []
        workAllTypeList.map(item => {
            ids.push(item.workType.id)
        })
        findSelectWorkTypeDmList({ selectIds: ids }).then(res => {
            if (res.code === 0) {
                console.log(res.data)
            }
        })
    };

    const onFinish = () => {
        // const data = { projectId: projectId, }
        // createWorkTypeDm(data).then(res => {
        //     if (res.code === 0) {
        //         setVisible(false);
        //     }
        // })
        selectWorkType.map((item, index) => {
            const data = {
                projectId: projectId,
                workType: item,
                flow: item.flow,
                form: item.form
            }
            createWorkTypeDm(data).then(res => {
                if (res.code === 0 && selectWorkType.length === index +1) {
                    setVisible(false)
                }
            })
        })

    };

    const onCancel = () => {
        form.resetFields();
        setVisible(false);
    };

    const columns = [
        {
            title: "类型名称",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <div className="work-type-name" >
                    <div className="work-type-icon">
                        {
                            record.iconUrl ?
                                <img
                                    src={('/images/' + record.iconUrl)}
                                    alt=""
                                    className="img-icon"
                                />
                                :
                                <img
                                    src={('images/workType1.png')}
                                    alt=""
                                    className="img-icon"
                                />
                        }
                    </div>
                    <div className="work-type-text">{text}</div>
                </div>
            )
        },
        {
            title: "描述",
            dataIndex: "desc",
            key: "desc",
        },
        {
            title: '表单配置',
            dataIndex: ['form', 'name'],
            key: 'form',
            render: (text, record) => <div onClick={() => goForm(record.form.id)} className="span-botton">{text}</div>,
        },
        {
            title: '流程配置',
            dataIndex: ['flow', 'name'],
            key: 'flow',
            render: (text, record) => <div onClick={() => goFlow(record.flow.id)} className="span-botton">{text}</div>
        }

    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelelctWorkType(selectedRows)
        },
        onSelect: (record, selected, selectedRows, nativeEvent ) => {
            console.log(record, selected, selectedRows, nativeEvent)
        }
        // getCheckboxProps: (record) => ({
        //     disabled: record.name === 'Disabled User',
        //     // Column configuration not to be checked
        //     name: record.name,
        // }),
    };

    return (
        <>
            <div >
                <Button type={"primary"} onClick={showModal}>
                    添加事项类型
                </Button>
                <Modal
                    title="添加事项类型"
                    visible={visible}
                    // footer={null}
                    onOk={onFinish}
                    onCancel={onCancel}
                    className="work-type-addmodel"
                    closable={false}
                >
                    <Table
                        rowSelection={{
                            type: "checkbox",
                            ...rowSelection,
                        }}
                        columns={columns}
                        rowKey={(record) => record.id}
                        dataSource={workSelectTypeList}
                        pagination={false}
                    />
                </Modal>
            </div>
        </>
    );
};

export default withRouter(inject("projectWorkStore")(observer(WorkTypeAddModal)));