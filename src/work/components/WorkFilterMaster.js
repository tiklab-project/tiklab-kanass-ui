/*
 * @Descripttion: 事项详情页面的负责人筛选组件
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-05 11:02:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 15:40:36
 */
import React, { useEffect, useState, useRef } from "react";
import { SelectSimple, SelectItem } from "../../common/select";
import { withRouter } from "react-router";
import { observer, inject } from "mobx-react";
import "./WorkFilterType.scss"
import { searchWorkList } from "./WorkSearch";


const WorkFilterMaster = (props) => {
    const { workStore } = props;
    const { searchCondition, userList } = workStore;


    /**
     * 选择负责人
     */
    const selectMaster = (value) => {
        if (value === "all") {
            search({ assignerIds: [], assigner: value })
        } else if (!value) {
            search({ assignerIds: [] })
        } else {
            search({
                assignerIds: [value.value],
                assigner: value ,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1,
                }
            })
        }
    }

    /**
     * 搜索事项
     */
    const search = values => {
        searchWorkList(workStore, values)
    };



    return (<div className="work-type-filter">
        <SelectSimple name="workType"
            onChange={(value) => selectMaster(value)}
            title={"负责人"}
            ismult={false}
            value={searchCondition?.assigner}
            suffixIcon={true}
        >
            {
                userList.map(item => {
                    return <SelectItem
                        value={item.user?.id}
                        label={item.user?.nickname ? item.user?.nickname : item.user?.name}
                        key={item.user?.id}
                        imgUrl={item.user?.iconUrl}
                    />
                })
            }
        </SelectSimple>

    </div>

    )
}
export default withRouter(inject("workStore")(observer(WorkFilterMaster)));