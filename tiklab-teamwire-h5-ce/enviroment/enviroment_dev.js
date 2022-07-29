/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-04-19 15:32:55
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-27 13:43:09
 */
const api =  'http://192.168.10.84:8080/';
const base_url = JSON.stringify(api);

const url = "http://49536dr156.qicp.vip:48536/";
const plugin_base_url = JSON.stringify(url);

let pluginAddressUrl = `${url}/config.json`;
pluginAddressUrl = JSON.stringify(pluginAddressUrl);

// 判断是否是用户环境， 如果是用户环境收到切换为true， 如果是内部公司手动切换为false
const userProduction = true;

let fetchMethod = "get"
fetchMethod = JSON.stringify(fetchMethod);

let env = "dev";
env = JSON.stringify(env)

const appKey = JSON.stringify('');
const appSecret = JSON.stringify('');
const version = JSON.stringify('');
const client = JSON.stringify('');
const isSaas = false
const plugin_url =  JSON.stringify( 'http://localhost:8080/plugins/config.json')
const cookieDomain=  JSON.stringify('tiklab.cn');

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
    isSaas,
    plugin_url,
    cookieDomain
}