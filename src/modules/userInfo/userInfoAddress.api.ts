import { getRecoil } from 'recoil-nexus'
import { pangoACTApi } from '../apis/pangoACT.api'
import { userInfoAtom } from './userInfo.recoil'

export const infoOrderApi = {
  async getTerritoryByQuery(payload: any) {
    let query: any = {}

    const userInfo = getRecoil(userInfoAtom)

    if (payload.type == 'inLine') {
      query = {
        bool: {
          must: [{ term: { rootType: 'xaphuong' } }],
          should: [
            {
              bool: {
                should: [
                  {
                    match: {
                      nameWithType: {
                        query: payload?.text?.toString().trim() || '',
                        operator: 'or'
                      }
                    }
                  },
                  {
                    match: {
                      pathWithType: {
                        query: payload?.text?.toString().trim() || '',
                        operator: 'and'
                      }
                    }
                  }
                ],
                minimum_should_match: 1
              }
            },
            {
              match: {
                pathWithType: {
                  query: payload?.text?.toString().trim() || '',
                  operator: 'and'
                }
              }
            }
          ],
          minimum_should_match: 2
        }
      }
    } else {
      query = {
        bool: {
          must: [
            {
              term: {
                rootType: userInfo?.rootType === 'thanhpho' ? 'thanhpho' : userInfo?.rootType
              }
            }
          ]
        }
      }

      if (payload?.text) {
        query.bool.should = [
          {
            match_phrase: {
              name: payload?.text?.toString().trim() || ''
            }
          }
        ]

        if (userInfo.rootType !== 'thanhpho') {
          query.bool.should.push(
            {
              bool: {
                should: [
                  {
                    match: {
                      nameWithType: {
                        query: payload.text.toString().trim() || '',
                        operator: 'or'
                      }
                    }
                  },
                  {
                    match: {
                      pathWithType: {
                        query: payload.text.toString().trim() || '',
                        operator: 'and'
                      }
                    }
                  }
                ],
                minimum_should_match: 1
              }
            },
            {
              match: {
                pathWithType: {
                  query: payload.text.toString().trim() || '',
                  operator: 'and'
                }
              }
            }
          )
          query.bool.minimum_should_match = 2
        } else {
          query.bool.minimum_should_match = 1
        }
      }

      var parentCode = ''
      switch (userInfo.rootType) {
        case 'thanhpho':
          parentCode = ''
          break
        case 'quanhuyen':
          parentCode = userInfo.provinceCode
          break
        case 'xaphuong':
          parentCode = userInfo.districtCode
          break
      }

      if (parentCode) {
        query.bool.must.push({
          term: {
            parentCode: parentCode
          }
        })
      }
    }
    try {
      const response = await pangoACTApi.axiosPost(userInfo, {
        endpoint: '/happy01Touch/getTerritoryByQuery',
        data: {
          from: 0,
          size: 150,
          sort: {
            field: 'code.keyword',
            sortOrder: 0
          },
          query: query
        }
      })
      return response.data
    } catch (error) {
      return []
    }
  }
}
