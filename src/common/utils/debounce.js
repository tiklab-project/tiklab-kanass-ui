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
