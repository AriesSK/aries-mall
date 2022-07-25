<template>
  <div class="address-box">
    <s-header :title="'地址管理'" :back="'/user'"></s-header>
    <div class="address-item">
      <!-- v-model 当前选中的地址 id，list 地址列表，default-tag-text 默认地址标签文字，add 事件点击新增按钮触发，edit 事件点击编辑按钮触发，select 切换选中地址触发 -->
      <!-- 如果从订单跳转过来需要选择地址，而从我的主页跳转过来则不需要 -->
      <van-address-list v-if="from != 'mine'" v-model="chosenAddressId" :list="list" default-tag-text="默认" @add="onAdd" @edit="onEdit" @select="select"/>
      <van-address-list v-else v-model="chosenAddressId" :list="list" default-tag-text="默认" @add="onAdd" @edit="onEdit"/>
    </div>
  </div>
</template>

<script>
  import { Toast } from "vant"
  import sHeader from '@/components/SimpleHeader'
  import { getAddressList } from "@/service/address"
  export default {
    components: {
      sHeader
    },
    data() {
      return {
        chosenAddressId: '1',
        list: [],
        from: this.$route.query.from
      }
    },
    async mounted() {
      const { data } = await getAddressList()
      this.list = data.map(item => {
        return {
          id: item.addressId,
          name: item.userName,
          tel: item.userPhone,
          address: `${item.provinceName} ${item.cityName} ${item.regionName} ${item.detailAddress}`,
          isDefault: item.defaultFlag
        }
      })
    },
    methods: {
      onAdd() {
        this.$router.push({ path: `address-edit?type=add&from=${this.from}` })
      },
      onEdit(item, index) {
        this.$router.push({ path: `address-edit?type=edit&addressId=${item.id}&from=${this.from}` })
      },
      // 这里把 select 事件设置为点击地址跳转至订单界面并使用该地址
      select(item, index) {
        this.$router.push({ path: `create-order?addressId=${item.id}&from=${this.from}` })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .address-box {
    .van-radio__icon {
      // 不显示单选框的选中图标
      display: none;
    }
    .address-item {
      margin-top: 44px;
      .van-button {
        background: @primary;
        border-color: @primary;
      }
    }
  }
</style>