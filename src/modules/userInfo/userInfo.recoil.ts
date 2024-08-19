import { JSEncrypt } from "jsencrypt";
import { isEmpty, map, omitBy } from "lodash";
import { atom, selector, useRecoilCallback } from "recoil";
import { v4 as uuidv4 } from "uuid";
import api from "zmp-sdk";
import { pangoCDPApi } from "../apis/pangoCDP.api";
import { userInfoApi } from "./userInfo.api";
import { UserInfo } from "./userInfo.model";

export const userInfoSelector = selector<UserInfo>({
    key: "userInfoSelector",
    get: async ({}) => {
        try {
            const uuid = uuidv4();
            const timestamp = new Date().getTime();
            let defaultUserInfo: UserInfo = {
                orgId: "8e23f11bae7e38478c3d0f99f467bb58",
                userId: "",
                cdpaid: "da7b4e3041dbea28e28a5a0a91e5baa3-1718700238973",
                sessionId: uuid,
                oaId: "",
                oaName: "",
                appId: "4352031027937862044",
                appName: "",
                followedOA: false,
                userAppId: "",
                userName: "",
                userAvatar:
                    "https://storage.googleapis.com/pangocdp-images/p-act/public/c9385ae058a24a129175d183ec46711e.png", //https://storage.googleapis.com/pangocdp-images/p-act/public/c9385ae058a24a129175d183ec46711e.png
                userPhone: "",
                qrIds: [],

                trigger: "",
                event: "",
                eventAt: 0,
                eventData: {},
                eventKey: "",
                tid: "",
                cid: "",
                utm_source: "",
                utm_medium: "",
                utm_campaign: "",
                utm_keyword: "",
                userAgent: "",
                uniqueEventKey: `${uuid}_${timestamp}`,
                enrichSuccess: false,
                accessToken: "",
                anonymous: false,
                reachedMaxAct: false,
                reachedMaxActMessage: "",
                zoaToken: "",

                campaignCode: "20230920YZX3V", // default: 2024030747YBX | verifycode: 20230920YZX3V | dma: 20230918K5POK
                verifyCode: "",
                pangoWheelCode: "2023102793BMIITZGCOS",
                campaign: null,
                gift: {},

                getPhoneNumbersSuccess: false,
                getUserSuccess: false,

                agreeTerms: false,

                rootType: "",
                ward: "",
                district: "",
                districtCode: "",
                address: "",
                addressCode: "",
                provinceCode: "",
                province: "",
            };

            const routeParams = api.getRouteParams();
            const settings = await api.getSetting({});

            // bind defaultUserInfo
            if (settings.authSetting["scope.userInfo"] || routeParams?.rui == "1") {
                const { userInfo } = await api.getUserInfo({});
                const accessToken = await api.getAccessToken({});
                defaultUserInfo = {
                    ...defaultUserInfo,
                    ...{
                        userId: userInfo?.idByOA || "",
                        userAgent: navigator?.userAgent,
                        userAppId: userInfo?.id,
                        userName: userInfo?.name || "Guest",
                        userAvatar:
                            userInfo?.avatar ||
                            "https://storage.googleapis.com/pangocdp-images/p-act/public/c9385ae058a24a129175d183ec46711e.png",
                        accessToken,
                        anonymous: false,
                    },
                };
            } else {
                const userAppId = (await api.getUserID()) || "3368637342326461234";
                defaultUserInfo = {
                    ...defaultUserInfo,
                    ...{
                        userAppId: userAppId,
                        anonymous: true,
                    },
                };
            }

            const query = (routeParams && omitBy(routeParams, (v: string) => v == "")) || {};

            // check version
            if (
                `${import.meta.env.VITE_VERSION_CONTROL}` == "true" &&
                (!query.orgId || !query.cdpaid)
            ) {
                const versionNumber = `${import.meta.env.VITE_VERSION_NUMBER}`;
                const cdpAppVersion = (await pangoCDPApi.zoaLiveVersion(defaultUserInfo)) as any;
                if (cdpAppVersion?.success && versionNumber <= cdpAppVersion?.result?.version) {
                    throw {
                        errorCode: "VERSION_NOT_VALID",
                    };
                }
            }
            defaultUserInfo = {
                ...defaultUserInfo,
                ...query,
            };

            // get token
            let zoaToken: any = {};
            if (defaultUserInfo.anonymous) {
                var encrypt = new JSEncrypt();
                encrypt.setPublicKey(`${import.meta.env.VITE_PUBLIC_KEY}`);
                const eventAt = new Date().getTime();
                var encrypted = encrypt.encrypt(`${defaultUserInfo.userAppId}::${eventAt}`);
                zoaToken = await userInfoApi.getZMAToken({
                    ...defaultUserInfo,
                    accessToken: encrypted,
                });
            } else {
                zoaToken = await userInfoApi.getZMAToken(defaultUserInfo);
            }

            defaultUserInfo = {
                ...defaultUserInfo,
                zoaToken: zoaToken.data,
            };

            // get event data
            let pangoKey = {};
            map(query, (v, k) => {
                if (k.indexOf("pango_") > -1) pangoKey[k] = v;
            });
            if (!isEmpty(pangoKey)) {
                defaultUserInfo.eventData = {
                    ...defaultUserInfo.eventData,
                    ...pangoKey,
                };
            }

            // enrich
            const enrich = await pangoCDPApi.enrich(defaultUserInfo);
            defaultUserInfo = {
                ...defaultUserInfo,
                ...(omitBy(enrich?.result, (v: string) => !v) || {}),
                enrichSuccess: enrich?.success || false,
            };
            if (defaultUserInfo.appName) {
                await api.setNavigationBarTitle({
                    title: defaultUserInfo.appName,
                });
            }

            // ingest
            await pangoCDPApi.ingest(defaultUserInfo, {
                event: "open-app",
                userEvent: false,
                unique: true,
            });

            // console.log("Init userInfoAtom:", defaultUserInfo);
            return {
                ...defaultUserInfo,
            } as any;
        } catch (error) {}
        return {} as any;
    },
});

export const userInfoAtom = atom<UserInfo>({
    key: "userInfoAtom",
    default: userInfoSelector,
    effects: [
        ({ onSet }) => {
            onSet((newValue: any) => {
                console.log("Current userInfoAtom:", newValue);
            });
        },
    ],
});

export const useUpdateEventData = () => {
    const updateEventData = useRecoilCallback(
        ({ set }) =>
            async (eventData?: any, extendUserInfo?: any) => {
                set(userInfoAtom, (currentUserInfo: any) => {
                    let newUserInfo = {
                        ...currentUserInfo,
                        ...extendUserInfo,
                        eventData: { ...currentUserInfo.eventData, ...eventData },
                    };
                    return newUserInfo;
                });
            },
        []
    );
    return updateEventData;
};

export const useIngestCDP = () => {
    const ingestCDP = useRecoilCallback(
        ({ snapshot }) =>
            async (event) => {
                const currentUserInfo = await snapshot.getPromise(userInfoAtom);
                await pangoCDPApi.ingest(currentUserInfo, event);
            },
        []
    );
    return ingestCDP;
};
