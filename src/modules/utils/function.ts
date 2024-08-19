import { last, chain } from "lodash";
import { setRecoil } from "recoil-nexus";
import api from "zmp-sdk";
import { checkboxCountAtom, isInputFocusedAtom } from "./appConfig.recoil";
// import { isInputFocusedAtom } from "./appConfig.recoil";

export const greeting = () => {
    var showdate = new Date();
    const timeNow = showdate.getHours();
    var greeting = "";
    if (timeNow < 11) {
        greeting = "Chào buổi sáng";
    } else if (timeNow < 16) {
        greeting = "Chào buổi trưa";
    } else {
        greeting = "Chào buổi tối";
    }
    return greeting;
};

export const handleInputFocus = () => {
    setRecoil(isInputFocusedAtom, true);
};

export const handleInputBlur = () => {
    setRecoil(isInputFocusedAtom, false);
};

export const shareLink = (link) => {
    api.openShareSheet({
        type: "link",
        data: {
            link: link,
            chatOnly: false,
        },
        success: (data) => {},
        fail: (err) => {},
    });
};

export const openChatScreen = async () => {
    try {
        await api.openChat({
            type: "oa",
            id: "4593950148585719824",
            message: "Xin Chào",
        });
    } catch (error) {
        console.log(error);
    }
};

export const getQueryParam = (param) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
};

export const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
};

export const convertLinkToObject = (link: string) => {
    if (link) {
        const queryString = link.split("?")[1];
        const paramsArray = queryString ? queryString.split("&") : [];

        const params = chain(paramsArray)
            .map((param) => param.split("="))
            .fromPairs()
            .mapValues(decodeURIComponent)
            .value();

        const isZMALink = /^https:\/\/zalo\.me\/s/.test(link);
        const isZappsLink = /^https:\/\/zalo\.me\/app\/link\/zapps\//.test(link);

        let appId = "";
        if (isZMALink || isZappsLink) {
            const matches: any = link.match(/\/(s|zapps)\/(\d+)\/?/);
            appId = matches[2];
        } else {
            appId = last(link.split("/"))?.split("?")?.[0] || "";
        }
        return { params, appId };
    }
    return null;
};

export const linkApp = async (url) => {
    const payload = convertLinkToObject(url);

    await api.openMiniApp({
        appId: payload?.appId || "",
        params: payload?.params,
        success: () => {
            // xử lý khi gọi api thành công
        },
        fail: (error) => {
            // xử lý khi gọi api thất bại
            console.log(error);
        },
    });
};

export const handleCheckboxChange = () => {
    setRecoil(checkboxCountAtom, (prevCount) => {
        const newCount = (prevCount % 5) + 1;
        return newCount;
    });
};
