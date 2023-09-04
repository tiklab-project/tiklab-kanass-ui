import React, { useEffect, useState, useRef } from "react";
import { SelectSimple, SelectItem } from "../../common/select";
import { withRouter } from "react-router";
import { observer, inject } from "mobx-react";
import "./WorkFilterType.scss"

const WorkFilterMaster = (props) => {
    const { workStore } = props;
    const projectId = JSON.parse(localStorage.getItem("project"))?.id;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const { searchCondition, userList, workShowType, viewType, getWorkConditionPageTree, 
        getWorkConditionPage, getWorkBoardList, setWorkId, setWorkIndex } = workStore;

    const [workTypeList, setWorkTypeList] = useState([]);

    // useEffect(() => {
    //     findWorkTypeDmList({ projectId: projectId, grouper: "system" }).then(res => {
    //         if (res.code === 0) {
    //             setWorkTypeList(res.data)
    //         }
    //     })

    //     findWorkTypeDmList({ projectId: projectId, grouper: "custom" }).then(res => {
    //         if (res.code === 0) {
    //             // setWorkCustom(res.data)

    //             if (res.data.length > 0) {
    //                 setWorkTypeList(workTypeList.push(res.data))

    //             }

    //         }
    //     })
    // }, [])





    const selectType = (value) => {
        if (value === "all") {
            search({ assignerIds: [] })
        } else if (!value) {
            search({ assignerIds: [] })
        } else {
            search({
                assignerIds: [value.value],
                pageParam: {
                    pageSize: 20,
                    currentPage: 1,
                }
            })
        }
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
            title={"负责人"}
            ismult={false}
            selectValue={searchCondition?.assignerIds}
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