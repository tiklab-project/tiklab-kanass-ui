import React, { useEffect, useState, useRef } from "react";
import { SelectSimple, SelectItem } from "../../common/select";
import { withRouter } from "react-router";
import { observer, inject } from "mobx-react";
import "./WorkFilterType.scss"
import { searchWorkList } from "./WorkSearch";

const WorkFilterType = (props) => {
    const { workStore } = props;
    const projectId = props.match.params.id ? props.match.params.id : null;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const { searchCondition, findWorkTypeDmList, tabValue, setTabValue,} = workStore;
    const [selectWorkType, setSelectWorkType] = useState();
    const [workTypeList, setWorkTypeList] = useState();

    useEffect(() => {
        findWorkTypeDmList({ projectId: projectId }).then(res => {
            if (res.code === 0) {
                setWorkTypeList(res.data)
            }
        })
        if(tabValue?.id === "all"){
            setSelectWorkType()
        }else {
            setSelectWorkType(tabValue)
        }
        
        // findWorkTypeDmList({ projectId: projectId, grouper: "custom" }).then(res => {
        //     if (res.code === 0) {
        //         // setWorkCustom(res.data)
            
        //         if (res.data.length > 0) {
        //             setWorkTypeList(workTypeList.push(res.data))

        //         }

        //     }
        // })
        return;
    }, [])



   

    const selectType = (value, option) => {
        
        if(value){
            const tabData = {
                id: value.value,
                type: option.grouper,
                ...value
            }
            setTabValue(tabData)
            setSelectWorkType({ id: value.value, label: value.label })
        }else {
            setTabValue({
                id: "all", 
                type: "system",
                value: null,
                label: null
            })
            setSelectWorkType()
        }
        search({
            workTypeId: value? value.value : null,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        })
    }

    const search = values => {
        searchWorkList(workStore, values)
    };

    return (<div className="work-type-filter">
        <SelectSimple 
            name="workType"
            onChange={(value, option) => selectType(value, option)}
            title={"类型"}
            ismult={false}
            value={selectWorkType}
            suffixIcon = {true}
        >
            {
                workTypeList && workTypeList.length > 0 && workTypeList?.map(item => {
                    return <SelectItem
                        value={item.workType.id}
                        label={item.workType.name}
                        key={item.workType.id}
                        option = {item.workType}
                        
                    />
                })
            }
        </SelectSimple>

    </div>

    )
}
export default withRouter(inject("workStore")(observer(WorkFilterType)));