/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-04-21 10:12:54
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-09-17 11:15:34
 */
import zhCnTrans from "./cn/translation.json";

import {eam_cn} from "thoughtware-eam-ui/es/utils";
import {flow_cn} from "thoughtware-flow-ui/es/utils";
import {message_cn} from "thoughtware-message-ui/es/utils";
import {form_cn} from "thoughtware-form-ui/es/utils";
import { user_cn } from "thoughtware-user-ui/es/utils";
import {oplog_cn} from "thoughtware-security-ui/es/utils";
import {privilege_cn} from "thoughtware-privilege-ui/es/utils"
const resources = {
    zh: {
        translation: {...zhCnTrans, ...eam_cn, ...flow_cn, ...message_cn,  ...form_cn, ...user_cn, ...oplog_cn, ...privilege_cn},
    }
}

export default resources;