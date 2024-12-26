/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 15:48:56
 * @Description: 搜索事项
 */

/**
 * 搜索事项
 */
const searchWorkList = (workStore, values) => {
    const {workShowType, viewType, getWorkConditionPageTree, getWorkConditionPage, setWorkId, setWorkIndex, 
        getWorkBoardList, getWorkGanttListTree} = workStore;
    if ((workShowType === "list" || workShowType === "table" || workShowType === "gantt") && viewType === "tree") {
        getWorkConditionPageTree(values).then((res) => {
            if(res.code === 0){
                const list = res.data.dataList;
                if (workShowType === "list") {
                    if (list.length > 0) {
                        setWorkId(list[0].id)
                        setWorkIndex(1)
                    }
                }
            }
        })
    }
    if ((workShowType === "list" || workShowType === "table" || workShowType === "gantt") && viewType === "tile") {
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
    if (workShowType === "time") {
        getWorkGanttListTree(values)
    }
}

/**
 * 在事项列表页面搜索事项
 */
const setWorkDeatilInList = (workStore, value, isRefresh) => {
    const { viewType, getWorkConditionPageTree, getWorkConditionPage, setWorkId, setWorkIndex} = workStore;
    if (viewType === "tree") {
        getWorkConditionPageTree(value).then(res => {
            if(res.code === 0 ){
                const list = res.data.dataList;
                if(!isRefresh){
                    if(list.length > 0){
                        setWorkId(list[0].id)
                        setWorkIndex(1)
                    }else {
                        setWorkId(0)
                        setWorkIndex(0)
                    }
                }
                
                
            }
        })
    }
    if (viewType === "tile") {
        getWorkConditionPage(value).then(res => {
            if(res.code === 0 ){
                const list = res.data.dataList;
                if(!isRefresh){
                    if(list.length > 0){
                        setWorkId(list[0].id)
                        setWorkIndex(1)
                    }else {
                        setWorkId(0)
                        setWorkIndex(0)
                    }
                }
            }
        })
    }
}
export {searchWorkList, setWorkDeatilInList};