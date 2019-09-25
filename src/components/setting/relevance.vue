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
          :titles="['全部平台','已关联平台']"
          :operations="['取消','关联']"
          :render-format="renders1"
          @on-change="handleChange1"></Transfer>
      </div>
    </Card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        targetKeys: [],
        data: [],
        targetKeys1: [],
        data1: []
      }
    },
    methods: {
      renders(item) {
        return item.label;
      },
      handleChange(newTargetKeys, direction, moveKeys) {
        const _this = this;
        _this.Axios.post(direction === 'right' ? '/Manage/Supplier/relevancePlatform' : '/Manage/Supplier/cancelRelevancPlatform', {
          supplierId: _this.$route.query.id,
          platFormIds: direction === 'right' ? newTargetKeys : moveKeys
        }).then(res => {
          if (res.data.code === 0) {
            _this.$Message.success('成功')
          } else {
            _this.$Message.warning(res.data.message)
          }
        });
        this.targetKeys = newTargetKeys;
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
            _this.$Message.success('成功')
          } else {
            _this.$Message.warning(res.data.message)
          }
        });
        this.targetKeys1 = newTargetKeys;
      },


      //获取平台列表
      terraceList() {
        const _this = this;
        _this.Axios.get('/Manage/Platform/pageList', {
          params: {
            status: true
          }
        }).then(res => {
          for (let i in res.data.data.content) {
            _this.data.push({
              "key": res.data.data.content[i].id,
              "label": res.data.data.content[i].abbrPlatformName,
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
          console.log(res.data)
          for (let i in res.data.data) {
            _this.targetKeys.push(res.data.data[i].id)
          }
        })
      },

      //获取品牌列表
      brandList() {
        const _this = this;
        _this.Axios.get('/Manage/Brand/pageList').then(res => {
          for (let i in res.data.data.content) {
            _this.data1.push({
              "key": res.data.data.content[i].id,
              "label": res.data.data.content[i].abbrBrandName,
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
          _this.targetKeys1=[];
          for (let i in res.data.data) {
            _this.targetKeys1.push(res.data.data[i].id)
          }
        })
      }
    },
    mounted() {
      console.log(this.targetKeys)
      this.terraceList();
      this.terraceList1();
      this.brandList();
      this.brandList1()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .ivu-btn-small {
    padding: 1px 7px 3px;
  }
</style>
