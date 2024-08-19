
export interface UserInfo {
    orgId: string;
    userId: string;
    cdpaid: string;
    sessionId: string;
    oaId: string;
    oaName: string;
    appId: string;
    appName: string;
    followedOA: boolean;
    userAppId: string;
    userName: string;
    userAvatar: string;
    userPhone: string;
    qrIds: Array<string>;

    trigger: string;
    event: string;
    eventAt: number;
    eventData: any;
    eventKey: string;
    tid: string;
    cid: string;
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_keyword: string;
    userAgent: string;
    uniqueEventKey: string;
    enrichSuccess: boolean;
    accessToken: any;
    anonymous: boolean;
    reachedMaxAct: false;
    reachedMaxActMessage: string;
    zoaToken: any;

    campaignCode: string; // required
    verifyCode: string;
    pangoWheelCode: string;
    campaign: any;
    gift: object;

    rootType?: string;
    ward: string;
    district: string;
    districtCode: string;
    address: string;
    addressCode: string;
    provinceCode: string;
    province: string;

    getPhoneNumbersSuccess: boolean;
    getUserSuccess: boolean;

    agreeTerms: boolean;
}