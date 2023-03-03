/*
 * @Descripttion: 模块接口
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-05-08 17:27:13
 */
import { observable, action } from "mobx";
import { Getmodule,Addmodule,Delemodule,SearchmoduleById,EditmoduleById,FindModulePage } from "../api/ModuleApi";

export class ModuleStore {
    // 模块列表
    @observable 
    modulelist = [];

    // 查询模块的名称
    @observable 
    searchModuleName = "";

    // 分页参数
    @observable 
    modulePageParam = {
        current: 1,
        pageSize: 10,
        totalRecord: ""
    };
    

    /**
     * 获取模块列表
     */
    @action
	getmodule = () => {
		Getmodule().then(response => {
            if(response.code=== 0){
                this.modulelist = response.data;
            }
        }).catch(error => {
            console.log(error)
        })
    }
    
    /**
     * 添加模块
     * @param {*} values 
     */
    @action
	addModule = (values) => {
		Addmodule(values).then(response => {
            if(response.code=== 0){
                this.findModulePage(values.project.id,this.searchModuleName)
            }
        }).catch(error => {
            console.log(error)
        })
    }

    /**
     * 删除模块
     * @param {*} moduleId 
     * @param {*} projectId 
     */
    @action
	deleModule = (moduleId,projectId) => {
        const param = new FormData()
        param.append("id", moduleId)

		Delemodule(param).then(response => {
            if(response.code=== 0){
                // 删除当前页最后一条，返回上一页
                const that = this;
                this.findModulePage(projectId,this.searchModuleName).then((res)=> {
                    if(res.data.dataList.length === 0){
                        that.modulePageParam.current--
                    }
                })
                
            }
        }).catch(error => {
            console.log(error)
        })
    }

    /**
     * 根据id 查找模块详情
     * @param {*} values 
     * @returns 
     */
    @action
	searchModuleById = (values) => {
        const param = new FormData()
        param.append("id", values)
        
        return new Promise(function(resolve, reject){
            SearchmoduleById(param).then(response => {
                if(response.code=== 0){
                    resolve(response.data)
                }
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
		
    }

    /**
     * 编辑模块
     * @param {*} values 
     */
    @action
	editModuleById = (values) => {
		EditmoduleById(values).then(response => {
            if(response.code===0){
                this.findModulePage(values.project.id,this.searchModuleName)
            }
        }).catch(error => {
            console.log(error)
        })
    }

    /**
     * 根据项目id查找模块，带分页
     * @param {*} projectId 
     * @param {*} moduleName 
     * @returns 
     */
    @action
	findModulePage = (projectId,moduleName) => {
        this.searchSprintId = projectId
        this.searchModuleName = moduleName
        const params={
            projectId: projectId,
            moduleName: moduleName,
            orderParams: [{
                name: "moduleName",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: this.modulePageParam.pageSize,
                currentPage: this.modulePageParam.current
            }
        }
        return new Promise((resolve,reject)=>{
            FindModulePage(params)
                .then(response => {
                    if(response.code===0){
                        this.modulelist = response.data.dataList
                        this.modulePageParam.totalRecord = response.data.totalRecord
                        }
                        resolve(response.data)
                    })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
            }

        )
    }

    /**
     * 设置分页参数
     * @param {*} value 
     */
    @action
    setPageParam = (value)=> {
        this.modulePageParam = {...value}
    }
}

export const MODULE_STORE = "moduleStore"