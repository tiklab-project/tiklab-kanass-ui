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
            case "/index/projectDetail/:id/workTable":
            case "/index/projectDetail/:id/workBodar":
                goWorkItem("project", workStore, projectId)
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

const goWorkItem = (type, workStore, projectId) => {
    const { setSearchConditionNull, setSearchCondition, sprintId } = workStore;

    const searchData = JSON.parse(sessionStorage.getItem("searchCondition"));
    // const id = props.match.params.id;
    let initValues = {
        ...searchData,
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
        default:
            break;
    }

    setSearchConditionNull().then(res => {
        setSearchCondition(initValues)
        sessionStorage.removeItem("searchCondition")
        // initFrom(initValues)
        getWorkList(workStore, projectId);
    })
}

const getWorkList = (workStore, projectId) => {
    const { viewType } = workStore;
    if (viewType === "tile") {
        getPageList(workStore, projectId);
    } else if (viewType === "tree") {
        getPageTree(workStore, projectId);
    }
}

const getPageTree = (workStore, projectId) => {
    const { getWorkConditionPageTree, setWorkIndex, setWorkId, workShowType } = workStore;

    getWorkConditionPageTree().then((res) => {
        if (res.dataList.length > 0) {
            if (workShowType === "list") {
                setWorkIndex(1)
                setWorkId(res.dataList[0].id)
                // setSessionStorage("detailCrumbArray", [{ id: res.dataList[0].id, title: res.dataList[0].title, iconUrl: res.dataList[0].workTypeSys.iconUrl }])
            }
        } else {
            setWorkIndex(0)
            setWorkId(0)
        }
    })
}

const getPageList = (workStore, projectId) => {
    const { getWorkConditionPage, setWorkIndex, setWorkId, workShowType } = workStore;
    getWorkConditionPage().then((res) => {
        if (res.dataList.length > 0) {
            if (workShowType === "list") {
                setWorkIndex(1)

                setWorkId(res.dataList[0].id)
                // setSessionStorage("detailCrumbArray", [{ id: res.dataList[0].id, title: res.dataList[0].title, iconUrl: res.dataList[0].workTypeSys.iconUrl }])
            }
        } else {
            setWorkIndex(0)
            setWorkId(0)
        }
    })
}

export { finWorkList };