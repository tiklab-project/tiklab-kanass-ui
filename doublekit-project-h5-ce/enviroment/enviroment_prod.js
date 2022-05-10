/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-04-19 15:58:49
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-14 21:25:32
 */
const api =  '/';
const base_url = JSON.stringify(api);

const url = "/";
const plugin_base_url = JSON.stringify(url);

let pluginAddressUrl = `/pluginConfig/getPluginConfig`;
pluginAddressUrl = JSON.stringify(pluginAddressUrl);

const img_url = JSON.stringify("http://192.168.2.92:5100")
// 判断是否是用户环境， 如果是用户环境收到切换为true， 如果是内部公司手动切换为false
const userProduction = true;

let fetchMethod = "post"
fetchMethod = JSON.stringify(fetchMethod);

let env = "prod";
env = JSON.stringify(env)

const appKey = JSON.stringify('');
const appSecret = JSON.stringify('');
const version = JSON.stringify('');
const client = JSON.stringify('');
const isSaas = false;
const cookieDomain=  JSON.stringify('doublekit.cn');
const acc_url = JSON.stringify("/")
module.exports = {
    base_url,
    userProduction,
    plugin_base_url,
    pluginAddressUrl,
    fetchMethod,
    env,
    appKey,
    appSecret,
    version,
    client,
    img_url,
    isSaas,
    cookieDomain,
    acc_url
}