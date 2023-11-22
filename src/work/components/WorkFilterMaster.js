import React, { useEffect, useState, useRef } from "react";
import { SelectSimple, SelectItem } from "../../common/select";
import { withRouter } from "react-router";
import { observer, inject } from "mobx-react";
import "./WorkFilterType.scss"
import { searchWorkList } from "./WorkSearch";

const WorkFilterMaster = (props) => {
    const { workStore } = props;
    const { searchCondition, userList } = workStore;



    const selectType = (value) => {
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

    const search = values => {
        searchWorkList(workStore, values)
    };



    return (<div className="work-type-filter">
        <SelectSimple name="workType"
            onChange={(value) => selectType(value)}
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