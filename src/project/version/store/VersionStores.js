import { observable, action } from "mobx";
import {VersionList,EditVersion,AddVersion,DeleVersion,SearchVersionById,FindVersion} from "../api/Version";

export class VersionStore {
    @observable versionList = [];
    @observable versionItem = [];
    @observable searchVersionName = [];
    @observable searchCondition = {
        currentPage: 1
    };
    @observable versionId = "";
    // @observable actionPlanId = "";
    // 获取规划的id
    @action 
    getVersionId = (value) => {
        this.versionId = value
    }
    // 获取所有成员
    @action
	getVersionList = async(value) => {
        Object.assign(this.searchCondition, {...value})
        const params={
            projectId: this.searchCondition.projectId,
            name: this.searchCondition.name,
            sortParams: [{
                name: "title",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.searchCondition.currentPage
            }
        }
		const data = await VersionList(params)
        if(data.code === 0){
            
            this.versionList = data.data.dataList
        }
        return data;
        // .then(response => {
        //     if(response.code=== 0){
        //         this.versionList = response.data.dataList;
        //     }
        // }).catch(error => {
        //     console.log(error)
        // })
    }
    
    //添加已选择人员
    @action
	addVersion = (value) => {
        let params = {
            name: value.name,
            versionState: value.versionState,
            publishDate: value.publishDate,
            startTime: value.startTime,
            project: {
                id: value.project
            }
        }
        return new Promise((resolve,reject)=>{
            AddVersion(params).then(response => {
                // this.versionList = response.data.versionList;
                
                // if(response.code=== 0){
                //     this.getVersionList()
                // }
                resolve()
            }).catch(error => {
                reject()
                console.log(error)
            })
        })
		
    }
    //添加已选择人员
    @action
	deleVersion = (params) => {
        const param = new FormData()
        param.append("id", params.id)


		DeleVersion(param).then(response => {
            if(response.code=== 0 ){
                this.getVersionList()
            }
        }).catch(error => {
            console.log(error)
        })
    }
    //搜索已选择人员
    @action
	searchVersionById = (params) => {
        
        const param = new FormData()
        param.append("id", params.id)
        return new Promise((resolve,reject)=> {
            SearchVersionById(param).then(response => {
                this.versionItem = response.data;
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
		
    }
    //编辑版本

    @action
	editVersion = async(value) => {
        let params = {
            id: value.id,
            name: value.name,
            publishDate: value.publishDate,
            startTime: value.startTime,
            project: {
                id: value.project
            },
            versionState: value.versionState
        }
        const data = await EditVersion(params)
        return data;
    }

    @action
    findVersion = (value) => {
        const params = new FormData();
        params.append("id",value)
        const data = FindVersion(params);
        return data;
    }
}
export const EDITION_STORE = "versionStore"