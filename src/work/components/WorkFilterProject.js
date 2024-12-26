/*
 * @Descripttion: 事项详情页面的项目筛选组件
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-05 11:02:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 15:19:27
 */
import React, { useEffect} from "react";
import { SelectSimple, SelectItem } from "../../common/select";
import { withRouter } from "react-router";
import { observer, inject } from "mobx-react";
import "./WorkFilterProject.scss";
import { searchWorkList } from "./WorkSearch";

const WorkFilterProject = (props) => {
    const { workStore } = props;
    const { findProjectList, projectList } = workStore;

    /**
     * 获取项目列表
     */
    useEffect(() => {
        findProjectList()
        return;
    }, [])

    /**
     * 选择项目
     */
    const selectChange = (value) => {
        if(value){
            search({
                projectId: value.value,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1
                }
            })
        }else {
            search({
                projectId: null,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1
                }
            })
        }
        
    }

    /**
     * 搜索事项
     */
    const search = values => {
        searchWorkList(workStore, values)
    }

    return (<div className="work-project-filter">
        <SelectSimple name="projectId"
            onChange={(value) => selectChange(value)}
            title={"项目"}
            ismult={false}
            suffixIcon = {true}
        >
            {
                projectList.map(item => {
                    return <SelectItem
                        value={item.id}
                        label={item.projectName}
                        key={item.id}
                        imgUrl={item.iconUrl}
                    />
                })
            }
        </SelectSimple>

    </div>

    )
}
export default withRouter(inject("workStore")(observer(WorkFilterProject)));