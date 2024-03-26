/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-08 10:49:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-18 17:32:06
 */
import React, { useEffect, useState } from "react";
import WorkAside from "./WorkAside";
import { withRouter } from "react-router";
import { Provider, observer } from "mobx-react";
import "./WorkList.scss";
import { Row, Col } from "antd";
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

    useEffect(() => {
        setWorkShowType("list")
        const params = {
            projectId: projectId,
            sprintId: sprintId,
            versionId: versionId
        }

        finWorkList(path, WorkStore, params);
        return;
    }, [projectId])

    useEffect(() => {
        if (workId && workId.length > 0) {
            const pathname = props.match.url;
            props.history.push(`${pathname}/${workId}`)
        }
        return;
    }, [workId]);

    const deleteWork = (deleteWorkItem, removeTree) => {
        deleteWorkItem(workId).then(() => {
            // 当第当前页被删完, 总页数大于当前页
            if (workList.length === 0){
                 // 当前页被删完, 总页数等于当前页， 往前移动一页
                if(currentPage === totalPage && currentPage > 1) {
                    const params = {
                        pageParam: {
                            pageSize: searchCondition.pageParam.pageSize,
                            currentPage: currentPage - 1
                        }
                    }
                    setWorkDeatilInList(WorkStore, params)
                } else if (currentPage === totalPage && currentPage <= 1){
                    // 当前页被删完, 总页数等于当前页，而且是第一页
                    setWorkId(0)
                    setWorkIndex(0)
                } else if(currentPage < totalPage){
                    setWorkDeatilInList(WorkStore)
                }
            }else {
                const node = removeTree(workList, null, workId);
                if (node != null) {
                    setWorkId(node.id)
                    setSessionStorage("detailCrumbArray",
                        [{ id: node.id, title: node.title, iconUrl: node.workTypeSys?.iconUrl }])
                }
            }
           
        })
    }

    const delectCurrentWorkItem = () => {
        deleteWork(deleteWorkItem, removeNodeInTreeAddChildren)
    }

    const delectWorkItemAndChildren = () => {
        deleteWork(deleteWorkItemAndChildren, removeNodeInTree)
    }

    const rowSpan = {
        sm: 24,
        md: 24,
        lg: { span: 24 },
        xl: { span: "22", offset: "1" },
        xxl: { span: "18", offset: "3" }
    }
    return (
        <Provider {...store}>
            <div className="work-list">
                <WorkAside
                    {...props}
                />
                <WorkDetail 
                    {...props} 
                    deleteWork={deleteWork} 
                    delectCurrentWorkItem={delectCurrentWorkItem} 
                    delectWorkItemAndChildren={delectWorkItemAndChildren} 
                    rowSpan={rowSpan}
                ></WorkDetail>
         
            </div>
        </Provider>

    )
};

export default withRouter(observer(WorkList));
