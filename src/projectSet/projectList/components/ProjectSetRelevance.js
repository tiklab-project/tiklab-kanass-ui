/*
 * @Descripttion: 项目集关联项目弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-05 15:41:43
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:49:39
 */
import React, { useState,useEffect } from "react";
import {Modal, Divider, Tooltip, Table, Space} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import "./ProjectSetRelevance.scss";
import Button from "../../../common/button/Button";
import ProjectSetProjectStore from "../store/ProjectSetProjectStore";
import ProjectSetStore from "../../../projectSet/projectSet/store/ProjectSetStore";
import { observer } from 'mobx-react';
import InputSearch from "../../../common/input/InputSearch";
import ColorIcon from "../../../common/colorIcon/ColorIcon";
import UserIcon from "../../../common/UserIcon/UserIcon";
import PaginationCommon from "../../../common/caseCommon/pagination/Page";
const ProjectSetRelevance = (props) => {
    const { projectSetId } = props;
    const { findProjectIsOrNotRe, noRelatedProjects, relatedProjects, addRelevance, findProjectList, findNotRelateProjectPage, notRelateTotal } = ProjectSetProjectStore;
    const [visible, setVisible] = useState(false)
    const [checkedList, setCheckedList] = useState([]);
    const [projectSetName, setProjectSetName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    // 在组件挂载时获取项目集名称
    useEffect(() => {
        fetchData();
    }, [projectSetId]);

    const fetchData = async () => {
        if (projectSetId) {
            const res = await ProjectSetStore.findProjectSet(projectSetId); // 调用 ProjectSetStore 的方法
            if (res.code === 0) {
                setProjectSetName(res.data.name || "未命名项目集"); // 假设接口返回的名称字段为 "name"
            }
        }
    };

    const findPage = (values) => {
        findNotRelateProjectPage(values).then(res => {
            if (res.code === 0){
                setCurrentPage(res.data.currentPage)
                setTotalPage(res.data.totalPage)
            }
        })
    }

    /**
     * 添加项目集
     */
    const addProjectSet = () => {
        setVisible(true)
        findPage()

    }

    /**
     * 取消提交
     */
    const submitCancel = () => {
        setCheckedList([])
        setVisible(false)
    }

    // 提交表单
    const sumitFrom = () => {
        const changeList = [];
        checkedList.map((item) => {
            changeList.push(item.id);
            return changeList
        })
        addRelevance({
            id: projectSetId,
            ids: changeList
        }).then((data) => {
            if (data.code === 0) {
                findProjectList(projectSetId)
                setVisible(false)
                setCheckedList([])
            }
        })
    }
    const onCheckChange = e => {
        const all = document.getElementsByName("all")[0];
        if (e.target.checked === true) {
            let noCheck = noRelatedProjects.find((item) => item.id === e.target.value);

            setCheckedList(prev => [...prev, noCheck]);

            // 如果所有未关联被选中，全选变为true
            if (checkedList.length + 1 === noRelatedProjects.length) {
                all.checked = true;
            }
        } else {
            setCheckedList(prev => prev.filter(item => item.id !== e.target.value));

            if (all && all.checked === true) {
                all.checked = false;
            }
        }
    };

    /*const onCheckChange = e => {
        const all = document.getElementsByName("all")[0]
        if (e.target.checked === true) {
            let noCheck = []
            noCheck = noRelatedProjects.filter((item) => {
                return item.id === e.target.value
            })

            setCheckedList(prev => [...prev, noCheck[0]]);

            // 如果所有未关联被选中，全选变为true
            if (checkedList.length === noRelatedProjects.length) {
                all.checked = true
            }
        } else {
            let check = [];
            check = checkedList.filter((item) => {
                return item.id !== e.target.value
            })
            setCheckedList([...check])
            if (all.checked = true) {
                all.checked = false
            }
        }
    };*/

    const onCheckAllChange = e => {
        const noSelect = document.getElementsByName("noSelectProject")
        if(e.target.checked === true){
            setCheckedList(noRelatedProjects)
        } else {
            setCheckedList([])
        }
        console.log(noSelect)
        console.log(noRelatedProjects)
        for (var i = 0; i < noRelatedProjects.length; i++) {
            noSelect[i].checked = e.target.checked;
            // if (e.target.checked === true) {
            //     setCheckedList(noRelatedProjects)
            // } else {
            //     setCheckedList([])
            // }
        }
    };

    const handleClearChecked = () => {
        setCheckedList([]); // 清空 checkedList
        const all = document.getElementsByName("all")[0];
        if (all) {
            all.checked = false; // 取消全选框的选中状态
        }
        // 遍历所有未关联项目的复选框并取消选中状态
        const noSelect = document.getElementsByName("noSelectProject");
        for (let i = 0; i < noSelect.length; i++) {
            noSelect[i].checked = false;
        }
    };

    const status = {
        1: "未开始",
        2: "进行中",
        3: "已结束",
    }

    // 列数据
    const columns = [
        {
            title: "名称",
            dataIndex: "projectName",
            key: "projectName",
            align: "left",
            render: (text, record) => <div className="project-name" >
                <div className="project-icon">
                    <ColorIcon color={record?.color} name={record.projectName} className={"img-32"} />
                </div>
                <div>
                    {
                        text.length > 10 ?
                            <Tooltip title={text}>
                                <div className="project-text">{text.substring(0, 10) + "..."}</div>
                            </Tooltip>
                            :<div className="project-text">{text}</div>
                    }
                </div>

            </div>
        },
        {
            title: "项目类型",
            width: "15%",
            dataIndex: ["projectType", "name"],
            key: "projectType",
            align: "left",
            render: (text, record) =>
                <div className="project-name">
                    <div >{text === 'IPD项目' ? text.substring(0,3) : text.substring(0,2)}</div>
                </div>
        },
        {
            title: "项目状态",
            dataIndex: "projectState",
            key: "projectState",
            align: "left",
            width: "10%",
            render: (text, record) => (
                <div className={`project-status project-status${text === "1" ? "-todo" : text === "2" ? "-process" : "-done"}`}>{status[text]}</div>
            )
        },
        {
            title: "负责人",
            dataIndex: ["master", "nickname"],
            key: "master",
            align: "left",
            width: "8%",
            render: (text, record) => (
                <Space>
                    <UserIcon name={text} />
                    {text}
                </Space>
            )
        },
        {
            title: "创建时间",
            dataIndex: "createTime",
            key: "createTime",
            align: "left",
            width: "15%",
            render: (text, record) => (
                <>
                    {text}
                </>
            )
        },
    ]

    const deleteRelevance = (id) => {
        const noSelect = document.getElementById(id);
        noSelect.checked = false;

        setCheckedList(prev => prev.filter(item => item.id !== id));

        const all = document.getElementsByName("all")[0];
        if (all && all.checked === true) {
            all.checked = false;
        }
    };

    const onSearch = (e) => {
        const params = {projectName: e.target.value}
        findPage(params);
    };

    const onPageChange = (currentPage) => {
        const params = {
            pageParam: {
                currentPage: currentPage
            }

        }
        findPage(params)
    }

    const handleRowClick = (record) => {
        const changeList = [];
        changeList.push(record.id);
        addRelevance({
            id: projectSetId,
            ids: changeList
        }).then((data) => {
            if (data.code === 0) {
                findProjectList(projectSetId)
                setVisible(false)
            }
        })
    }

    return <div >
        <Button type="primary" onClick={() => addProjectSet()}>关联项目</Button>
        <Modal
            title={`关联项目至：${projectSetName || '项目集'}`}
            visible={visible}
            onOk={sumitFrom}
            onCancel={submitCancel}
            cancelText="取消"
            okText="确定"
            footer={null}
            width={800}
            className="projectSet-relevance"
            destroyOnClose={true}
            closable = {false}
        >
            <div className="projectSet-relate-box">
                <div className={"projectSet-relate-top"}>
                    <div className="project-search">
                        <InputSearch
                            placeholder="搜索项目"
                            allowClear
                            style={{ width: 190 }}
                            onChange={onSearch}
                        />
                    </div>
                </div>
                <div className={"projectSet-relate-content"}>
                    <Table
                        className="projectSet-table-box"
                        columns={columns}
                        dataSource={noRelatedProjects}
                        rowKey={record => record.id}
                        onRow={(record) => ({
                            onClick: () => {
                                console.log("点击了", record.id)
                                handleRowClick(record)
                            },
                        })}
                        pagination={false}
                        scroll={{
                            x: "100%"
                        }}
                    />
                    <PaginationCommon
                        currentPage={currentPage}
                        changePage={onPageChange}
                        totalPage={totalPage}
                        total={notRelateTotal}
                        // findPage={findPage}
                        // showRefer={false}
                    />
                </div>
            </div>
        </Modal>
    </div>
}
export default observer(ProjectSetRelevance);