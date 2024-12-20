/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 14:24:07
 * @Description: 防抖节流
 */

import { useRef, useCallback, useEffect } from "react";
export function useDebounce(fn, delay, dep = []) {
    const { current } = useRef({ fn, timer: null });
    useEffect(function () {
        current.fn = fn;
    }, [fn]);
    return useCallback(function f(...args) {
        if (current.timer) {
            clearTimeout(current.timer);
        }
        current.timer = setTimeout(() => {
            current.fn.call(this, ...args);
        }, delay);
    }, dep)
}

// 节流
export function useThrottle(fn, delay, dep = []) {
    const { current } = useRef({ fn, timer: null })
    useEffect(
        function () {
            current.fn = fn
        },
        [fn]
    )
    return useCallback(function f(...args) {
        if (!current.timer) {
            current.timer = setTimeout(() => {
                delete current.timer
            }, delay)
            current.fn.call(this, ...args)
        }
    }, dep)
}
