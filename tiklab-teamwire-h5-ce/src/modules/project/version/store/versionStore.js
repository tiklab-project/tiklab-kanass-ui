/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 18:27:59
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-19 19:20:36
 */
import { observable, action } from "mobx";
import { FindVersionList, CreateVersion, FindVersion, EditVersion } from "../api/version";

export class VersionStore {

    @action
    findVersionList = async (value) => {
        let data = await FindVersionList(value);
        return data;
    }

    @action
    createVersion = async (value) => {
        let data = await CreateVersion(value);
        return data;
    }

    @action
    updateVersion = async (value) => {
        let data = await EditVersion(value);
        return data;
    }

    @action
    findVersion = async (value) => {
        const params = new FormData();
        params.append("id", value.id)
        let data = await FindVersion(params);
        return data;
    }

}
export const VERSION_STORE = "versionStore"