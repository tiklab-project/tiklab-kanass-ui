/*
 * @Descripttion: 事项列表详情视图
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-08 10:49:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 15:40:41
 */
import React, { useEffect, useState } from "react";
import WorkAside from "./WorkAside";
import { withRouter } from "react-router";
import { Provider, observer } from "mobx-react";
import "./WorkList.scss";
import WorkStore from "../store/WorkStore";
import WorkCalendarStore from '../store/WorkCalendarStore';
import WorkDetail from "./WorkDetail";
import { finWorkList } from "./WorkGetList";
import { setSessionStorage } from "../../common/utils/setSessionStorage";
import { removeNodeInTree, removeNodeInTreeAddChildren } from "../../common/utils/treeDataAction";
import { setWorkDeatilInList } from "./WorkSearch";
const WorkList = (props) => {
    const projectId = props.match.params.id;
    const { workId, setWorkShowType, workShowType, workList, setWorkId, setWorkList, deleteWorkItem,
        totalPage, currentPage, searchCondition, setWorkIndex, deleteWorkItemAndChildren } = WorkStore;
    const path = props.match.path;
    const store = {
        workStore: WorkStore,
        workCalendarStore: WorkCalendarStore
    };
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const stageId = props.match.params.stage ? props.match.params.stage : null;

    /**
     * 获取事项列表
     */
    useEffect(() => {
        setWorkShowType("list")
        const params = {
            projectId: projectId,
            sprintId: sprintId,
            versionId: versionId,
            stageId: stageId
        }

        finWorkList(path, WorkStore, params);
        return;
    }, [projectId])

    /**
     * 设置事项详情页面的路由
     */
    useEffect(() => {
        if (workId && workId.length > 0) {
            const pathname = props.match.url;
            props.history.push(`${pathname}/${workId}`)
        }
        return;
    }, [workId]);

    /**
     * 删除事项
     */
    const deleteWork = (deleteWorkItem, removeTree) => {
        deleteWorkItem(workId).then(() => {
            // 当第当前页被删完, 总页数大于当前页
            if (workList.length === 0) {
                // 当前页被删完, 总页数等于当前页， 往前移动一页
                if (currentPage === totalPage && currentPage > 1) {
                    const params = {
                        pageParam: {
                            pageSize: searchCondition.pageParam.pageSize,
                            currentPage: currentPage - 1
                        }
                    }
                    setWorkDeatilInList(WorkStore, params)
                } else if (currentPage === totalPage && currentPage <= 1) {
                    // 当前页被删完, 总页数等于当前页，而且是第一页
                    setWorkId(0)
                    setWorkIndex(0)
                } else if (currentPage < totalPage) {
                    setWorkDeatilInList(WorkStore)
                }
            } else {
                const node = removeTree(workList, null, workId);
                if (node != null) {
                    setWorkId(node.id)
                    setSessionStorage("detailCrumbArray",
                        [{ id: node.id, code: node.code, title: node.title, iconUrl: node.workTypeSys?.iconUrl }])
                }
            }

        })
    }
    
    const delectCurrentWorkItem = () => {
        deleteWork(deleteWorkItem, removeNodeInTree)
    }


    
    const rowSpan = {
        xs: { span: "22", offset: "1" },
        sm: { span: "22", offset: "1" },
        md: { span: "22", offset: "1" },
        lg: {span: "22", offset: "1" },
        xl: { span: "22", offset: "1" },
        xxl: { span: "18", offset: "3" }
    }
    return (
        <Provider {...store}>
            <div className="work-list">
                <WorkAside
                    {...props}
                />
                <div className="work-list-detail">
                    <WorkDetail
                        {...props}
                        deleteWork={deleteWork}
                        delectCurrentWorkItem={delectCurrentWorkItem}
                        rowSpan={rowSpan}
                        workShowType={workShowType}
                    ></WorkDetail>
                </div>


            </div>
        </Provider>

    )
};

export default withRouter(observer(WorkList));
