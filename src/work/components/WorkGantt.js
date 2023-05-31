
import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router";
import { useSelector } from "tiklab-plugin-core-ui";
import { RemoteComponent } from "tiklab-plugin-core-ui";
import { Empty } from "antd";
import "./WorkGantt.scss";
import Gantt from "./GanttTest"
const WorkGantt = (props) => {
    const { workStore, form } = props;
    const { workList, getWorkConditionPageTree, editWork } = workStore;
    const projectId = props.match.params.id ? props.match.params.id : null
    const filterType = props.match.params.statetype ? props.match.params.statetype : null;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const pluginStore = useSelector(state => state.pluginStore)
    const [workListTime, setWorkListTime] = useState()

    const changePage = (page) => {
        let initValues = {}
        if (props.match.path === "/index/projectDetail/:id/sprintdetail/:sprint/workItem/:statetype"
        ) {
            initValues = { project: projectId, sprint: sprintId }
        }

        if (props.match.path === "/index/work/worklist/:statetype") {
            initValues = { project: null, sprint: null }
        }
        if (props.match.path === "/index/projectDetail/:id/work/:statetype") {
            initValues = { project: projectId, sprint: null }
        }
        initValues = { currentPage: page, ...initValues }
        getWorkConditionPageTree(initValues).then((res) => {
            const graphHeight = 15 * 50
            setWorkListTime(res.dataList)
        })
    }
    useEffect(() => {
        changePage(1)
    }, [])
    return (
        <div>
            {
                workList && workList.length > 0 ?
                    <RemoteComponent
                        point="work-gantt"
                        pluginStore={pluginStore}
                        isModalType={true}
                        extraProps={{ workList: workList, setWorkListTime: setWorkListTime, sprintId: sprintId, pathName: props.location.pathname, editWork: editWork }}
                    />
                    // <Gantt workList = {workList} editWork = {editWork}/>
                    :
                    <div style={{ marginTop: "50px" }}>
                        <Empty image="/images/nodata.png" description="暂时没有事项~" />
                    </div>

            }
        </div>
    )
}

export default withRouter(inject("workStore")(observer(WorkGantt)));