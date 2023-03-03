import { observable, action } from "mobx";
import { Search,SearchSort,SearchForPage } from "../api/SearchApi";
//删除事项
export class SearchStore{
    // 搜索结果列表
    @observable 
    searchList = []

    @observable 
    sortList = []

    // 搜索关键字
    @observable 
    keyword = ""

    // 搜索分页参数
    @observable 
    searchCondition = {
        pageSize: 10,
        currentPage: 1
    }

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
    getSearch = (value) => {
        const params = new FormData();
        if(value){
            params.append('keyword', value ); 
        }else {
            params.append('keyword', null ); 
        }
        return new Promise((resolve,reject)=>{
            Search(params).then(response => {
                if(response.code=== 0){
                    this.searchList = response.data.responseList;
                }
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    /**
     * 获取搜索结果
     * @param {*} value 
     * @returns 
     */
    @action
    getSearchSore = (value) => {
        const params = new FormData();
        if(value){
            params.append('keyword', value ); 
        }else {
            params.append('keyword', null ); 
        }
        return new Promise((resolve,reject)=>{
            SearchSort(params).then(response => {
                if(response.code=== 0){
                    this.sortList = response.data.responseList;
                }
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    /**
     * 按照分页搜索
     * @param {搜索参数} value 
     * @returns 
     */
    @action
    searchForPage = (value) => {
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
        return new Promise((resolve, reject)=> {
            SearchForPage(params).then(response => {
                console.log(response)
                if(response.code=== 0){
                    this.searchCondition.total = response.data.totalRecord;
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

export const SEARCH_STORE = "searchStore"