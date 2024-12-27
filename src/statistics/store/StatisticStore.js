/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-20 14:12:22
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 10:32:36
 */
import axios from "axios";
import { Service, ServiceGet } from "../../common/utils/requset";
import { observable, action } from "mobx";
import { getUser } from "tiklab-core-ui";

export class StatisticsStore {
    // 事项统计
    @observable statisticsWorkList = [];

    // 人事统计
    @observable statisticsUserList = [];
    @observable UserXaixs = [];
    @observable UserYaixs = [];
    @observable UserPreData = [];
    @observable reportId = ""
  



    @action
    statisticWorkItem = async (value) => {
        const data = await Service("/statistic/statisticWorkItem", value)
        return data;
    }


    @action
    findDmUserPage = async (value) => {
        const params = {
            domainId: value.projectId,
            pageParam: { pageSize: 10, currentPage: 1 }
        }
        const data = await Service("/dmUser/findDmUserPage", params)
        return data;
    }


    @action
    findProjectList = async (values) => {
        const params = {
            orderParams: [{
                name: "projectName",
                orderType: "asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: 1
            },
            projectSetId: values.projectSetId
        }
        const data = await Service("/projectSet/findProjectList", params)
        this.projectRelevance = data.data
        return data;
    }

    /**
     * 查询项目每个成员的工时
     * @param {*} value 
     * @returns 
     */
    @action
    findProjectUserLog = async (value) => {
        this.selectUserCondition = { ...this.selectUserCondition, ...value }
        const data = await Service("/workLog/findProjectUserLog", this.selectUserCondition);
        return data;
    }

    /**
     * 查找项目下每个事项的工时
     * @param {*} value 
     * @returns 
     */
    @action
    findProjectWorkItemLog = async (value) => {
        this.selectUserCondition = { ...this.selectUserCondition, ...value }
        const data = await Service("/workLog/findProjectWorkItemLog", this.selectUserCondition);
        return data;
    }

    /**
     * 查询成员负责的每个项目的工时
     * @param {*} value 
     * @returns 
     */
    @action
    findUserProjectLog = async (value) => {
        this.selectWorkCondition = { ...this.selectWorkCondition, ...value };
        const data = await Service("/workLog/findUserProjectLog", this.selectWorkCondition);
        return data;
    }

    @action
    uploadProjectUserLogPdf = async (value) => {
        await axios({
            method: 'post',
            url: '/projectInsightReport/uploadProjectUserLogPdf',
            responseType: 'blob',
            headers: {
                'ticket': getUser().ticket // 设置其他自定义请求头
            },
            data: value,
            baseURL: base_url
        }).then(function (response) {
            var blob = new Blob([response.data], { type: 'application/octet-stream' });
            var downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = '日志项目成员统计.pdf';
            downloadLink.style.display = 'none';

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }).catch(function (error) {
            console.error(error);
        });
    }

    @action
    uploadProjectWorkLogPdf = async (value) => {
        await axios({
            method: 'post',
            url: '/projectInsightReport/uploadProjectWorkLogPdf',
            responseType: 'blob',
            headers: {
                'ticket': getUser().ticket // 设置其他自定义请求头
            },
            data: value,
            baseURL: base_url
        }).then(function (response) {
            var blob = new Blob([response.data], { type: 'application/octet-stream' });
            var downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = '日志项目事项统计.pdf';
            downloadLink.style.display = 'none';

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }).catch(function (error) {
            console.error(error);
        });
    }

    @action
    uploadLogUserProjectPdf = async (value) => {
        await axios({
            method: 'post',
            url: '/projectInsightReport/uploadLogUserProjectPdf',
            responseType: 'blob',
            headers: {
                'ticket': getUser().ticket // 设置其他自定义请求头
            },
            data: value,
            baseURL: base_url
        }).then(function (response) {
            var blob = new Blob([response.data], { type: 'application/octet-stream' });
            var downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = '日志成员项目统计.pdf';
            downloadLink.style.display = 'none';

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }).catch(function (error) {
            console.error(error);
        });
    }

}

export default new StatisticsStore();

