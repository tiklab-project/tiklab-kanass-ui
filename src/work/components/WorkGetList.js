import { setSessionStorage, getSessionStorage } from "../../common/utils/setSessionStorage";
const finWorkList = (router, workStore,searchType, params) => {
    const setValue = () => {
        switch (router) {
            case "/index/:id/sprintdetail/:sprint/workList":
            case "/index/:id/sprintdetail/:sprint/workTable":
            case "/index/:id/sprintdetail/:sprint/workBodar":
                goWorkItem("sprint", workStore,searchType, params)
                break;
            case "/index/:id/versiondetail/:version/workList":
            case "/index/:id/versiondetail/:version/workTable":
            case "/index/:id/versiondetail/:version/workBodar":
                goWorkItem("version", workStore,searchType,params)
                break;

            case "/index/workList":
            case "/index/workTable":
            case "/index/workBodar":
                goWorkItem("system", workStore, searchType, params)
                break;
            case "/index/projectDetail/:id/workList":
            case "/index/projectDetail/:id/workList/:workId":
            case "/index/projectDetail/:id/workTable":
            case "/index/projectDetail/:id/workBodar":
                goWorkItem("project", workStore,searchType, params)
                break;
            case "/index/projectDetail/:id/workone/:id":
                goWorkItem("projectOne", workStore, searchType, params)
                break;
            default:
                break;
        }
    }
    setValue();


}

const goWorkItem = (type, workStore, searchType, params) => {
    const {sprintId, versionId, projectId} = params;
    const { setSearchConditionNull, setSearchCondition, findStateNodeList, findWorkItemNumByQuickSearch, workShowType, setQuickFilterValue } = workStore;
    let initValues = {
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
    if(searchType === "reset"){
        setSearchConditionNull().then(res => {
            setSearchCondition(initValues)
            getWorkList(workStore);
        })
    }else {
       getStateNodeList({ quickName: "pending" }, findStateNodeList).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchConditionNull().then(res => {
                setSearchCondition(initValues)
                findWorkItemNumByQuickSearch().then(res=> {
                    if(res.code === 0 && workShowType === "list"){
                        setQuickFilterValue({ label: `我的待办(${res.data.pending})`, value: 'pending' })
                    }
                })
                getWorkList(workStore);
            })
        }) 
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