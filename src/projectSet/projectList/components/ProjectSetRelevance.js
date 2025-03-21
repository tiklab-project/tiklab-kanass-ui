/*
 * @Descripttion: 项目集关联项目弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-05 15:41:43
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:49:39
 */
import React, { useState,useEffect } from "react";
import { Modal, Divider,Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import "./ProjectSetRelevance.scss";
import Button from "../../../common/button/Button";
import ProjectSetProjectStore from "../store/ProjectSetProjectStore";
import ProjectSetStore from "../../../projectSet/projectSet/store/ProjectSetStore";
import { observer } from 'mobx-react';
const ProjectSetRelevance = (props) => {
    const { projectSetId } = props;
    const { findProjectIsOrNotRe, noRelatedProjects, relatedProjects, addRelevance, findProjectList } = ProjectSetProjectStore;
    const [visible, setVisible] = useState(false)
    const [checkedList, setCheckedList] = useState([]);
    const [projectSetName, setProjectSetName] = useState('');

    // 在组件挂载时获取项目集名称
    useEffect(() => {
        const fetchData = async () => {
            if (projectSetId) {
                const res = await ProjectSetStore.findProjectSet(projectSetId); // 调用 ProjectSetStore 的方法
                if (res.code === 0) {
                    setProjectSetName(res.data.name || "未命名项目集"); // 假设接口返回的名称字段为 "name"
                }
            }
        };
        fetchData();
    }, [projectSetId]);

    /**
     * 添加项目集
     */
    const addProjectSet = () => {
        setVisible(true)
        findProjectIsOrNotRe()

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

    /*const deleteRelevance = (id) => {
        // 右边删除，左边多选框变为未选中
        const noSelect = document.getElementById(id)
        noSelect.checked = false;

        // 把删除项从已选择数组中移除
        let check = [];
        check = checkedList.filter((item) => {
            return item.id !== id
        })
        setCheckedList([...check])

        const all = document.getElementsByName("all")[0]
        if (all.checked = true) {
            all.checked = false
        }
    }*/
    const deleteRelevance = (id) => {
        const noSelect = document.getElementById(id);
        noSelect.checked = false;

        setCheckedList(prev => prev.filter(item => item.id !== id));

        const all = document.getElementsByName("all")[0];
        if (all && all.checked === true) {
            all.checked = false;
        }
    };


    return <div >
        <Button type="primary" onClick={() => addProjectSet()}>关联项目</Button>
        <Modal
            title={`关联项目至：${projectSetName || '项目集'}`}
            visible={visible}
            onOk={sumitFrom}
            onCancel={submitCancel}
            cancelText="取消"
            okText="确定"
            width={800}
            className="projectSet-relevance"
            destroyOnClose={true}
            closable = {false}
        >
            <div className="projectSet-box">
                <div className="projectSet-box-left">
                    <div className="checkbox">
                        <label htmlFor="all">全选</label>
                        <input type="checkbox" name="all" value="all" onChange={(e) => onCheckAllChange(e)} />
                    </div>
                    <Divider />

                    <p>未关联项目</p>
                    {
                        noRelatedProjects && noRelatedProjects.map((item) => {
                            return (
                                <div className="checkbox" key={item.id}>
                                    <label htmlFor={item.id}>
                                        <Tooltip title={item.projectName}>
                                            <span style={{ display: 'inline-block', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item.projectName}
                                            </span>
                                        </Tooltip>
                                    </label>
                                    <input type="checkbox" name="noSelectProject" id={item.id} value={item.id} onChange={(e) => onCheckChange(e)} />
                                </div>
                            )
                        })
                    }
                    <Divider />

                    <p>已关联项目</p>
                    {
                        relatedProjects && relatedProjects.map((item) => {
                            return (
                                <div className="checkbox" key={item.id}>
                                    <label htmlFor={item.id}>
                                        <Tooltip title={item.projectName}>
                                            <span style={{ display: 'inline-block', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item.projectName}
                                            </span>
                                        </Tooltip>
                                    </label>
                                    <input type="checkbox" name="relevanceProject" value={item.id} disabled />
                                </div>
                            )
                        })
                    }
                </div>
                <div className="projectSet-box-right">
                    <div className="projectSet-box-right-title">
                        <span>已选项目</span>
                        <span className="project-clear" onClick={() => handleClearChecked()}>清空</span>
                    </div>
                    <Divider />
                    {
                        checkedList && checkedList.map((item,) => {
                            return (
                                <div className="checkbox" key={item.id}>
                                    <label htmlFor={item.id}>
                                        <Tooltip title={item.projectName}>
                                            <span style={{ display: 'inline-block', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item.projectName}
                                            </span>
                                        </Tooltip>
                                    </label>
                                    <span onClick={() => deleteRelevance(item.id)}><DeleteOutlined /></span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </Modal>
    </div>
}
export default observer(ProjectSetRelevance);