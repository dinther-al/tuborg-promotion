import axios from 'axios'
import axiosRetry from 'axios-retry'
import md5 from 'md5'

axiosRetry(axios, {
  retries: 1,
  retryCondition: (error: any) => {
    return [200, 400, 403].indexOf(error?.response?.status) == -1
  }
})

export const userInfoApi = {
  async zoaUserInfoV2(userInfo: any) {
    try {
      const API_URL = `${import.meta.env.VITE_AUTH_API}/api/zma/p-userinfo/get`
      const response = await axios.post(API_URL, {
        token: userInfo.token,
        accessToken: userInfo.accessToken
      })
      return response
    } catch (error) { }
    return {}
  },
  async getZMAToken(userInfo: any) {
    try {
      if (!userInfo.accessToken) {
        userInfo.accessToken = 'DEFAULT ACCESS TOKEN'
      }
      const eventAt = new Date().getTime()
      const exp = md5(`zma_token_${userInfo.userAppId}_${eventAt}`)
      const API_URL = `${import.meta.env.VITE_AUTH_API}/api/zma/p-token/generate`

      const response = await axios.post(API_URL, {
        cdpAppId: userInfo.cdpaid,
        accessToken: userInfo.accessToken,
        exp,
        requestedAt: eventAt,
        anonymous: userInfo.anonymous
      })
      return response?.data
    } catch (error) { }
    return {}
  }
}
