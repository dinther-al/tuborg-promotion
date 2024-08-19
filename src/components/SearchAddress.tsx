import { cloneDeep } from 'lodash'
import { cn } from 'personal-standard-ui-custom'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { userInfoAtom } from '../modules/userInfo/userInfo.recoil'
import { infoOrderApi } from '../modules/userInfo/userInfoAddress.api'
import { isOpenSelectAddressAtom } from '../modules/utils/appConfig.recoil'
import { dataHeader, initAddress } from '../utils/initData'
import { handleInputBlur } from '../modules/utils/function'

interface ISearchAddress extends React.ComponentPropsWithoutRef<'div'> {setValue: any}

const SearchAddress: React.FC<ISearchAddress> = ({setValue}) => {
  return (
    <div className='pb-4 w-full h-full overflow-y-auto'><TypeSplitItem  setValue={setValue}/></div>
  )
}

export default SearchAddress

const TypeSplitItem = ({setValue}) => {
  // ================ Define =======================
  // const [userInfo, setUserInfo] = useRecoilState(userInfoAtom)
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);

  useEffect(() => {
    setValue(`${userInfo.ward ? userInfo.ward + ', ' : ''}${userInfo.district ? userInfo.district + ', ' : ''}${userInfo.province ? userInfo.province : ''}`);
  }, [userInfo]);
  // ================ State =======================
  const [data, setData] =useState({})
  const [currentRootType, setCurrentRootType] = useState(0)

  // ================ Function =======================
  const clearDataAddress = async () => {
    setUserInfo({
      ...userInfo,
      address: '',
      addressCode: '',
      province: '',
      provinceCode: '',
      district: '',
      districtCode: '',
      ward: '',
      rootType: 'thanhpho',
    })
  }
  const setIsOpenSelectAddress = useSetRecoilState(isOpenSelectAddressAtom)

  useEffect(() => {
    if (userInfo.province && userInfo.district && userInfo.ward) {
      setCurrentRootType(3)
    } else if (userInfo.province && userInfo.district && !userInfo.ward) {
      setCurrentRootType(3)
    } else if (userInfo.province && !userInfo.district && !userInfo.ward) {
      setCurrentRootType(2)
    } else {
      setCurrentRootType(1)
    }
  }, [userInfo])

  const checkRenderTitle = (title: string, subTitle: string) => {
    switch (subTitle) {
      case 'thanhpho':
        if (userInfo.province) {
          return userInfo.province
        }
        return `Chọn ${title}`
      case 'quanhuyen':
        if (userInfo.district) {
          return userInfo.district
        }
        return `Chọn ${title}`
      case 'xaphuong':
        if (userInfo.ward) {
          return userInfo.ward
        }
        return `Chọn ${title}`
      default:
        return `Chọn ${title}`
    }
  }

  const activeAddressDebounce = async (subTitle) => {
    if (subTitle === 'thanhpho') {
      setUserInfo({ ...userInfo, rootType: subTitle })
      getDataAddress('')
    } else if (subTitle === 'quanhuyen' && userInfo.province) {
      setUserInfo({ ...userInfo, rootType: subTitle })
      getDataAddress('')
    } else if (subTitle === 'xaphuong' && userInfo.province && userInfo.district) {
      setUserInfo({ ...userInfo, rootType: subTitle })
      getDataAddress('')
    }
  }

  const getTitleAddress = (type: string) => {
    switch (type) {
      case 'xaphuong':
        return 'Phường/Xã'
      case 'quanhuyen':
        return 'Quận/Huyện'
      case 'thanhpho':
        return 'Tỉnh/Thành Phố'
      default:
        return
    }
  }

  const getDataAddress = async (text) => {
    const res = await infoOrderApi.getTerritoryByQuery({
      text: text
    })
    if (Array.isArray(res.data) && res.data.length > 0) {
      res.data.sort((a, b) => a.name.localeCompare(b.name))

      const grouped = {}
      res.data.forEach((item) => {
        const firstLetter = item.name.charAt(0).toUpperCase()
        if (!grouped[firstLetter]) {
          grouped[firstLetter] = []
        }
        grouped[firstLetter].push(item)
      })

      for (const letter in grouped) {
        grouped[letter].sort((a, b) => a.name.localeCompare(b.name))
      }
      setData(grouped)
    } else {
      console.log('Không có dữ liệu hoặc dữ liệu không đúng định dạng.')
    }
  }

  useEffect(() => {
    getDataAddress('')
  }, [])

  const selectAddress = async (item) => {
    let newInfoOrder = cloneDeep(userInfo)

    if (
      (userInfo.rootType === 'thanhpho' && userInfo.province !== item?.nameWithType) ||
      (userInfo.rootType === 'quanhuyen' && userInfo.district !== item?.nameWithType)
    ) {
      newInfoOrder = { ...newInfoOrder, district: '', districtCode: '', ward: '' }
    }

    const rootTypeMap = {
      thanhpho: 'quanhuyen',
      quanhuyen: 'xaphuong',
      xaphuong: 'thanhpho'
    }
    newInfoOrder = { ...newInfoOrder, rootType: rootTypeMap[item?.rootType] }

    if (item?.rootType === 'thanhpho') {
      newInfoOrder = {
        ...newInfoOrder,
        province: item?.nameWithType,
        provinceCode: item?.code,
        rootType: 'quanhuyen',
        parentCode: item?.code
      }
      setUserInfo(newInfoOrder)
      getDataAddress('')
    } else if (item?.rootType === 'quanhuyen') {
      newInfoOrder = {
        ...newInfoOrder,
        district: item?.nameWithType,
        districtCode: item?.code,
        rootType: 'xaphuong',
        parentCode: item?.code
      }
      setUserInfo(newInfoOrder)
      getDataAddress('')
    } else if (item?.rootType === 'xaphuong') {
      newInfoOrder = { ...newInfoOrder, ward: item?.nameWithType, addressCode: item?.code }
      setUserInfo(newInfoOrder)
      setIsOpenSelectAddress(false)
      handleInputBlur()
    }
  }

  return (
    <>
      <div className='flex justify-between items-center text-sm w-full mt-4 px-4'>
        <p className='text-[#8b8b8b]'>Khu vực đã chọn</p>
        <p className='text-end text-primaryColor' onClick={() => clearDataAddress()}>
          Thiết lập lại
        </p>
      </div>

      <div className='relative flex flex-col gap-4 mx-3 mb-6 mt-2 before:absolute before:h-full before:w-1 before:left-[6px] before:border-l-2 before:border-dashed before:z-0 before:border-gray-300'>
        {dataHeader.slice(0, currentRootType).map((item) => {
          const isSelected = userInfo.rootType == item.subTitle
          return (
            <div
              key={item.key}
              className='relative z-10 flex gap-4 items-center'
              onClick={() => activeAddressDebounce(item.subTitle)}
            >
              <div
                className={cn('relative size-[.8rem] rounded-full left-[.5px] ', {
                  'bg-primaryColor before:absolute before:size-[.8rem] before:bg-primaryColor before:rounded-full before:animate-ping':
                    isSelected,
                  'bg-gray-300': !isSelected
                })}
              ></div>
              <span
                className={cn('font-semibold', {
                  'text-pribg-primaryColor': isSelected,
                  'text-gray-500': !isSelected
                })}
              >
                {checkRenderTitle(item.title, item.subTitle)}
              </span>
            </div>
          )
        })}
      </div>

      <div className='w-full h-2 bg-gray-300'></div>

      <p className='pt-4 pb-2 text-[#8b8b8b] text-sm px-4'>{getTitleAddress(userInfo?.rootType ?? 'thanhpho')}</p>

      {data && Object.entries(data).length ? (
        <div className='px-4'>
          {userInfo.rootType === 'thanhpho' ? (
            <div className='text-base py-2 pl-8 flex flex-col gap-1'>
              {initAddress.map((item) => (
                <div key={item.id} className='py-1' onClick={() => selectAddress(item)}>
                  {!item.parentCode ? item.name : item.nameWithType}
                </div>
              ))}
            </div>
          ) : null}

          {Object.entries(data).map(([letter, items]: [string, any[]]) => (
            <div key={letter}>
              <div className='absolute mt-3 font-bold text-gray-400'>{letter}</div>
              <ul className='text-base py-2 pl-8 flex flex-col gap-1'>
                {items.map((item, index) => (
                  <li key={index} className='py-1' onClick={() => selectAddress(item)}>
                    {item.parentCode ? item.nameWithType : item.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <NotData />
      )}
    </>
  )
}

const NotData = () => {
  return (
    <svg className='size-44 mx-auto' viewBox='0 0 282 282' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M245 182.676C244.996 172.789 237.521 164.505 227.688 163.486C217.854 162.467 208.84 169.043 206.809 178.719C201.888 177.343 196.854 176.412 191.767 175.936C191.169 172.961 190.36 170.031 189.348 167.17C195.605 161.518 198.176 152.842 196.009 144.693C193.842 136.545 187.301 130.291 179.063 128.493C170.825 126.696 162.274 129.655 156.909 136.159C152.067 134.508 147.085 133.303 142.024 132.56C137.022 127.247 130.614 123.464 123.546 121.651C122.584 121.408 121.564 121.623 120.781 122.233C119.998 122.842 119.541 123.779 119.541 124.772V126.039C116.405 125.139 113.153 124.711 109.891 124.772C108.615 124.783 107.467 125.546 106.963 126.718C106.458 127.899 106.694 129.267 107.565 130.211C108.206 130.985 108.704 131.866 109.035 132.814C107.51 133.181 106.063 133.618 104.67 134.101C99.2542 128.325 90.8605 126.442 83.4968 129.351C76.1331 132.261 71.2931 139.372 71.288 147.29C71.2711 152.993 73.7958 158.406 78.1753 162.059C76.182 167.713 74.709 173.537 73.7746 179.459C73.2564 184.164 71.0274 188.514 67.5114 191.683C67.476 191.718 67.4374 191.751 67.4052 191.786L66.7618 192.407C62.8565 196.212 58.4204 200.533 58.4204 213.429C58.4839 217.192 59.4386 220.886 61.2063 224.209C55.4122 225.397 51.4593 230.78 52.0603 236.664C52.6612 242.548 57.6206 247.021 63.5353 247.013H106.223C107.078 247.002 107.931 246.926 108.774 246.785C111.322 246.933 113.983 247.013 116.775 247.013C123.048 247.021 129.313 246.591 135.526 245.727C137.135 246.564 138.92 247.005 140.734 247.013H235.262C240.614 247.031 244.97 242.714 245 237.363V227.712C244.988 224.919 243.754 222.27 241.622 220.464C241.335 213.003 239.229 205.724 235.488 199.262C241.369 195.805 244.987 189.498 245 182.676ZM208.575 185.999C215.473 188.235 221.655 192.258 226.493 197.66C227.107 198.352 227.672 199.085 228.185 199.854C232.007 205.222 234.348 211.502 234.973 218.061H228.739C223.675 218.061 214.88 220.432 212.902 236.308C212.734 237.752 212.907 239.215 213.407 240.58H198.072C201.364 237.055 203.19 232.409 203.18 227.587C203.142 214.835 197.265 210.383 191.822 208.99C192.947 205.508 193.523 201.872 193.53 198.213C193.604 192.969 193.364 187.724 192.812 182.508C198.179 183.086 203.466 184.257 208.575 185.999ZM174.228 134.422C180.47 134.409 186.154 138.016 188.8 143.669C191.447 149.322 190.576 155.996 186.568 160.782C181.545 150.996 173.333 143.217 163.291 138.73C166.258 135.957 170.168 134.417 174.228 134.422ZM77.7218 147.29C77.7086 142.421 80.4518 137.965 84.8044 135.783C89.1569 133.602 94.3691 134.071 98.2616 136.996C90.673 141.291 84.6037 147.835 80.8904 155.725C78.844 153.392 77.7176 150.393 77.7218 147.29ZM80.1216 180.54C80.662 177.339 81.3215 174.032 82.1836 170.744C88.2135 168.672 94.8985 170.364 99.2154 175.057C103.532 179.75 104.662 186.552 102.095 192.389C99.5272 198.225 93.7486 201.989 87.3724 201.977C81.8508 201.958 76.7213 199.12 73.7714 194.453C77.2653 190.576 79.4822 185.719 80.1216 180.54ZM63.5353 240.58C60.8266 240.571 58.5948 238.451 58.4471 235.747C58.2994 233.042 60.2871 230.692 62.9788 230.389L63.5546 230.315C64.0725 230.25 64.6612 230.151 65.2113 230.077C69.3105 234.633 74.3717 238.22 80.0283 240.58H63.5353ZM64.8542 213.429C64.8542 205.303 66.6685 201.919 69.2163 199.108C75.4681 207.693 86.8729 210.735 96.5701 206.404C106.267 202.074 111.614 191.551 109.394 181.165C107.174 170.78 97.9926 163.362 87.3724 163.374C86.3965 163.381 85.4219 163.45 84.4547 163.58C88.9584 151.703 97.1421 141.268 113.494 138.46C115.195 138.165 116.36 136.581 116.135 134.869C115.995 133.78 115.764 132.703 115.443 131.653C117.238 131.875 118.96 132.496 120.484 133.47C121.403 134.389 122.784 134.664 123.985 134.169C125.186 133.674 125.971 132.505 125.975 131.205V129.192C130.585 131.073 134.702 133.987 138.009 137.71C138.519 138.286 139.217 138.66 139.978 138.765C181.499 144.546 187.096 172.06 187.096 198.213C187.077 201.718 186.423 205.191 185.166 208.462C179.142 208.383 173.248 210.216 168.332 213.699C166.103 215.047 163.571 216.575 159.916 218.399C153.438 221.401 146.503 223.297 139.399 224.009C135.812 224.421 132.625 226.492 130.792 229.603C128.959 232.714 128.692 236.505 130.07 239.843C125.654 240.314 121.216 240.56 116.775 240.58C75.708 240.58 64.8542 222.819 64.8542 213.429ZM171.012 240.58H140.734C138.032 240.574 135.802 238.464 135.646 235.766C135.49 233.068 137.462 230.716 140.145 230.398C147.993 229.601 155.65 227.491 162.799 224.157C166.682 222.227 169.445 220.545 171.665 219.207C176.119 215.949 181.595 214.401 187.096 214.845C191.223 214.845 196.714 216.167 196.747 227.606C196.752 230.99 195.4 234.235 192.993 236.613C190.453 239.146 187.015 240.572 183.429 240.58H171.012ZM238.566 237.363C238.54 239.162 237.062 240.601 235.262 240.58H222.588C221.612 240.583 220.682 240.167 220.034 239.438C219.459 238.803 219.187 237.952 219.287 237.102C220.873 224.495 226.789 224.495 228.739 224.495H235.262C237.062 224.474 238.54 225.913 238.566 227.712V237.363ZM231.811 193.996C231.656 193.813 231.521 193.639 231.357 193.449C226.352 187.843 220.06 183.537 213.021 180.903C213.859 174.903 218.777 170.305 224.82 169.871C230.863 169.438 236.387 173.287 238.074 179.106C239.76 184.925 237.149 191.131 231.811 193.996Z'
        fill='#3D3D3E'
      ></path>{' '}
      <path
        d='M164.578 192.326C164.578 179.89 154.496 169.808 142.059 169.808C129.623 169.808 119.541 179.89 119.541 192.326C119.541 204.763 129.623 214.844 142.059 214.844C154.49 214.83 164.564 204.757 164.578 192.326ZM125.975 192.326C125.975 183.443 133.176 176.242 142.059 176.242C150.943 176.242 158.144 183.443 158.144 192.326C158.144 201.209 150.943 208.411 142.059 208.411C133.181 208.4 125.986 201.205 125.975 192.326Z'
        fill='#3D3D3E'
      ></path>{' '}
      <path
        d='M87.3724 192.326H93.8062C95.5828 192.326 97.0231 190.886 97.0231 189.109C97.0231 187.333 95.5828 185.892 93.8062 185.892H87.3724C85.5958 185.892 84.1555 187.333 84.1555 189.109C84.1555 190.886 85.5958 192.326 87.3724 192.326Z'
        fill='#3D3D3E'
      ></path>{' '}
      <path
        d='M145.276 192.326C145.276 190.55 143.836 189.109 142.059 189.109H135.626C133.849 189.109 132.409 190.55 132.409 192.326C132.409 194.103 133.849 195.543 135.626 195.543H142.059C143.836 195.543 145.276 194.103 145.276 192.326Z'
        fill='#3D3D3E'
      ></path>{' '}
      <path
        d='M111.669 205.532L107.307 207.713L105.731 206.136C104.469 204.917 102.462 204.935 101.222 206.176C99.9808 207.416 99.9633 209.423 101.182 210.685L104.399 213.902C105.002 214.505 105.821 214.844 106.674 214.845C107.171 214.849 107.663 214.739 108.112 214.523L114.545 211.306C116.135 210.512 116.781 208.579 115.987 206.989C115.192 205.399 113.26 204.754 111.669 205.548V205.532Z'
        fill='#3D3D3E'
      ></path>{' '}
      <path
        d='M136.169 111.881C137.526 115.749 141.178 118.338 145.276 118.338H177.445C182.775 118.338 187.096 114.017 187.096 108.687C187.096 103.357 182.775 99.0364 177.445 99.0364H172.787L183.474 90.4859C186.672 87.9252 187.905 83.6238 186.549 79.7573C185.193 75.8909 181.543 73.3024 177.445 73.3013H145.276C139.946 73.3013 135.626 77.622 135.626 82.9519C135.626 88.2819 139.946 92.6026 145.276 92.6026H149.934L139.248 101.153C136.048 103.713 134.814 108.014 136.169 111.881ZM143.266 106.175L161.113 91.8981C162.179 91.0454 162.591 89.6124 162.141 88.3235C161.69 87.0347 160.474 86.1709 159.109 86.1688H145.276C143.5 86.1688 142.059 84.7286 142.059 82.9519C142.059 81.1753 143.5 79.735 145.276 79.735H177.445C178.812 79.7344 180.03 80.5972 180.482 81.8867C180.935 83.1762 180.523 84.6109 179.456 85.4643L161.609 99.7409C160.542 100.594 160.13 102.027 160.581 103.315C161.032 104.604 162.247 105.468 163.613 105.47H177.445C179.222 105.47 180.662 106.91 180.662 108.687C180.662 110.464 179.222 111.904 177.445 111.904H145.276C143.91 111.905 142.692 111.042 142.239 109.752C141.787 108.463 142.199 107.028 143.266 106.175Z'
        fill='#3D3D3E'
      ></path>{' '}
      <path
        d='M235.349 79.7351H230.691L241.378 71.1846C244.577 68.6239 245.81 64.3225 244.453 60.456C243.097 56.5896 239.447 54.0012 235.349 54H203.18C197.851 54 193.53 58.3208 193.53 63.6507C193.53 68.9806 197.851 73.3013 203.18 73.3013H207.839L197.152 81.8518C193.953 84.4125 192.72 88.714 194.077 92.5804C195.433 96.4469 199.083 99.0353 203.18 99.0364H235.349C240.679 99.0364 245 94.7157 245 89.3858C245 84.0559 240.679 79.7351 235.349 79.7351ZM235.349 92.6027H203.18C201.814 92.6033 200.596 91.7405 200.144 90.451C199.691 89.1615 200.103 87.7269 201.17 86.8734L219.017 72.5968C220.084 71.7441 220.495 70.3111 220.045 69.0223C219.594 67.7335 218.378 66.8696 217.013 66.8676H203.18C201.404 66.8676 199.964 65.4273 199.964 63.6507C199.964 61.874 201.404 60.4338 203.18 60.4338H235.349C236.716 60.4331 237.934 61.296 238.386 62.5855C238.839 63.8749 238.427 65.3096 237.36 66.1631L219.513 80.4396C218.446 81.2923 218.034 82.7254 218.485 84.0142C218.936 85.303 220.151 86.1668 221.517 86.1689H235.349C237.126 86.1689 238.566 87.6091 238.566 89.3858C238.566 91.1624 237.126 92.6027 235.349 92.6027Z'
        fill='#3D3D3E'
      ></path>{' '}
      <circle cx='92.5' cy='158.5' r='62.5' fill='#717171' fillOpacity='0.2'></circle>
    </svg>
  )
}
