import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Divider, Table } from 'antd';
import { EditOutlined } from "@ant-design/icons";
import "./WorkFunctionPrivilege.scss";

const CheckboxGroup = Checkbox.Group;
const plainOptions = ['Apple', 'Pear', 'Orange'];
const defaultCheckedList = ['Apple', 'Orange'];

const WorkFunctionPrivilege = props => {
    const [checkedList, setCheckedList] = useState(defaultCheckedList);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    const onChange = (list) => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < plainOptions.length);
        setCheckAll(list.length === plainOptions.length);
    };
    const [checkBoxGroup, setCheckBoxGroup] = useState({
        workLog: [
            {
                value: "addLog",
                label: "添加工时",
                parent: "workLog"
            },
            {
                value: "deleteLog",
                label: "删除工时",
                parent: "workLog"
            },
            {
                value: "editLog",
                label: "编辑工时",
                parent: "workLog"
            },
        ],
        workChildren: [
            {
                value: "addChildren",
                label: "添加子事项",
                parent: "workChildren"
            },
            {
                value: "deleteChildren",
                label: "删除子事项",
                parent: "workChildren"
            }
        ],
        workRelation: [
            {
                value: "addRelation",
                label: "添加关联事项",
                parent: "workRelation"
            },
            {
                value: "deleteRelation",
                label: "删除关联事项",
                parent: "workRelation"
            },

        ]
    });
    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? plainOptions : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };
    const [isEdit, setIsEdit] = useState(false);
    const cancel = () => {
        setIsEdit(false)
    }

    const save = () => {
        setIsEdit(false)
    }

    const onChangeItem = () => {

    }

    const checkBoxData = [
        {
            value: "workLog",
            label: "workLog",
            indeterminate: false,
            checkedList: ["addLog", "deleteLog", "editLog"],
            checkAll: false,
        },
        {
            value: "workChildren",
            label: "workChildren",
            indeterminate: false,
            checkedList: ["addChildren", "deleteChildren"],
            checkAll: false,
        },
        {
            value: "workRelation",
            label: "workRelation",
            indeterminate: false,
            checkedList: ["addRelation", "deleteRelation"],
            checkAll: false
        }
    ];

    const columns = [
        {
            title: '模块',
            key: 'label',
            width: "30%",
            render: (record) => {
                return (
                    <Checkbox
                        disabled={!isEdit}
                        indeterminate={record.indeterminate}
                        onChange={(list) => onCheckAllChange(list, record)}
                        checked={record.checkAll}
                    >{record.label}</Checkbox>
                )
            },
        },
        {
            title: '功能点',
            key: 'name',
            render: (record) => {
                return (
                    <div className='privilege-role-promise'>
                        <CheckboxGroup
                            disabled={!isEdit}
                            options={checkBoxGroup[record.value]}
                            value={record.checkedList}
                            onChange={(list) => onChangeItem(list, record)}
                        />
                    </div>
                )
            },
        },
    ]


    return (
        <div className="work-function-privilege">
            {/* <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                Check all
            </Checkbox>
            <Divider />
            <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} /> */}
            {
                isEdit ?
                    <div className="work-function-promisse" >
                        <Button onClick={() => cancel()} isMar={true}>取消</Button>
                        <Button type={"primary"} onClick={() => save()}>保存</Button>
                    </div>
                    :
                    // (isBase || roleDetail.businessType !== 2) &&
                    <div className="work-function-promisse">
                        <Button onClick={() => setIsEdit(true)} icon={<EditOutlined />}>编辑</Button>
                    </div>
            }
            <div className="work-function-promisse-table">
                <Table
                    bordered
                    pagination={false}
                    columns={columns}
                    dataSource={checkBoxData}
                    rowKey={r => r.value}
                />
            </div>
        </div>
    )
}

export default WorkFunctionPrivilege
