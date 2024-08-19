import axios from "axios";
import axiosRetry from "axios-retry";
import md5 from "md5";

axiosRetry(axios, {
    retries: 1,
    retryCondition: (error: any) => {
        return [200, 400, 403].indexOf(error?.response?.status) == -1;
    },
});

export const pangoCDPApi = {
    async enrich(userInfo: any) {
        const API_URL = `${import.meta.env.VITE_CDP_ENDPOINT}/mchannel/api/v2.0/zmapps/${
            userInfo?.cdpaid || ""
        }/zoa/_enrich`;
        const API_URL_2 = `${import.meta.env.VITE_CDP_ENDPOINT}/dhub-ip/api/v2.0/internal/zmapps/${
            userInfo?.cdpaid || ""
        }/zoa/_enrich`;
        const requestedAt = new Date().getTime();
        userInfo = { ...userInfo, requestedAt };
        let response: any = {};
        try {
            response = await axios.post(API_URL, getPayload(userInfo), getHeaders(userInfo));
            if (!response.data.success) {
                throw {
                    errorCode: response?.data?.errorCode,
                    message: response?.data?.message,
                };
            }
            return response?.data;
        } catch (error) {
            try {
                response = await axios.post(API_URL_2, getPayload(userInfo), getHeaders(userInfo));
                if (!response.data.success) {
                    throw {
                        errorCode: response?.data?.errorCode,
                        message: response?.data?.message,
                    };
                }
            } catch (error: any) {
                throw error?.response?.data;
            }
        }
        return response?.data;
    },
    async ingest(userInfo: any, data: any) {
        const API_URL = `${import.meta.env.VITE_CDP_ENDPOINT}/mchannel/api/v2.0/zmalogs/${
            userInfo?.cdpaid
        }/ingest`;
        const API_URL_2 = `${import.meta.env.VITE_CDP_ENDPOINT}/dhub-i/api/v2.0/internal/zmalogs/${
            userInfo?.cdpaid
        }/ingest`;
        const requestedAt = new Date().getTime();
        userInfo = {
            ...userInfo,
            requestedAt,
            eventAt: requestedAt,
            event: data.event,
            trigger: data.userEvent ? "UserEvent" : "AutoEvent",
        };
        if (data.unique) {
            userInfo.eventId = `${userInfo?.uniqueEventKey}_${data.uniqueId ?? data.event}`;
        }
        try {
            await axios.post(API_URL, userInfo, getHeaders(userInfo));
        } catch (error: any) {
            try {
                userInfo = { ...userInfo, retry: true, retryReason: error.message };
                await axios.post(API_URL_2, userInfo, getHeaders(userInfo));
            } catch (error) {}
        }
    },
    async zoaLiveVersion(userInfo: any) {
        const API_URL = `${import.meta.env.VITE_CDP_ENDPOINT}/mchannel/api/v1.0/zmapps/${
            userInfo?.appId
        }/zoa/_live_version`;
        const API_URL_2 = `${import.meta.env.VITE_CDP_ENDPOINT}/dhub-ip/api/v1.0/zmapps/${
            userInfo?.appId
        }/zoa/_live_version`;
        const requestedAt = new Date().getTime();
        userInfo = { ...userInfo, requestedAt };
        const payload = {
            orgId: userInfo?.orgId,
            userAppId: userInfo?.appId,
            requestedAt: userInfo?.requestedAt,
        };
        const headers = {
            headers: {
                "Content-Type": "application/json",
                exp: md5(
                    userInfo?.orgId + ":" + userInfo?.requestedAt + ":" + userInfo?.appId
                ) as any,
            },
        };
        let response: any = {};
        try {
            response = await axios.post(API_URL, payload, headers);
        } catch (error) {
            try {
                response = await axios.post(API_URL_2, payload, headers);
            } catch (error) {}
        }
        return response?.data;
    },
};

// function
const getPayload = (userInfo: any) => {
    return {
        orgId: userInfo.orgId,
        userAppId: userInfo.userAppId,
        requestedAt: userInfo.requestedAt,
    };
};
const getHeaders = (userInfo: any) => {
    return {
        headers: {
            "Content-Type": "application/json",
            exp: md5(userInfo.orgId + ":" + userInfo.requestedAt + ":" + userInfo.cdpaid) as any,
            authorization: userInfo?.zoaToken,
        },
    };
};
