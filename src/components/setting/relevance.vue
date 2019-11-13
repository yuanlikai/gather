<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">关联设置</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <p slot="title">
        关联平台
      </p>
      <div style="margin: 0 auto;width: 600px;">
        <Transfer
          :data="data"
          :target-keys="targetKeys"
          :list-style="{
                    width: '250px',
                    height: '300px'
                }"
          :titles="['全部平台','已关联平台']"
          :operations="['取消','关联']"
          :render-format="renders"
          @on-change="handleChange"></Transfer>
      </div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <p slot="title">
        关联品牌
      </p>
      <div style="margin: 0 auto;width: 600px;">
        <Transfer
          :data="data1"
          :target-keys="targetKeys1"
          :list-style="{
                    width: '250px',
                    height: '300px'
                }"
          :titles="['全部品牌','已关联品牌']"
          :operations="['取消','关联']"
          :render-format="renders1"
          @on-change="handleChange1"></Transfer>
      </div>
    </Card>
    <Modal
      v-model="modal5"
      title="提示"
      width="300"
      @on-ok="ok">
      <p>选中平台下的商品将全部{{direction === 'right'?'上架':'下架'}}，是否确认？</p>
    </Modal>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        modal5: false,
        targetKeys: [],
        data: [],
        targetKeys1: [],
        data1: [],
        newTargetKeys: '',
        direction: '',
        moveKeys: ''
      }
    },
    methods: {
      renders(item) {
        return item.label;
      },
      ok() {
        const _this = this;
        _this.Axios.post(_this.direction === 'right' ? '/Manage/Supplier/relevancePlatform' : '/Manage/SkuInfo/cancelRelevancPlatform', {
          supplierId: _this.$route.query.id,
          platFormIds: _this.moveKeys
        }).then(res => {
          if (res.data.code === 0) {
            _this.targetKeys = _this.newTargetKeys;
            _this.$Message.success('成功')
          } else {
            _this.$Message.warning(res.data.message)
          }
        });
      },
      handleChange(newTargetKeys, direction, moveKeys) {
        console.log(moveKeys)
        const _this = this;
        _this.newTargetKeys = newTargetKeys;
        _this.direction = direction;
        _this.moveKeys = moveKeys;
        _this.modal5 = true;
      },
      renders1(item) {
        return item.label;
      },
      handleChange1(newTargetKeys, direction, moveKeys) {
        const _this = this;
        _this.Axios.post(direction === 'right' ? '/Manage/Supplier/relevanceBrand' : '/Manage/Supplier/cancelRelevancBrand', {
          supplierId: _this.$route.query.id,
          brandIds: direction === 'right' ? newTargetKeys : moveKeys
        }).then(res => {
          if (res.data.code === 0) {
            _this.targetKeys1 = newTargetKeys;
            _this.$Message.success('成功')
          } else {
            _this.$Message.warning(res.data.message)
          }
        });
      },


      //获取平台列表
      terraceList() {
        const _this = this;
        _this.Axios.get('/Manage/Platform/list', {
          params: {
            status: true
          }
        }).then(res => {
          for (let i in res.data.data) {
            _this.data.push({
              "key": res.data.data[i].id,
              "label": res.data.data[i].abbrPlatformName,
            })
          }
        })
      },

      //获取已选中平台列表
      terraceList1() {
        const _this = this;
        _this.Axios.get('/Manage/Supplier/suppPlatRelation', {
          params: {
            supplierId: _this.$route.query.id
          }
        }).then(res => {
          for (let i in res.data.data) {
            _this.targetKeys.push(res.data.data[i].id)
          }
        })
      },

      //获取品牌列表
      brandList() {
        const _this = this;
        _this.Axios.get('/Manage/Brand/list').then(res => {
          console.log(res.data)
          for (let i in res.data.data) {
            _this.data1.push({
              "key": res.data.data[i].id,
              "label": res.data.data[i].abbrBrandName,
            })
          }
        })
      },

      //获取已选中品牌列表
      brandList1() {
        const _this = this;
        _this.Axios.get('/Manage/Brand/suppBrandRelation', {
          params: {
            supplierId: _this.$route.query.id
          }
        }).then(res => {
          _this.targetKeys1 = [];
          for (let i in res.data.data) {
            _this.targetKeys1.push(res.data.data[i].id)
          }
        })
      }
    },
    mounted() {
      this.terraceList();
      this.terraceList1();
      this.brandList();
      this.brandList1()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .ivu-btn-small {
    padding: 1px 7px 3px;
  }
</style>
