<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">商品上架</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <p slot="title" style="text-align: left">
        选择商品
      </p>
      <div style="margin: 0 auto;width: 600px;">
        <Steps :current="current" style="margin: 16px 0 32px 0">
          <Step title="选择商品" style="width: 70%;"></Step>
          <Step title="填写销售信息" style="width: 30%;"></Step>
        </Steps>

        <Transfer
          :data="data"
          :target-keys="targetKeys1"
          :list-style="{
                    width: '250px',
                    height: '400px',
                    margin:'80px 0',
                    textAlign: 'left'
                }"
          :render-format="render1"
          @on-change="handleChange1"></Transfer>
      </div>
    </Card>
    {{data1}}
  </div>
</template>
<script>
  export default {
    data () {
      return {
        current:0,
        data:[],
        data1: [{
          "key": "1",
          "label": "Content 1",
          "description": "The desc of content 1",
          "disabled": false
        }, {
          "key": "2",
          "label": "Content 2",
          "description": "The desc of content 2",
          "disabled": false
        }, {
          "key": "3",
          "label": "Content 3",
          "description": "The desc of content 3",
          "disabled": false
        }, {
          "key": "4",
          "label": "Content 4",
          "description": "The desc of content 4",
          "disabled": true
        }, {
          "key": "5",
          "label": "Content 5",
          "description": "The desc of content 5",
          "disabled": false
        }, {
          "key": "6",
          "label": "Content 6",
          "description": "The desc of content 6",
          "disabled": false
        }, {
          "key": "7",
          "label": "Content 7",
          "description": "The desc of content 7",
          "disabled": true
        }, {
          "key": "8",
          "label": "Content 8",
          "description": "The desc of content 8",
          "disabled": false
        }, {
          "key": "9",
          "label": "Content 9",
          "description": "The desc of content 9",
          "disabled": true
        }, {
          "key": "10",
          "label": "Content 10",
          "description": "The desc of content 10",
          "disabled": false
        }, {
          "key": "11",
          "label": "Content 11",
          "description": "The desc of content 11",
          "disabled": false
        }, {
          "key": "12",
          "label": "Content 12",
          "description": "The desc of content 12",
          "disabled": false
        }, {
          "key": "13",
          "label": "Content 13",
          "description": "The desc of content 13",
          "disabled": true
        }, {
          "key": "14",
          "label": "Content 14",
          "description": "The desc of content 14",
          "disabled": true
        }, {
          "key": "15",
          "label": "Content 15",
          "description": "The desc of content 15",
          "disabled": false
        }, {
          "key": "16",
          "label": "Content 16",
          "description": "The desc of content 16",
          "disabled": true
        }, {
          "key": "17",
          "label": "Content 17",
          "description": "The desc of content 17",
          "disabled": true
        }, {
          "key": "18",
          "label": "Content 18",
          "description": "The desc of content 18",
          "disabled": false
        }, {
          "key": "19",
          "label": "Content 19",
          "description": "The desc of content 19",
          "disabled": true
        }, {
          "key": "20",
          "label": "Content 20",
          "description": "The desc of content 20",
          "disabled": true
        }],
        targetKeys1: this.getTargetKeys()
      }
    },
    methods: {
      getMockData () {
        let mockData = [];
        for (let i = 1; i <= 20; i++) {
          mockData.push({
            key: i.toString(),
            label: 'Content ' + i,
            description: 'The desc of content  ' + i,
            disabled: Math.random() * 3 < 1
          });
        }
        return mockData;
      },
      getTargetKeys () {
        return this.getMockData()
          .filter(() => Math.random() * 2 > 1)
          .map(item => item.key);
      },
      render1 (item) {
        return item.label;
      },
      handleChange1 (newTargetKeys, direction, moveKeys) {
        // console.log(newTargetKeys);
        // console.log(direction);
        // console.log(moveKeys);
        this.targetKeys1 = newTargetKeys;
      },

      //获取可上架产品列表
      dataList(){
        const _this = this;
        _this.Axios.get('/Manage/SkuInfo/readyOnsalePageList',{
          params:{
            skuInfoNameLike:'',    //商品名模糊搜索
            skuInfoNoLike:'',    //商品编号模糊搜索
            category1:'',    //分类1
            category2:'',    //分类2
            category3:'',    //分类3
            brandId:'',    //品牌id
            seed:true,    //true为未上架商品
          }
        }).then(res=>{

          for(let i in res.data.data.content){
            _this.data.push({
              "key": res.data.data.content[i].id,
              "label": res.data.data.content[i].skuInfoName+"!!!"+res.data.data.content[i].abbrPlatformNames,
            })
          }
          console.log(_this.data)
          console.log(res.data.data.content)
        })
      }
    },
    mounted(){
      this.dataList();
      console.log(123)
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
