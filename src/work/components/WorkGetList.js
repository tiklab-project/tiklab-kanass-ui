/**
 * 初始进入事项页面
 */
import { setSessionStorage, getSessionStorage } from "../../common/utils/setSessionStorage";
import { getUser } from "tiklab-core-ui";
const finWorkList = (router, workStore, params) => {
    const setValue = () => {
        console.log(router)
        let type = "";
        if(router.indexOf("/index/work") > -1){
            type = "system"
            
        }
        if(router.indexOf("/index/projectDetail/:id/work") > -1){
            type = "project"
            
        }
        if(router.indexOf("/index/:id/sprintdetail/:sprint/work") > -1){
            type = "sprint"
            
        }
        if(router.indexOf("/index/:id/versiondetail/:version/work") > -1){
            type = "version"
            
        }
        goWorkItem(type, workStore, params)
    }
    setValue();


}

const goWorkItem = (type, workStore, params) => {
    const { sprintId, versionId, projectId  } = params;
    const { setSearchConditionNull, setSearchCondition, findStateNodeList, findWorkItemNumByQuickSearch, workShowType, 
        setQuickFilterValue, searchType, setSearchType } = workStore;
    let initValues = {
        workTypeCodes: null,
        pageParam: {
            pageSize: 20,
            currentPage: 1
        }
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
                findWorkItemNumByQuickSearch().then(res => {
                    if (res.code === 0) {
                        if(workShowType === "list"){
                            setQuickFilterValue({ label: `我的待办(${res.data.pending})`, value: 'pending' })
                        }else {
                            setQuickFilterValue({ label: `我的待办`, value: 'pending' })
                        }
                        
                    }
                })
                getWorkList(workStore);
            });
            break;
        case "ending":
            getStateNodeList({ quickName: "done" }, findStateNodeList).then(data => {
                initValues = { ...initValues, workStatusIds: data }
                setSearchCondition(initValues)
                findWorkItemNumByQuickSearch().then(res => {
                    if (res.code === 0) {
                        if(workShowType === "list"){
                            setQuickFilterValue({ label: `我的已办(${res.data.ending})`, value: 'ending' })
                        }else {
                            setQuickFilterValue({ label: `我的已办`, value: 'ending' })
                        }
                    }
                })
                getWorkList(workStore);
            })
            break;
        case "overdue":
            initValues = { ...initValues, workStatusIds: [], overdue: true }
            setSearchCondition(initValues)
            findWorkItemNumByQuickSearch().then(res => {
                if (res.code === 0 ) {
                    if(workShowType === "list"){
                        setQuickFilterValue({ label: `已逾期(${res.data.overdue})`, value: 'overdue' })
                    }else {
                        setQuickFilterValue({ label: `已逾期`, value: 'overdue' })
                    }
                }
            })
            getWorkList(workStore);
            break;
        case "creat":
            initValues = { ...initValues, workStatusIds: [], overdue: false,  builderId: getUser().userId}
            setSearchCondition(initValues)
            findWorkItemNumByQuickSearch().then(res => {
                if (res.code === 0 ) {
                    if(workShowType === "list"){
                        setQuickFilterValue({ label: `我创建的(${res.data.creat})`, value: 'creat' })
                    }else {
                        setQuickFilterValue({ label: `我创建的`, value: 'creat' })
                    }
                }
            })
            getWorkList(workStore);
            break;
        case "all":
            setSearchCondition(initValues)
            findWorkItemNumByQuickSearch().then(res => {
                if (res.code === 0 ) {
                    if(workShowType === "list"){
                        setQuickFilterValue({ label: `全部(${res.data.all})`, value: 'all' })
                    }else {
                        setQuickFilterValue({ label: `全部`, value: 'all' })
                    }
                }
            })
            getWorkList(workStore);
            break;
        default:
            getStateNodeList({ quickName: "pending" }, findStateNodeList).then(data => {
                initValues = { ...initValues, workStatusIds: data }
                setSearchCondition(initValues)
                findWorkItemNumByQuickSearch().then(res => {
                    if (res.code === 0 && workShowType === "list") {
                        setQuickFilterValue({ label: `我的待办(${res.data.pending})`, value: 'pending' })
                    }
                })
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
        if (res.dataList.length > 0) {
            if (workShowType === "list") {
                setWorkIndex(1)
                const workItem = res.dataList[0];
                setWorkId(res.dataList[0].id)
                setSessionStorage("detailCrumbArray", [{ id: workItem.id, title: workItem.title, iconUrl: workItem.workTypeSys.iconUrl }])
            }
        } else {
            setWorkIndex(0)
            setWorkId(0)
        }
    })
}

const getPageList = (workStore) => {
    const { getWorkConditionPage, setWorkIndex, setWorkId, workShowType } = workStore;
    getWorkConditionPage().then((res) => {
        if (res.dataList.length > 0) {
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