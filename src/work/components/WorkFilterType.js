import React, { useEffect, useState, useRef } from "react";
import { SelectSimple, SelectItem } from "../../common/select";
import { withRouter } from "react-router";
import { observer, inject } from "mobx-react";
import "./WorkFilterType.scss"

const WorkFilterType = (props) => {
    const { workStore } = props;
    const projectId = props.match.params.id ? props.match.params.id : null;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const { searchCondition, viewType, getWorkConditionPage, getWorkConditionPageTree,
        findWorkTypeDmList, workShowType, setWorkIndex, setWorkId,  getWorkBoardList, setTabValue} = workStore;

    const [workTypeList, setWorkTypeList] = useState([]);

    useEffect(() => {
        findWorkTypeDmList({ projectId: projectId, grouper: "system" }).then(res => {
            if (res.code === 0) {
                setWorkTypeList(res.data)
            }
        })

        findWorkTypeDmList({ projectId: projectId, grouper: "custom" }).then(res => {
            if (res.code === 0) {
                // setWorkCustom(res.data)

                if (res.data.length > 0) {
                    setWorkTypeList(workTypeList.push(res.data))

                }

            }
        })
    }, [])



   

    const selectType = (value) => {
        // if (value === "all" ) {
        //     search({ 
        //         workTypeId: "",
        //         workType: null,
        //         pageParam: {
        //             pageSize: 20,
        //             currentPage: 1,
        //         }
        //     })
        // } else if (!value){
        //     search({ 
        //         workTypeId: "",
        //         workType: null,
        //         pageParam: {
        //             pageSize: 20,
        //             currentPage: 1,
        //         }
        //     })
        // } else {
           
        // } 
        search({
            workTypeIds: value,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        })
    }

    const search = values => {
        if ((workShowType === "list" || workShowType === "table" || workShowType === "time") && viewType === "tree") {
            getWorkConditionPageTree(values).then((res) => {
                if (workShowType === "list") {
                    if (res.dataList.length > 0) {
                        setWorkId(res.dataList[0].id)
                        setWorkIndex(1)
                    }

                }
            })
        }
        if ((workShowType === "list" || workShowType === "table") && viewType === "tile") {
            getWorkConditionPage(values).then((res) => {
                if (workShowType === "list") {
                    if (res.dataList.length > 0) {
                        setWorkId(res.dataList[0].id)
                        setWorkIndex(1)
                    }
                }
            })
        }
        if (workShowType === "bodar") {
            getWorkBoardList(values)
        }
    };



    return (<div className="work-type-filter">
        <SelectSimple name="workType"
            onChange={(value) => selectType(value)}
            title={"事项类型"}
            ismult={"true"}
            value={searchCondition.workTypeIds}
            suffixIcon = {true}
        >
            {
                workTypeList.map(item => {
                    return <SelectItem
                        value={item.workType.id}
                        label={item.workType.name}
                        key={item.workType.id}
                        
                    />
                })
            }
        </SelectSimple>

    </div>

    )
}
export default withRouter(inject("workStore")(observer(WorkFilterType)));