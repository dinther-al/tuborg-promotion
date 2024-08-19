import { isEmpty } from "lodash";
import axios from "axios";
import axiosRetry from "axios-retry";
import md5 from "md5";
import { getRecoil } from "recoil-nexus";
import { userInfoAtom } from "../userInfo/userInfo.recoil";

axiosRetry(axios, {
    retries: 1,
    retryCondition: (error: any) => {
        return [200, 400, 403].indexOf(error?.response?.status) == -1;
    },
});

export const pangoACTApi = {
    async axiosPost(userInfo: any, data: any) {
        if (isEmpty(userInfo)) {
            userInfo = getRecoil(userInfoAtom);
        }
        const KEY = `${import.meta.env.VITE_MD5_KEY}`;
        const eventAt = new Date().getTime();
        var md5Request = md5(`${userInfo?.orgId}_${KEY}_${userInfo?.userAppId}_${eventAt}`);

        const API_URL = `${import.meta.env.VITE_BACKEND_API_ENDPOINT}${data.endpoint}`;
        try {
            const response = await axios
                .post(API_URL, data.data, {
                    headers: {
                        ...(data.headers || {}),
                        authorization: userInfo?.zoaToken,
                        organizationid: userInfo?.orgId || "",
                        username: userInfo?.userAppId || "",
                        requestedAt: eventAt,
                        exp: md5Request,
                        cdpAppId: userInfo?.cdpaid,
                    },
                })
                .catch(async function (error) {
                    console.error(error);
                    if (error?.response?.status == 401) {
                        //handle 401 status
                    }
                    return {};
                });
            return response;
        } catch (error) {
            console.error(error);
        }
        return {} as any;
    },
};
