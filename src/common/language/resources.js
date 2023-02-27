/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-04-21 10:12:54
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-09-17 11:15:34
 */
import zhCnTrans from "./cn/translation.json";

import {eam_cn} from "tiklab-eam-ui/es/_utils";
import {privilege_cn} from "tiklab-privilege-ui/es/_utils";
import {flow_cn} from "tiklab-flow-ui/es/_utils";
import {message_cn} from "tiklab-message-ui/es/_utils";
import {pluginManage_cn} from "tiklab-plugin-ui/es/_utils";
import {form_cn} from "tiklab-form-ui/es/_utils";
import { orga_cn } from "tiklab-user-ui/es/_utils";
import oplog_cn from "tiklab-oplog-ui/es/_utils/language";
import { todoTask_cn } from "tiklab-todotask-ui/es/_utils";
const resources = {
    zh: {
        translation: {...zhCnTrans, ...eam_cn, ...privilege_cn, ...flow_cn, ...message_cn, ...pluginManage_cn, ...form_cn, ...orga_cn, ...todoTask_cn, ...oplog_cn},
    }
}

export default resources;