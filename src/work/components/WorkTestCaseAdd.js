/*
 * @Author: 袁婕轩
 * @Date: 2024-12-26 16:02:00
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 16:49:08
 * @Description: 事项添加测试用例
 */
import React, { useEffect, useState, useRef } from "react";
import {Avatar, Empty, message, Modal, Space, Table} from 'antd';
import { observer, inject } from "mobx-react";
import "./WorkTestCaseAdd.scss";
import InputSearch from "../../common/input/InputSearch"
import { SelectSimple, SelectItem } from "../../common/select";
import {LeftOutlined, RightOutlined, UserOutlined} from "@ant-design/icons";
import {createWorkItemBindFn} from "./WorkTestCaseFn";
import UserIcon from "../../common/UserIcon/UserIcon";
import ImgComponent from "../../common/imgComponent/ImgComponent";
const WorkTestCaseAddmodal = (props) => {
    const { workTestStore, workStore, setWorkTestCaseList, projectId, showSelectTestCase, selectTestCase, workInfo } = props;
    const { workId } = workStore;

    const { findTestCasePageByWorkItemId, createWorkTestCase,
        findProjectTestRepositoryList, findUnRelationWorkTestCaseList, unRelationTotal, setUnRelationWorkCondition,
        findTesthuboRepositoryUserList } = workTestStore;

    const {getSelectUserList } = workStore;
    const [selectedRow, setSelectedRow] = useState([]);
    const [testCaseList, setTestCaseList] = useState([])
    const [repositoryallList, setRepositoryaList] = useState([]);
    const [repositoryallIdList, setRepositoryallIdList] = useState([]);
    const [repositoryValue, setRepositoryValue] = useState()
    const [testCaseUserList, setTestCaseUserList] = useState([]);

    const [currentPage, setCurrentPage] = useState();
    const [totalPage, setTotalPage] = useState();
    
    useEffect(() => {
        if (selectTestCase === true) {
            // getSelectUserList(projectId).then(res => {
            //     setTestCaseUserList(res.data.dataList)
            // })
            //获取项目内测试用例库未关联事项的测试用例
            findUnRelationWorkTestCaseList({
                workItemId: workId,
                name: "",
                projectId: projectId,
                pageParam: {
                    pageSize: 5,
                    currentPage: 1
                }
            }).then((data) => {
                if (data.code === 0) {
                    if (data.data.currentPage === 1){
                        setTestCaseList(data.data.dataList);
                    }else if (data.data.currentPage > 1){
                        setTestCaseList(testCaseList.concat(data.data.dataList));
                    }
                    setCurrentPage(data.data.currentPage)
                    setTotalPage(data.data.totalPage)
                }
            })


            //获取项目内测试用例库
            // findProjectTestRepositoryList({ projectId: projectId }).then(res => {
            //     if (res.code === 0) {
            //         setRepositoryaList(res.data)
            //         let list = []
            //         if (res.data.length > 0) {
            //             res.data.map(item => {
            //                 list.push(item.id)
            //             })
            //             setRepositoryallIdList(list)
            //             //获取项目内测试用例库未关联事项的测试用例
            //             findUnRelationWorkTestCaseList({
            //                 workItemId: workId,
            //                 repositoryIds: list,
            //                 name: "",
            //                 repositoryId: null,
            //                 pageParam: {
            //                     pageSize: 5,
            //                     currentPage: 1
            //                 }
            //             }).then((data) => {
            //                 if (data.code === 0) {
            //                     setTestCaseList(data.data.dataList)
            //                     setCurrentPage(data.data.currentPage)
            //                     setTotalPage(data.data.totalPage)
            //                 }
            //             })
            //             // //获取用例库作者
            //             // findTesthuboRepositoryUserList(list).then(res => {
            //             //     if(res.code === 0){
            //             //         setTestCaseUserList(res.data)
            //             //     }
            //             // })
            //         }else {
            //             Modal.confirm({
            //                 title: '提示?',
            //                 content: "该项目没有关联测试项目，是否先去添加测试项目",
            //                 centered: true,
            //                 okText: "去添加",
            //                 cancelText: "取消",
            //                 getContainer: testCaseAdd ? () => testCaseAdd.current : null,
            //                 onOk() { props.history.push({
            //                     pathname: `/project/${projectId}/test`,
            //                     state: { activeKey: "repository" }
            //                 }) }
            //             });
            //         }
            //
            //     }
            // })
        }
        
        return;
    }, [selectTestCase])

    const columns = [
        {
            title: "标题",
            dataIndex: "testCaseName",
            key: "title",
            width: "30%",
            ellipsis: true,
            render: (text, record) => (
                <div className="testCase-add-table-item">
                    {text}
                </div>
            )
        },
        {
            title: "模块",
            dataIndex: "moduleName",
            key: "moduleName",
            width: "20%",
            render: (text, record) => (
                <div className="testCase-add-table-item">
                    {text}
                </div>
            )
        },
        // {
        //     title: "项目",
        //     dataIndex: ["repository", "name"],
        //     key: "repository",
        //     width: "10%"
        // },
        {
            title: "负责人",
            dataIndex: "createUser",
            key: "createUser",
            width: "10%"
        },
        // {
        //     title: '操作',
        //     width: "10%",
        //     key: 'action',
        //     render: (text, record) => (
        //         <div style={{ display: "flex", gap: "15px" }}>
        //             <svg className="svg-icon projectSet-action-icon" aria-hidden="true" onClick={() => addWorkItemTestCase(record)}>
        //                 <use xlinkHref="#icon-add2"></use>
        //             </svg>
        //         </div>
        //     ),
        // }
    ];

    const addWorkItemTestCase = (record) => {
        const param = [{
            testCaseId: record.id,
            workItemId: workId,
            // repositoryId: record.kanassRepositoryId,
            projectId: projectId
        }]
        createWorkTestCase(param).then((data) => {
            if (data.code === 0) {
                //获取事项测试用例
                findTestCasePageByWorkItemId({ workItemId: workId }).then((data) => {
                    setWorkTestCaseList([...data])
                })
                // 如果是缺陷的话，测试那边新增一条缺陷与用例的关系
                if (workInfo.workTypeCode === "defect"){
                    createWorkItemBindFn(record.id, workId, projectId)
                }
                showSelectTestCase(false)
            }
        })
    }

    /**
     * 根据用例库id筛选未关联测试用例
     * @param {用例库id} value 
     */
    const searchUnselectWorkRepository = (value) => {
        let params;
        if(value){
            params = {
                repositoryIds: [value?.value],
                pageParam: {
                    pageSize: 5,
                    currentPage: 1
                }
            }
        }else {
            params = {
                repositoryIds: repositoryallIdList,
                pageParam: {
                    pageSize: 5,
                    currentPage: 1
                }
            }
        }
        setRepositoryValue(value)
        findUnRelationWorkTestCaseList(params).then((data) => {
            if (data.code === 0) {
                if (data.data.currentPage === 1){
                    setTestCaseList(data.data.dataList);
                }else if (data.data.currentPage > 1){
                    setTestCaseList(testCaseList.concat(data.data.dataList));
                }
                setCurrentPage(data.data.currentPage)
                setTotalPage(data.data.totalPage)
            }
        })
    }

    /**
     * 根据用例作者id筛选未关联测试用例
     * @param {用例作者id} value 
     */
    const searchUnselectUser = (value) => {
        const categoryQuery = {
            creatUserId: value.value,
            pageParam: {
                pageSize: 5,
                currentPage: 1
            }
        }
        findUnRelationWorkTestCaseList(categoryQuery).then((data) => {
            if (data.code === 0) {
                if (data.data.currentPage === 1){
                    setTestCaseList(data.data.dataList);
                }else if (data.data.currentPage > 1){
                    setTestCaseList(testCaseList.concat(data.data.dataList));
                }
                setCurrentPage(data.data.currentPage)
                setTotalPage(data.data.totalPage)
            }

        })
    }
    const searchSelectWorkRepository = (value) => {
        const categoryQuery = {
            name: value,
            pageParam: {
                pageSize: 5,
                currentPage: 1
            }
        }
        findUnRelationWorkTestCaseList(categoryQuery).then((data) => {
            if (data.code === 0) {
                if (data.data.currentPage === 1){
                    setTestCaseList(data.data.dataList);
                }else if (data.data.currentPage > 1){
                    setTestCaseList(testCaseList.concat(data.data.dataList));
                }
                setCurrentPage(data.data.currentPage)
                setTotalPage(data.data.totalPage)
            }

        })
    }
    
    /**
     * 选择测试用例
     * @param {已选测试用例} selected 
     * @param {已选测试用例列表} selectedRows 
     */
    const selectWorkRepository = (selected, selectedRows) => {
        setSelectedRow(selectedRows)
    }
    
    /**
     * 提交测试用例
     */
    const submitWorkRepositoryList = () => {
        const workItemTestCase = [];
        if (selectedRow.length !== 0) {
            for (let i = 0; i < selectedRow.length; i++) {
                workItemTestCase.push({ 
                    testCaseId: selectedRow[i].id, 
                    workItemId: workId, 
                    repositoryId: selectedRow[i].kanassRepositoryId,
                    projectId: projectId
                })
            }
            //创建事项测试用例
            createWorkTestCase(workItemTestCase).then((data) => {
                if (data.code === 0) {
                    //获取事项测试用例
                    findTestCasePageByWorkItemId({ workItemId: workId }).then((data) => {
                        setWorkTestCaseList([...data])
                    })
                    showSelectTestCase(false)
                }
            })
        } else {
            info()
        }
    }

    const changePage = (page) => {
        if (page < 1 || page > totalPage){
            return;
        }
        setUnRelationWorkCondition({
            pageParam:{
                pageSize:5,
                currentPage: page
            }
        })
        findUnRelationWorkTestCaseList().then((data) => {
            if (data.code === 0) {
                if (data.data.currentPage === 1){
                    setTestCaseList(data.data.dataList);
                }else if (data.data.currentPage > 1){
                    setTestCaseList(testCaseList.concat(data.data.dataList));
                }
                setCurrentPage(data.data.currentPage)
                setTotalPage(data.data.totalPage)
            }
        })
    }

    const loadNextPage = () => {
        setUnRelationWorkCondition({
            pageParam:{
                pageSize:5,
                currentPage: currentPage + 1
            }
        })
        findUnRelationWorkTestCaseList().then((data) => {
            if (data.code === 0) {
                if (data.data.currentPage === 1){
                    console.log("111111", data.data.dataList)
                    setTestCaseList(data.data.dataList);
                }else if (data.data.currentPage > 1){
                    setTestCaseList(testCaseList.concat(data.data.dataList));
                }
                // setTestCaseList(data.data.dataList)
                setCurrentPage(data.data.currentPage)
                setTotalPage(data.data.totalPage)
            }
        })
    }

    //没有选择用户提升
    const info = () => {
        message.info('请选择事项');
    };
    const testCaseAdd = useRef()
    return (
        <>
            <div className="testCase-add" ref={testCaseAdd}>

                <div className="testCase-add-modal-top">
                    <div className="testCase-add-table-title">选择用例</div>
                    <div className="testCase-add-submit">
                        <span className="close-icon" onClick={() => showSelectTestCase(false)}>
                               ×
                        </span>
                    </div>
                </div>
                <div className="testCase-add-search">
                    <InputSearch style={{ minWidth: "150px", flex: 1 }} onChange={(value) => searchSelectWorkRepository(value)} placeholder={"搜索用例"} />
                    {/*<SelectSimple*/}
                    {/*    name="repository"*/}
                    {/*    onChange={(value) => searchUnselectWorkRepository(value)}*/}
                    {/*    title={"项目"}*/}
                    {/*    suffixIcon = {true}*/}
                    {/*    value = {repositoryValue}*/}
                    {/*>*/}
                    {/*    {*/}
                    {/*        repositoryallList.map(item => {*/}
                    {/*            return <SelectItem*/}
                    {/*                value={item.id}*/}
                    {/*                label={item.testRepositoryName}*/}
                    {/*                key={item.id}*/}
                    {/*                // imgUrl={`${base_url}/${item.iconUrl}`}*/}
                    {/*            />*/}
                    {/*        })*/}
                    {/*    }*/}
                    {/*</SelectSimple>*/}
                    {
                        testCaseUserList && testCaseUserList.length > 0 && <SelectSimple name="user"
                            onChange={(value) => searchUnselectUser(value)}
                            title={"负责人"}
                            suffixIcon = {true}
                        >
                            {
                                testCaseUserList.map(item => {
                                    return <SelectItem
                                        value={item.id}
                                        label={item.nickname}
                                        key={item.id}
                                    />
                                })
                            }
                        </SelectSimple>
                    }
                </div>
                <div className="testCase-add-model">
                    {
                        testCaseList.length > 0 && testCaseList.map((item, index) => {
                            return <div className="testCase-add-work-item" onClick={() => addWorkItemTestCase(item)} key={item.id}>
                                <div className="work-item-icon">
                                    <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                        <svg className="img-icon-right" aria-hidden="true">
                                            <use xlinkHref="#icon-gongneng1"></use>
                                        </svg>
                                        <div className="work-item-title">{item.testCaseName} </div>
                                    </div>
                                </div>
                                <div className="work-item-right">
                                    {
                                        item.createUser ? (
                                            <>
                                                <Avatar style={{width:"20px",height:"20px",lineHeight:"20px",verticalAlign: 'middle',}}>{item.createUser[0]}</Avatar>
                                                <span className={"text-ellipsis"}>{item.createUser} </span>
                                            </>
                                        ) : (
                                            <>
                                                <Avatar  style={{flex:"none"}} size="small" icon={<UserOutlined />} />
                                                <div className="work-item-icon"> 未设置 </div>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        })
                    }
                    {/*<Table*/}
                    {/*    columns={columns}*/}
                    {/*    dataSource={testCaseList}*/}
                    {/*    rowKey={record => record.id}*/}
                    {/*    onRow={(record, index) => {*/}
                    {/*        return {*/}
                    {/*            onClick: (event) => {*/}
                    {/*                // 处理行点击事件*/}
                    {/*                addWorkItemTestCase(record)*/}
                    {/*            },*/}
                    {/*        };*/}
                    {/*    }}*/}
                    {/*    pagination={false}*/}
                    {/*    showHeader={false}*/}
                    {/*    scroll={{x: "100%"}}*/}
                    {/*    locale={{*/}
                    {/*        emptyText: <Empty*/}
                    {/*            imageStyle={{height: 100}}*/}
                    {/*            description={<span>暂无数据</span>}*/}
                    {/*        />*/}
                    {/*    }}*/}
                    {/*/>*/}
                    {
                        unRelationTotal > currentPage * 5 ?
                            <div className="testCase-item-more" onClick={loadNextPage}>加载更多</div>
                            :
                            <div className="testCase-item-more">到底啦~</div>
                    }
                    {/*<div className="testCase-add-page">*/}
                    {/*    <div className="testCase-add-page-total">*/}
                    {/*        共{unRelationTotal}条*/}
                    {/*    </div>*/}
                    {/*    <div className="testCase-add-bottom" >*/}
                    {/*        <div className="page-button" onClick={() => changePage(currentPage - 1)}>*/}
                    {/*            <LeftOutlined className={`${currentPage === 1 ? "page-disable" : ""}`} />*/}
                    {/*        </div>*/}

                    {/*        <span>*/}
                    {/*            {currentPage}*/}
                    {/*        </span>*/}
                    {/*        <span>*/}
                    {/*            &nbsp; / &nbsp;*/}
                    {/*        </span>*/}
                    {/*        <span>*/}
                    {/*            {totalPage}*/}
                    {/*        </span>*/}
                    {/*        <div className="page-button" onClick={() => changePage(currentPage + 1)}>*/}
                    {/*            <RightOutlined className={`${currentPage === totalPage ? "page-disable" : ""}`} />*/}
                    {/*        </div>*/}

                    {/*    </div>*/}
                    {/*    /!*<div className="testCase-add-page-ref" onClick={() => refresh()} >*!/*/}
                    {/*    /!*    <svg className="svg-icon" aria-hidden="true">*!/*/}
                    {/*    /!*        <use xlinkHref="#icon-refresh"></use>*!/*/}
                    {/*    /!*    </svg>*!/*/}
                    {/*    /!*</div>*!/*/}
                    {/*</div>*/}
                </div>

            </div>
        </>
    );
};

export default inject('workStore', 'workTestStore')(observer(WorkTestCaseAddmodal));
