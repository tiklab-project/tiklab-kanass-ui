import { observer } from "mobx-react";
import WorkStore from "../store/WorkStore";


// console.log("searchWorkList", workShowType)

const searchWorkList = (workStore, values) => {
    const {workShowType, viewType, getWorkConditionPageTree, getWorkConditionPage, setWorkId, setWorkIndex, 
        getWorkBoardList, getWorkGanttListTree} = workStore;
    if ((workShowType === "list" || workShowType === "table") && viewType === "tree") {
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
    if (workShowType === "time") {
        getWorkGanttListTree(values)
    }
}

const setWorkDeatilInList = (workStore, value) => {
    const { viewType, getWorkConditionPageTree, getWorkConditionPage, setWorkId, setWorkIndex} = workStore;
    if (viewType === "tree") {
        getWorkConditionPageTree(value).then(res => {
            if(res.code === 0 ){
                const list = res.data.dataList;
                if(list.length > 0){
                    setWorkId(list[0].id)
                    setWorkIndex(1)
                }else {
                    setWorkId(0)
                    setWorkIndex(0)
                }
                
            }
        })
    }
    if (viewType === "tile") {
        getWorkConditionPage(value).then(res => {
            if(res.code === 0 ){
                const list = res.data.dataList;
                if(list.length > 0){
                    setWorkId(list[0].id)
                    setWorkIndex(1)
                }else {
                    setWorkId(0)
                    setWorkIndex(0)
                }
                
            }
        })
    }
}
export {searchWorkList, setWorkDeatilInList};