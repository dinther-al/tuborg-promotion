export const getFieldNameAddress = (name: 'thanhpho' | 'quanhuyen' | 'xaphuong' | string) => {
  switch (name) {
    case 'thanhpho':
      return 'province'
    case 'quanhuyen':
      return 'district'
    case 'xaphuong':
      return 'ward'
    default:
      return name
  }
}

export const isAddressField = (name: 'thanhpho' | 'quanhuyen' | 'xaphuong' | string) => {
  return name == 'thanhpho' || name == 'quanhuyen' || name == 'xaphuong' || name == 'address'
}

export const initAddress = [
  {
    name: 'Hà Nội',
    slug: 'ha-noi',
    rootType: 'thanhpho',
    type: 'thanh-pho',
    nameWithType: 'Thành phố Hà Nội',
    code: '01',
    id: '63ec8f475614053637a65a16',
    parentCode: null
  },
  {
    name: 'Hồ Chí Minh',
    slug: 'ho-chi-minh',
    rootType: 'thanhpho',
    type: 'thanh-pho',
    nameWithType: 'Thành phố Hồ Chí Minh',
    code: '79',
    id: '63ec8f475614053637a67e56',
    parentCode: null
  }
]

export const dataHeader = [
  { key: 'province', title: 'Tỉnh/Thành Phố', subTitle: 'thanhpho' },
  { key: 'district', title: 'Quận/Huyện', subTitle: 'quanhuyen' },
  { key: 'ward', title: 'Phường/Xã', subTitle: 'xaphuong' }
]
