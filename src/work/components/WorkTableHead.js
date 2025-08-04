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
        getWorkBoardList, exportWorkItemXml, tableTitle, moduleTitle } = workStore;
    const [stateType, setState] = useState();
    // console.log("**********id:"+props.match.params.id);
    // console.log("**********props*****:"+JSON.stringify(props))
    const projectId = props.match.params.id ? props.match.params.id : null;
    const workAddModel = useRef()
    const project = JSON.parse(localStorage.getItem("project"));

        


    /**
     * 导出事项列表
     */
    const exportFile = () => {
        exportWorkItemXml().then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', '事项列表.xlsx');
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


    const getTitle = () => {
        if (tableTitle && moduleTitle){
            return `${tableTitle}/${moduleTitle}`;
        }else if (tableTitle){
            return tableTitle;
        }else if (moduleTitle){
            return moduleTitle;
        }else {
            return "事项"
        }
    }


    return (
        <Fragment>
            {
                (props.match.path !== "/project/:id/sprintDetail/:sprint/workitem" && props.match.path !== "/project/:id/versionDetail/:version/workitem") &&
                <div className="work-table-first">
                    <div className="work-breadcrumb">
                        <div className="work-title">{getTitle()}</div>
                        <div className="work-top-right">

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
                            {
                                project?.projectType.type !== "kanban" &&
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
                            }
                        </div>

                    </div>
                    <WorkAddModel workAddModel={workAddModel} workType={stateType} {...props} />
                </div>
            }
        </Fragment>
    )
}
export default withRouter(inject("workStore")(observer(WorkTableHead)));