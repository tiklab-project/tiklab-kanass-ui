import React, { useState, useRef, useEffect } from "react";
import { withRouter } from "react-router";
import { Menu } from "antd";
import "./WorkListFilter.scss";
import { observer, inject } from "mobx-react";
import WorkChangeView from "./WorkChangeView";
import "./WorkListHead.scss"
import WorkFilterType from "./WorkFilterType";
import WorkFilterQuick from "./WorkFilterQuick";
import WorkFilterMaster from "./WorkFilterMaster";
import WorkFilterProject from "./WorkFilterProject";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import WorkCreatDropdown from "./workCreatDropdown";
import WorkSort from "./WorkSort";
import WorkFilterModal from "./WorkFilterModal";
import WorkListFilter from "./WorkListFilter";

const WorkListHead = (props) => {
    const { workStore, } = props;
    const { getWorkConditionPageTree, getWorkConditionPage, setWorkShowType, setViewType,
        workShowType, viewType, workTypeList, setWorkIndex, setWorkId, searchCondition,
        getWorkBoardList, setWorkBreadCrumbText, getWorkStatus,
        getSelectUserList } = workStore;
    const projectId = props.match.params.id ? props.match.params.id : null

    const [showViewDropDown, setShowViewDropDown] = useState(false);
    const viewDropDown = useRef();
    const layout = "inline";

    useEffect(() => {
        getWorkStatus()
        getSelectUserList(projectId).then(res => {
            let list = []
            res.dataList.map(item => {
                list.push(item.user)
            })
        });
        return;
    }, [])



    useEffect(() => {
        setWorkBreadCrumbText("全部事项")
        return
    }, [])

    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [showViewDropDown])

    const closeModal = (e) => {
        if (!viewDropDown.current) {
            return;
        }
        if (!viewDropDown.current.contains(e.target) && viewDropDown.current !== e.target) {
            setShowViewDropDown(false)
        }
    }





    return (
        <div className="worklist-head" >
            <div className="worklist-head-first">
                <div className="worklist-head-name">
                    事项
                </div>
                <div className="worklist-head-right">
                    <PrivilegeProjectButton code={'WorkItemAdd'} domainId={projectId}  {...props}>
                        <WorkCreatDropdown workTypeList={workTypeList} buttonType="svg" {...props} />
                    </PrivilegeProjectButton>
                    {/* <div style={{ positon: "relative" }} className="worklist-button-icon">
                        <svg className="icon-20" aria-hidden="true">
                            <use xlinkHref="#icon-more"></use>
                        </svg>
                    </div> */}

                    <WorkChangeView
                        getWorkBoardList={getWorkBoardList}
                        viewType={viewType}
                        workShowType={workShowType}
                        setWorkShowType={setWorkShowType}
                        setViewType={setViewType}
                    />
                </div>
            </div>
            <div className="work-aside-search">
                <WorkListFilter showWorkListFilter={true} />
            </div>
            
        </div>
    )
}
export default withRouter(inject("workStore")(observer(WorkListHead)));