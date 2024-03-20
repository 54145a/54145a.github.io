"use strict";

const UPDATE_MIN_INTERVAL = 1000;

function createDeepProxy(target, handler) {
    const deepHandler = Object.assign({}, handler);
    deepHandler.get = (target, property) => {
        const value = Reflect.get(target, property);
        if (typeof (value) === "object" && value !== null) {
            return createDeepProxy(value, handler);
        } else {
            if (handler.get) {
                return handler.get(target, property, void 0);
            } else {
                return value;
            }
        }
    };
    return new Proxy(target, deepHandler);
}
function createStorageObject(defaultValue, updator) {
    let scheduledUpdate = false;
    let cache = Object.assign({}, defaultValue);
    return createDeepProxy(
        cache,
        {
            set(target, property, value) {
                if (!scheduledUpdate) {
                    scheduledUpdate = true;
                    setTimeout(async () => {
                        scheduledUpdate = false;
                        await updator(cache);
                    }, UPDATE_MIN_INTERVAL);
                }
                return Reflect.set(target, property, value);
            }
        }
    );
}

function getStorage(name) {
    const defaultValue = localStorage.getItem(name);
    return createStorageObject(
        defaultValue ? JSON.parse(defaultValue) : {},
        async (data) => {
            localStorage.setItem(name, JSON.stringify(data));
        }
    );
}
if (new URLSearchParams(location.search).get("eruda")) {
    let script = document.createElement('script');
    script.src = "//cdn.bootcdn.net/ajax/libs/eruda/3.0.1/eruda.min.js";
    document.body.append(script);
    script.onload = function () {
        eruda.init();
    };
}

Object.assign(globalThis, {
    getStorage
});