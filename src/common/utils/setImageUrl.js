/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 14:28:00
 * @Description: 设置图片地址
 */

import { getUser } from "tiklab-core-ui";

const tenant = getUser(). tenant;

const setImageUrl = (url) => {
    const imageUrl = version === "cloud" ? 
        (upload_url + url + "?tenant=" + tenant)
        :
        (upload_url + url);
    return imageUrl;
} 

export default setImageUrl;