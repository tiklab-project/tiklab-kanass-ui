import { setSessionStorage, getSessionStorage } from "../../common/utils/setSessionStorage";
const finWorkList = (router, workStore, projectId, sprintId) => {
    const setValue = () => {
        switch (router) {
            case "/index/:id/sprintdetail/:sprint/workList":
            case "/index/:id/sprintdetail/:sprint/workTable":
            case "/index/:id/sprintdetail/:sprint/workBodar":
                goWorkItem("sprint", workStore, projectId, sprintId)
                break;
            case "/index/workList":
            case "/index/workTable":
            case "/index/workBodar":
                goWorkItem("system", workStore, projectId)
                break;
            case "/index/projectDetail/:id/workList":
            case "/index/projectDetail/:id/workList/:workId":
            case "/index/projectDetail/:id/workTable":
            case "/index/projectDetail/:id/workBodar":
                goWorkItem("project", workStore, projectId, router)
                break;
            case "/index/workone/:id":
                goWorkItem("systemOne", workStore, projectId)
                break;
            case "/index/projectDetail/:id/workone/:id":
                goWorkItem("projectOne", workStore, projectId)
                break;
            default:
                break;
        }
    }
    setValue();


}

const goWorkItem = (type, workStore, projectId, sprintId) => {
    const { setSearchConditionNull, setSearchCondition, setQuickFilterValue } = workStore;
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
        case "project":
            initValues = { ...initValues, projectIds: [projectId] };
            break;
        case "system":
            initValues = { ...initValues, projectIds: []};
            break;
        default:
            break;
    }
    
    setSearchConditionNull().then(res => {
        setSearchCondition(initValues)
        // sessionStorage.removeItem("searchCondition")
        // initFrom(initValues)
        getWorkList(workStore);
    })
}

const getWorkList = (workStore) => {
    const { viewType, workShowType, getWorkBoardList } = workStore;
    if (viewType === "tile" && workShowType !== "bodar") {
        getPageList(workStore);
    } else if (viewType === "tree"  && workShowType !== "bodar") {
        getPageTree(workStore);
    } else if (workShowType === "bodar"){
        getWorkBoardList()
    }
}

const getPageTree = (workStore) => {
    const { getWorkConditionPageTree, setWorkIndex, setWorkId, workShowType } = workStore;

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