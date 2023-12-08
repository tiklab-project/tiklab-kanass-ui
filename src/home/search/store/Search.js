import { observable, action } from "mobx";
import { Service } from "../../../common/utils/requset"
//删除事项
export class SearchStore{
    // 搜索结果列表
    @observable
    projectList = []

    @observable
    workItemList = []
    
    @observable 
    searchList = []

    @observable 
    sortList = []

    // 搜索关键字
    @observable 
    keyword = ""

    // 搜索分页参数
    // @observable 
    // searchCondition = {
    //     pageSize: 10,
    //     currentPage: 1
    // }

    @observable searchCondition = {
        orderParams: [{
            title: "标题",
            name: "title",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 20,
            currentPage: 1,
        }
    };

    // 设置搜索关键字
    @action
    setKeyWord = (value) => {
        this.keyword = value
    }

    /**
     * 获取搜索结果
     * @param {搜索关键字} value 
     * @returns 
     */
    @action
    getSearch = async(value) => {
        const params = new FormData();
        if(value){
            params.append('keyword', value ); 
        }else {
            params.append('keyword', null ); 
        }
        const data = await Service("/search/searchForTop", params)
        if(data.code === 0){
            this.searchList = data.data.responseList;
        }
        return data;
    }

    /**
     * 获取搜索结果
     * @param {*} value 
     * @returns 
     */
    @action
    getSearchSore = async(value) => {
        const params = new FormData();
        if(value){
            params.append('keyword', value ); 
        }else {
            params.append('keyword', null ); 
        }
        const data = await Service("/search/searchForCount", params)
        if(data.code === 0){
            this.sortList = data.data.responseList;
        }
        return data;
    }

    /**
     * 按照分页搜索
     * @param {搜索参数} value 
     * @returns 
     */
    @action
    searchForPage = async(value) => {
        Object.assign(this.searchCondition, {...value})
        const params={
            index: this.searchCondition.index,
            keyword: this.searchCondition.keyword,
            pageCondition: {
                pageSize: 10,
                currentPage: this.searchCondition.currentPage,
                lastRecord: this.searchCondition.lastRecord,
            }
        }
        const data = await Service("/search/searchForPage", params)
        if(data.code === 0){
            this.searchCondition.total = response.data.totalRecord;
        }
        return data;
    }

    @action
	statTodoWorkItem = async(value) => {
        const params={
            bgroup : "kanass",
            status: 1,
            pageParam: {
                pageSize: value.pageSize,
                currentPage: 1
            },
        }
        const data = await Service("/todo/findtodopage", params)
        return data;
    }

    @action
	statProjectWorkItem = async(value) => {
        const params = new FormData();
        params.append("num",value)
        const data = await Service("/workItemStat/statProjectWorkItem", num)
        return data;
    }

    @action
	findRecentList = async(value) => {
        const data = await Service("/recent/findRecentList", value)
        return data;
    }

    @action
    updateRecent = async (value) => {
        const data = await Service("/recent/updateRecent", value)
        return data;
    }

    @action
    findWorkItemByKeyWorks = async (value) => {
        Object.assign(this.searchCondition,  { ...value })
        const data = await Service("/workItem/findWorkItemByKeyWorks", this.searchCondition)
        return data;
    }

    @action
    findProjectList = async (value) => {
        
        const data = await Service("/project/findProjectList", value)
        return data;
    }

}

export default new SearchStore();