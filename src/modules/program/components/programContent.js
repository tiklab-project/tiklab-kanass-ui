/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-05 09:41:05
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-10 10:35:43
 */
import React, { useEffect, useState, Fragment } from 'react';
import { Breadcrumb, Input, Table, Space, Button, Divider, Row, Col, Select, Modal } from 'antd';
import "../components/program.scss";
import ProgramAdd from "./programAdd";
import { inject, observer } from 'mobx-react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { Search } = Input;
const { confirm } = Modal;

const ProgramContent = (props) => {
    const { programStore, visible, setVisible, type, setType } = props;
    const { getProgramlist, programList, programPageParams, deleProgram, getUseList, uselist } = programStore;

    // const [visible,setVisible] = useState(false)
    const [name, setName] = useState("项目集")
    // const [type,setType] = useState("add")
    const [programId, setProgramId] = useState()

    useEffect(() => {
        getProgramlist()
        getUseList()
    }, [])

    /**
     * 进入项目集详情
     * @param {*} id 
     */
    const goProgramDetail = (id) => {
        props.history.push(`/index/program/programDetail/${id}`)
    }

    /**
     * 删除项目集
     * @param {*} id 
     */
    const deleProgarm = (id) => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <div>确认删除？</div>,
            onOk() {
                deleProgram(id)
            }
        })
    }

    /**
     * 编辑项目集
     * @param {*} programName 
     * @param {*} id 
     */
    const editProgarm = (programName, id) => {
        setVisible(true)
        setName(`编辑${programName}`)
        setType("edit")
        setProgramId(id)
    }

    /**
     * 添加项目集
     */
    const addProgram = () => {
        setVisible(true)
        setName("添加项目集")
        setType("add")
        setProgramId("")
    }

    /**
     * 根据负责人搜索
     * @param {*} value 
     */
    const changeMaster = (value) => {
        getProgramlist({ master: value })
    }

    const onSearch = (value) => {
        console.log(value)
        getProgramlist({ name: value })
    }

    /**
     * 翻页
     * @param {*} pagination 
     */
    const pageDowm = (pagination) => {
        getProgramlist({ current: pagination.current })
    }

    // 列数据
    const columns = [
        {
            title: "名称",
            dataIndex: "name",
            key: "name",
            align: "center",
            render: (text, record) => <span onClick={() => goProgramDetail(record.id)} className="span-botton">
                <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon1_cheese"></use>
                </svg>
                {text}
            </span>,
        },
        {
            title: "负责人",
            dataIndex: ["master", "name"],
            key: "master",
            align: "center",

        },
        {
            title: "计划开始时间",
            dataIndex: "startTime",
            key: "startTime",
            align: "center",
        },
        {
            title: "计划结束时间",
            dataIndex: "endTime",
            key: "endTime",
            align: "center",
        },
        {
            title: "项目数量",
            dataIndex: "projectNumber",
            key: "projectNumber",
            align: "center"
        },
        {
            title: "描述",
            dataIndex: "remark",
            key: "remark",
            align: "center"
        },
        {
            title: "操作",
            dataIndex: "action",
            key: "action",
            align: "center",
            render: (text, record) => (
                <Space size="middle">
                    <span className="span-botton" onClick={() => editProgarm(record.name, record.id)}>
                        <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#iconchuangzuo-copy"></use>
                        </svg>
                        编辑
                    </span>
                    <span className="span-botton  delete" onClick={() => deleProgarm(record.id)}>
                        <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#iconshanchu2-copy"></use>
                        </svg>
                        删除
                    </span>
                </Space>
            )
        }
    ]

    return <div className="program">
        <Breadcrumb>
            <Breadcrumb.Item>项目集列表</Breadcrumb.Item>
        </Breadcrumb>
        <Divider />
        <div className="search-add">
            <div>
                <Search
                    placeholder="请输入关键字"
                    allowClear
                    onSearch={(value) => onSearch(value)}
                    style={{ width: 200, marginRight: "20px" }}
                />
                <Select
                    placeholder="请选择负责负责人"
                    allowClear
                    onSelect={(value) => changeMaster(value)}
                    onClear={() => changeMaster()}
                    style={{ width: 120 }}
                >
                    {
                        uselist && uselist.map((item, index) => {
                            return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                        })
                    }
                </Select>
            </div>

            <Button type="primary" onClick={() => addProgram()}>+添加项目集</Button>
        </div>
        <div className="table-box">
            <Table
                columns={columns}
                dataSource={programList}
                rowKey={record => record.id}
                pagination={{ ...programPageParams }}
                onChange={pageDowm}
            />
        </div>
        <ProgramAdd
            visible={visible}
            setVisible={setVisible}
            name={name}
            type={type}
            programId={programId}
            setType={setType}
        />
    </div>
}

export default inject('programStore')(observer(ProgramContent));