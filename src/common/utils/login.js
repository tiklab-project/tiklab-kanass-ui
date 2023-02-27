/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-01-08 11:03:32
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-08 17:58:00
 */
import Cookies from 'js-cookie'
const setUser = (name, email, phone, ticket, userId ) => {
    const host = window.location.host.toString()
    try {
        Cookies.set('name', name);
        Cookies.set('email', email);
        Cookies.set('phone', phone);
        Cookies.set('ticket', ticket);
        Cookies.set('userId', userId);
    } catch (e) {
        Cookies.set(host + '_name', name);
        Cookies.set(host + '_email', email);
        Cookies.set(host + '_phone', phone);
        Cookies.set(host + '_ticket', ticket);
        Cookies.set(host +'_userId', userId)
    }
}

const removeUser = () => {
    const host = window.location.host.toString()
    try {
        Cookies.remove('name');
        Cookies.remove('email');
        Cookies.remove('phone');
        Cookies.remove('ticket');
        Cookies.remove('userId')
    } catch (e) {
        Cookies.remove(host + '_name');
        Cookies.remove(host + '_email');
        Cookies.remove(host + '_phone');
        Cookies.remove(host + '_ticket');
        Cookies.remove(host +'_userId')
    }
}


const  parseSearch = (url)=>{
    let params = {}
    let h
    let hash = url.slice(url.indexOf('?') + 1).split('&')
    for (let i = 0; i < hash.length; i++) {
        h = hash[i].split('=') //
        params[h[0]] = h[1]
    }
    return params
}

export {setUser,parseSearch}