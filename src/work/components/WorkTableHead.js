/*
 * @Author: 袁婕轩
 * @Date: 2024-12-26 15:58:31
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 16:01:45
 * @Description: 事项列表页面，甘特图页面，看板页面顶部
 */
import React, { useState, useRef, useEffect, Fragment } from "react";
import { Menu, Dropdown, Popconfirm, message } from 'antd';
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";
import "./WorkTableHead.scss";
import WorkAddModel from "./WorkAddModel";
import WorkChangeView from "./WorkChangeView";
import Button from "../../common/button/Button";
import WorkCreatDropdown from "./workCreatDropdown";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";


const WorkTableHead = (props) => {
    const { workStore } = props;
    const { workTypeList, workShowType, viewType, setViewType, setWorkShowType,
        getWorkConditionPageTree, getWorkConditionPage, searchCondition,
        getWorkBoardList, exportWorkItemXml, setArchiveView, archiveView } = workStore;
    const [stateType, setState] = useState();
    const projectId = props.match.params.id ? props.match.params.id : null;
    const workAddModel = useRef()

        


    /**
     * 导出事项列表
     */
    const exportFile = () => {
        exportWorkItemXml().then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file_name.xls');
            document.body.appendChild(link);
            link.click();
        })
    }
  
    const menuPlugin = (
        <Menu>
            {/* <Menu.Item>
                {
                    pluginStore.filter(item => item.point === "import-modal").length > 0 ? <div onClick={() => importFile()}>导入</div> :
                        <Popconfirm
                            title="此服务需要购买，确认购买?"
                            okText="Yes"
                            cancelText="No"
                        >
                            <div onClick={() => buy()}>导入ss?</div>
                        </Popconfirm>
                }
            </Menu.Item> */}
            <Menu.Item>
                <div onClick={() => exportFile()}>导出</div>
            </Menu.Item>
        </Menu>
    );



    return (
        <Fragment>
            <div className="work-breadcrumb">
                <div className="work-title">事项</div>
                <div className="work-top-right">
                    {
                        workShowType === "gantt" && <div className="work-gantt-view">
                            <div className={`work-gantt-view-item work-gantt-view-week ${archiveView === "week" ? "work-gantt-view-select" : ""}`} onClick={() => setArchiveView("week")}>周</div>
                            <div className={`work-gantt-view-item work-gantt-view-month ${archiveView === "month" ? "work-gantt-view-select" : ""}`} onClick={() => setArchiveView("month")}>月</div>
                        </div>
                    }

                    <PrivilegeProjectButton code={'WorkItemAdd'} domainId={projectId}  {...props}>
                        <WorkCreatDropdown workTypeList={workTypeList}  {...props} />
                    </PrivilegeProjectButton>
                    <Dropdown trigger="click" overlay={menuPlugin} className="right-item">
                        <Button>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref={`#icon-more`}></use>
                            </svg>
                        </Button>
                    </Dropdown>
                    <WorkChangeView
                        searchCondition={searchCondition}
                        getWorkConditionPage={getWorkConditionPage}
                        getWorkConditionPageTree={getWorkConditionPageTree}
                        getWorkBoardList={getWorkBoardList}
                        viewType={viewType}
                        workShowType={workShowType}
                        setWorkShowType={setWorkShowType}
                        setViewType={setViewType}
                        buttonType="button"
                    />
                </div>

            </div>
            <WorkAddModel workAddModel={workAddModel} workType={stateType} {...props} />
        </Fragment>
    )
}
export default withRouter(inject("workStore")(observer(WorkTableHead)));