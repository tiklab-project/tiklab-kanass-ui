/**
 * @description：测试计划中关联用例
 * @date: 2021-08-20 17:00
 */
import React, {useEffect, useState} from 'react';
import { observer, inject } from "mobx-react";
import {Modal, Table,  Row, Col, Input} from 'antd';
import {showCaseTypeTable, showCaseTypeView, showStatus} from "../../../../common/caseCommon/CaseCommonFn";
import testPlanDetailStore from "../store/testPlanDetailStore";
import PaginationCommon from "../../../../common/caseCommon/pagination/Page";
import IconBtn from "../../../../common/caseCommon/iconBtn/IconBtn";
import {Axios} from "tiklab-core-ui";
import ImgComponent from "../../../../common/imgComponent/ImgComponent";
import UserIcon from "../../../../common/UserIcon/UserIcon";
import ProjectEmpty from "../../../../common/component/ProjectEmpty";
import "./TestPlanCaseSetDirectorModal.scss"
import InputSearch from "../../../../common/input/InputSearch";
import testcaseStore from "../../../testcase/store/testcaseStore";

// 添加与编辑
const TestPlanBindCaseModal = (props) => {
    const {selectChange, selectedRowKeys} = props;
    const {updateTestCaseList} = testcaseStore

    const projectId = localStorage.getItem('projectId')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userList, setUserList] = useState([]);
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [displayCount, setDisplayCount] = useState(10); // 默认显示10条
    const [searchValue, setSearchValue] = useState('');

    const showModal = () => {
        findList()
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setDisplayCount(10);
    };

    const batchSetDirector = (user) => {
        // selectRowKeys;
        console.log("设置负责人")
        let updateCaseItems = [];
        for (const selectedRowKey of selectedRowKeys) {
            updateCaseItems.push({
                id: selectedRowKey,
                director: {id:user.id}
            })
        }

        updateTestCaseList(updateCaseItems).then(res => {
            selectChange();
        })
    }

    const loadNextPage = () => {
        setDisplayCount(prev => prev + 10); // 每次增加10条
    }

    const onSearch = (value) =>{
        setSearchValue(value);
        if (value) {
            const filtered = userList.filter(user =>
                user.user.nickname.toLowerCase().includes(value.toLowerCase())
            );
            console.log("filtered", filtered)
            setDisplayedUsers(filtered.slice(0, displayCount));
        } else {
            setDisplayedUsers(userList.slice(0, displayCount));
        }
    }

    const findList = async (params) =>{
        let param = {
            // pageParam: {
            //     pageSize: pageSize,
            //     currentPage:1
            // },
            domainId:projectId,
            ...params
        }
        const dmUserRes = await Axios.post("/dmUser/findDmUserList",param);
        if(dmUserRes.code===0){
            setUserList(dmUserRes.data);
            setDisplayedUsers(dmUserRes.data.slice(0, displayCount));
        }
    }

    // 当displayCount变化时更新显示的用户
    useEffect(() => {
        if (searchValue) {
            const filtered = userList.filter(user =>
                user.user.nickname.toLowerCase().includes(searchValue.toLowerCase())
            );
            setDisplayedUsers(filtered.slice(0, displayCount));
        } else {
            setDisplayedUsers(userList.slice(0, displayCount));
        }
    }, [displayCount, userList, searchValue]);

    return (
        <>
            <div style={{position: "relative"}}>
                <IconBtn
                    className="pi-icon-btn-grey"
                    onClick={showModal}
                    name={"批量设置负责人"}
                />
                {
                    isModalOpen && (
                        <div className="custom-dropdown-menu">
                            <div className={"director-add-table-search"}>
                                <InputSearch onChange={(value) => onSearch(value)} placeholder={"搜索负责人"}/>
                            </div>
                            <div className="dropdown-content">
                                {displayedUsers && displayedUsers.length > 0 ? (
                                    <div className="director-add-table">
                                        {displayedUsers.map(item => (
                                            <div
                                                className="director-add-item"
                                                onClick={() => {
                                                    batchSetDirector(item.user);
                                                    handleCancel(); // 选择后关闭下拉
                                                }}
                                                key={item.user.id}
                                            >
                                                <div className="item-icon">
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                        <UserIcon name={item.user.nickname} />
                                                        <div className="item-name">{item.user.nickname}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {
                                            displayedUsers.length > displayCount ? (
                                                <div className="director-add-table-page loading-more" onClick={loadNextPage}>
                                                    加载更多
                                                </div>
                                            ) : displayedUsers.length > 0 ? (
                                                <div className="director-add-table-page">到底啦~</div>
                                            ) : null
                                        }
                                    </div>
                                ) : (
                                    <div className="director-add-table">
                                        <ProjectEmpty description="暂时没有可设置的人员~" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    );
};

export default inject("testcaseStore")(observer(TestPlanBindCaseModal));
