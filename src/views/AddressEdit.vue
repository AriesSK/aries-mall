<template>
  <div class="address-edit-box">
    <s-header :title="`${type == 'add' ? '新增地址' : '编辑地址'}`"></s-header>
    <!-- area-list 地区列表，address-info 收货人信息初始值(add 时为空)，show-delete 是否显示删除按钮，show-set-default 是否显示默认地址栏，show-search-result 是否显示搜索结果，search-result 详细地址搜索结果，area-columns-placeholder 地区选择列展位提示文字，save 事件点击保存按钮触发，delete 事件确认删除地址触发 -->
    <van-address-edit class="edit" :area-list="areaList" :address-info="addressInfo" :show-delete="type == 'edit'" show-set-default show-search-result :search-result="searchResult" :area-columns-placeholder="['请选择', '请选择', '请选择']" @save="onSave" @delete="onDelete"/>
  </div>
</template>

<script>
  import { Toast } from "vant"
  import sHeader from '@/components/SimpleHeader'
  import { addAddress, EditAddress, DeleteAddress, getAddressDetail } from "@/service/address"
  import { tdist } from '@/common/js/utils'
  export default {
    components: {
      sHeader
    },
    data() {
      return {
        // van-address-edit 组件只接能收一个变量 areaList，所以需要将省市区列表放入其中，构造成可以渲染的格式
        areaList: {
          province_list: {},
          city_list: {},
          county_list: {}
        },
        searchResult: [],
        type: 'add',
        addressId: '',
        addressInfo: {},
        from: ''
      }
    },
    async mounted() {
      // 构造省市区的列表
      let _province_list = {}
      let _city_list = {}
      let _country_list = {}
      tdist.getLev1().forEach(p => {
        // 设置 id 和 text 的键值对
        _province_list[p.id] = p.text
        tdist.getLev2(p.id).forEach(c => {
          _city_list[c.id] = c.text
          tdist.getLev3(c.id).forEach(q => _country_list[q.id] = q.text)
        })
      })
      this.areaList.province_list = _province_list
      this.areaList.city_list = _city_list
      this.areaList.county_list = _country_list

      const { addressId, type, from } = this.$route.query
      this.addressId = addressId
      this.type = type
      this.from = from
      // 如果是编辑地址，根据传来的 addressId 获取地址详情，然后实现编辑
      if (type == 'edit') {
        const { data: addressDetail } = await getAddressDetail(addressId)
        let _areaCode = ''
        const province = tdist.getLev1()
        // Object.entries 返回一个给定对象自身可枚举属性的键值对数组
        Object.entries(this.areaList.county_list).forEach(([id, text]) => {
          // 找到当前的区的名字
          if (text == addressDetail.regionName) {
            // 找到当前区对应的省，Array.findIndex 查找指定元素并返回下标
            const provinceIndex = province.findIndex(item => item.id.substr(0, 2) == id.substr(0, 2))
            // 找到当前区对应的市区
            const cityItem = Object.entries(this.areaList.city_list).filter(([cityId, cityName]) => cityId.substr(0, 4) == id.substr(0, 4))[0]
            // 由于区的名字不是唯一的，因此检查区对应的省市名与地址详情中的是否一致，一致则成功获取了区的 id
            if (province[provinceIndex].text == addressDetail.provinceName && cityItem[1] == addressDetail.cityName) {
              _areaCode = id
            }
          }
        })
        // 赋值地址详情信息
        this.addressInfo = {
          id: addressDetail.addressId,
          name: addressDetail.userName,
          tel: addressDetail.userPhone,
          province: addressDetail.provinceName,
          city: addressDetail.cityName,
          county: addressDetail.regionName,
          addressDetail: addressDetail.detailAddress,
          areaCode: _areaCode,
          isDefault: !!addressDetail.defaultFlag // 使用两个 !! 将 1(0) 转化为 true(false)
        }
      }
    },
    methods: {
      // content 是 save 是啊金的回调函数，包含表单的内容
      async onSave(content) {
        const params = {
          userName: content.name,
          userPhone: content.tel,
          provinceName: content.province,
          cityName: content.city,
          regionName: content.county,
          detailAddress: content.addressDetail,
          defaultFlag: !!content.isDefault ? 1 : 0,
        }
        if (this.type == 'edit') {
          params['addressId'] = this.addressId
        }
        const { message } = await this.type == 'add' ? addAddress(params) : EditAddress(params)
        Toast('保存成功')
        setTimeout(() => {
          this.$router.push({ path: `address?from=${this.from}`})
        }, 1000)
      },
      async onDelete() {
        const { data } = await DeleteAddress(this.addressId)
        Toast('删除成功')
        setTimeout(() => {
          this.$router.push({ path: 'address' })
        }, 1000)
      }
    }
  }
</script>

<style lang="less">
  @import '../common/style/mixin';
  .address-edit-box {
    margin-top: 44px;
    .van-address-edit {
      .van-button--danger {
        background: @primary;
        border-color: @primary;
      }
      .van-switch--on {
        background: @primary;
      }
    }
  }
</style>