/**
 * 初始进入事项页面
 */
import { setSessionStorage, getSessionStorage } from "../../common/utils/setSessionStorage";
import { getUser } from "thoughtware-core-ui";
const finWorkList = (router, workStore, params) => {
    const setValue = () => {
        console.log(router)
        let type = "";
        if(router.indexOf("/work") > -1){
            type = "system"
            
        }
        if(router.indexOf("/projectDetail/:id/work") > -1){
            type = "project"
            
        }
        if(router.indexOf("/:id/sprintdetail/:sprint/work") > -1){
            type = "sprint"
            
        }
        if(router.indexOf("/:id/versiondetail/:version/work") > -1){
            type = "version"
            
        }
        goWorkItem(type, workStore, params)
    }
    setValue();


}

const goWorkItem = (type, workStore, params) => {
    const { sprintId, versionId, projectId  } = params;
    const { setSearchConditionNull, setSearchCondition, findStateNodeList, findWorkItemNumByQuickSearch, workShowType, 
         searchType } = workStore;
    let initValues = {
        workTypeCodes: null,
        // pageParam: {
        //     pageSize: 20,
        //     currentPage: 1
        // }
    }
    switch (type) {
        case "sprint":
            initValues = { ...initValues, projectIds: [projectId], sprintIds: [sprintId] };
            break;
        case "version":
            initValues = { ...initValues, projectIds: [projectId], versionId: versionId };
            break;

        case "project":
            initValues = { ...initValues, projectIds: [projectId] };
            break;
        case "system":
            initValues = { ...initValues, projectIds: [] };
            break;
        default:
            break;
    }
    switch (searchType) {
        
        case "reset":
            setSearchConditionNull().then(res => {
                setSearchCondition(initValues)
                getWorkList(workStore);
            });
            break;
        case "pending":
            getStateNodeList({ quickName: "pending" }, findStateNodeList).then(data => {
                initValues = { ...initValues, workStatusIds: data }
                setSearchCondition(initValues)
                getWorkList(workStore);
            });
            break;
        case "ending":
            getStateNodeList({ quickName: "done" }, findStateNodeList).then(data => {
                initValues = { ...initValues, workStatusIds: data }
                setSearchCondition(initValues)
                getWorkList(workStore);
            })
            break;
        case "overdue":
            initValues = { ...initValues, workStatusIds: [], overdue: true }
            setSearchCondition(initValues)
            getWorkList(workStore);
            break;
        case "creat":
            initValues = { ...initValues, workStatusIds: [], overdue: false,  builderId: getUser().userId}
            setSearchCondition(initValues)
            getWorkList(workStore);
            break;
        case "all":
            setSearchCondition(initValues)
            getWorkList(workStore);
            break;
        default:
            getStateNodeList({ quickName: "pending" }, findStateNodeList).then(data => {
                initValues = { ...initValues, workStatusIds: data }
                setSearchCondition(initValues)
                getWorkList(workStore);
            });
            break;
    }
    

}

const getStateNodeList = async (value, findStateNodeList) => {
    const stateNodeList = []
    await findStateNodeList(value).then(res => {
        if (res.code === 0) {
            if (res.data.length > 0) {
                res.data.map(item => {
                    stateNodeList.push(item.id)
                })
            }
        }
    })
    return stateNodeList;
}

const getWorkList = (workStore) => {
    const { viewType, workShowType, getWorkBoardList } = workStore;
    if (viewType === "tile" && workShowType !== "bodar") {
        getPageList(workStore);
    } else if (viewType === "tree" && workShowType !== "bodar") {
        getPageTree(workStore);
    } else if (workShowType === "bodar") {
        getWorkBoardList()
    }
}

const getPageTree = (workStore) => {
    const { getWorkConditionPageTree, setWorkIndex, setWorkId, workShowType, setQuickFilterValue } = workStore;

    getWorkConditionPageTree().then((res) => {
        if(res.code === 0){
            const list = res.data.dataList;
            if (workShowType === "list") {
                if (list.length > 0) {
                    setWorkIndex(1)
                    const workItem = list[0];
                    setWorkId(workItem.id)
                    setSessionStorage("detailCrumbArray", [{ id: workItem.id, title: workItem.title, iconUrl: workItem.workTypeSys.iconUrl }])    
                }else {
                    setWorkId(0)
                    setWorkIndex(0)
                }
            }
        }
    })
}

const getPageList = (workStore) => {
    const { getWorkConditionPage, setWorkIndex, setWorkId, workShowType } = workStore;
    getWorkConditionPage().then((res) => {
        const list = res.data.dataList
        if (list.length > 0) {
            if (workShowType === "list") {
                // setWorkIndex(1)
                // setWorkId(res.dataList[0].id)
                // setSessionStorage("detailCrumbArray", [{ id: res.dataList[0].id, title: res.dataList[0].title, iconUrl: res.dataList[0].workTypeSys.iconUrl }])
            }
        } else {
            setWorkIndex(0)
            setWorkId(0)
        }
    })
}

export { finWorkList };