import { useRecoilState, useRecoilValue } from 'recoil';
import api from 'zmp-sdk';
import { useIngestCDP, userInfoAtom } from '../userInfo/userInfo.recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
import axios from 'axios';

export const getPhoneNumbers = async (allowed:boolean = false) => {
    const settings  = await api.getSetting({});
    const user = getRecoil(userInfoAtom);

    if (settings.authSetting['scope.userPhonenumber'] && !user.userPhone && !allowed) return;
    if (!settings.authSetting['scope.userPhonenumber'] || !user.userPhone || allowed) {
        await api.hideKeyboard({});
        const accessToken = await api.getAccessToken({});
        // console.log("accessToken: " + accessToken)
        return new Promise((resolve, reject) => {
            api.getPhoneNumber({
                success: async (data) => {
                    const token = data.token;
                    const endpoint = "https://graph.zalo.me/v2.0/me/info";
                    const userAccessToken = accessToken;
                    const secretKey = "3r7KSeX3jkXKuFgXhfHU";
                    try {
                        const response = await axios.get(endpoint, {
                            headers: {
                                access_token: userAccessToken,
                                code: token,
                                secret_key: secretKey,
                            },
                        });
                        // console.log(response.data)
                        let numberPhone = "0" + response.data.data.number.slice(2);
                        setRecoil(userInfoAtom, {
                            ...user,
                            userPhone: numberPhone,
                            getPhoneNumbersSuccess: true,
                        })
                        // console.log("user da update:", user);
                        resolve(numberPhone);
                    } catch (error) {
                        console.error("Error:", error);
                        reject(error);
                    }
                },
                fail: (error) => {
                    console.log(error);
                    reject(error);
                },
            })
        });
    }
}

export const getUser = async(allowed:boolean = false ) => {
    const settings  = await api.getSetting({});
    const user = getRecoil(userInfoAtom)

    let userInfoUpdate: any = {};
    if(settings.authSetting['scope.userInfo'] && !user.userName && !allowed) return;
    if(!settings.authSetting['scope.userInfo'] || !user.userName || allowed){
        await api.hideKeyboard({});
        console.log("allowed: ",allowed)
        try {
            const { userInfo } = await api.getUserInfo({});
            userInfoUpdate = {
                ...userInfoUpdate,
                userId: userInfo.id, 
                userName: userInfo.name, 
                userAvatar: userInfo.avatar,
                getUserSuccess: true
            }
            // console.log(state.user);
        } catch (error) {
            console.log(error);
            userInfoUpdate = {
                ...userInfoUpdate,
                userName: 'Guest',
                userAvatar: "https://res.cloudinary.com/dxjxqt01d/image/upload/v1716370348/user_fsdh4y.png", //'https://res.cloudinary.com/dxjxqt01d/image/upload/v1716370348/user_fsdh4y.png',
            }
        }  
    }
    setRecoil(userInfoAtom, {
        ...user,
        ...userInfoUpdate
    })
}

export const follow = async(ingestCDP) => {
    const user = getRecoil(userInfoAtom);
    try {
        if(user.followedOA) {
            return true;
        }
        await api.followOA({
            id: "4593950148585719824"
        });
        ingestCDP({
            event: "follow-oa",
            userEvent: true,
            unique: true
        });
        setRecoil(userInfoAtom, {
            ...user,
            followedOA : true
        })
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const bindUserInfo = async() =>{
    const settings  = await api.getSetting({});
    const user = getRecoil(userInfoAtom);
    if (settings.authSetting['scope.userInfo'] && !user.getUserSuccess) {
        await getUser(true)
    }
    if (settings.authSetting['scope.userPhonenumber'] && !user.getPhoneNumbersSuccess) {
        await getPhoneNumbers(true)
    }
}