<template>
  <div class="app-container">
    <Modal
      v-model="modal"
      title="客服处理">
      <div style="max-height: 600px;overflow: auto">
        <Button type="primary" style="margin-bottom: 20px" @click="add()">添加处理</Button>
        <Timeline v-if="ServiceList.length>0">
          <TimelineItem v-for="(item,index) in ServiceList" :key="index">
            <p class="time">{{item.AddTime}}</p>
            <p class="content">
              <span style="font-weight: 700">客户诉求：</span>
              <span style="flex: 1">{{item.CustomerReq}}</span>
            </p>
            <p class="content">
              <span style="font-weight: 700">客服备注：</span>
              <span style="flex: 1">{{item.Remarks}}</span>
            </p>
            <p class="content" v-if="item.Img">
              <span style="font-weight: 700">图片：</span>
              <img v-for="(itema,indexa) in item.Img.split(',')"
                   :key="indexa" :src="itema" alt=""
                   style="width: 50px; height: 50px;margin-right: 8px;cursor: pointer" @click="showImg(itema)">
            </p>
            <p class="content" v-if="item.FileStr">
              <span style="font-weight: 700">文件：</span>
              <a v-for="(itema,indexa) in item.FileStr.split(',')"
                 style="margin-right: 10px"
                 :key="indexa" :href="itema">文件{{indexa+1}}</a>
            </p>
          </TimelineItem>
        </Timeline>
        <p v-else style="text-align: center">暂无处理信息</p>
      </div>
      <div slot="footer">
        <Button type="primary" @click="modal=false">关闭</Button>
      </div>
    </Modal>
    <Modal title="图片" v-model="visible">
      <img :src="img" style="width: 100%">
    </Modal>
    <Modal
      v-model="modal1"
      title="添加客服处理">
      <div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="客户诉求" prop="CustomerReq">
            <Input v-model="formValidate.CustomerReq" type="textarea" :rows="3"/>
          </FormItem>
          <FormItem label="客服备注" prop="Remarks">
            <Input v-model="formValidate.Remarks" type="textarea" :rows="3"/>
          </FormItem>
          <FormItem label="上传图片">
            <upImg ref="service" :num="5"></upImg>
          </FormItem>
          <FormItem label="上传文件">
            <Upload
              ref="upload"
              action="/ShangchuanWj.aspx"
              :on-success="handleSuccess"
            >
              <Button type="primary" style="width: 408px" ghost icon="ios-cloud-upload-outline">点击上传文件
              </Button>
            </Upload>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="modal1=false" style="margin-left: 8px">取消</Button>
        <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import upImg from '@/components//upImg'
  
  export default {
    components: {upImg},
    data() {
      return {
        ServiceList: [],
        img: '',
        item: {},
        visible: false,
        modal: false,
        modal1: false,
        formValidate: {
          Remarks: '',
          CustomerReq: ''
        },
        ruleValidate: {
          Remarks: [
            {required: true, message: '请输入客服备注', trigger: 'change'}
          ],
          CustomerReq: [
            {required: true, message: '请输入客户诉求', trigger: 'change'}
          ],
        }
      }
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let service = this.$refs.service.uploadList
            let serviceList = []
            if (service.length > 0) {
              for (let i = 0; i < service.length; i++) {
                serviceList.push(service[i].response.msg)
              }
            }
            let upload = this.$refs.upload.fileList
            let uploadList = []
            if (upload.length > 0) {
              for (let i = 0; i < upload.length; i++) {
                uploadList.push(upload[i].response.msg)
              }
            }
            let formValidate = this.formValidate
            formValidate.Img = serviceList.join(',')
            formValidate.FileStr = uploadList.join(',')
            console.log(this.item.Id)
            formValidate.OrderId = this.item.ID
            console.log(formValidate)
            this.Axios.post('/OperService.ashx', formValidate).then(res => {
              if (res.data.error === 0) {
                this.modal1 = false
                this.$Notice.success({
                  name: 'alert',
                  title: '添加成功'
                });
                this.getServiceList(this.item.ID)
              } else {
                this.$Message.error(res.data.errorMsg)
              }
            })
            console.log(this.formValidate)
          }
        })
      },
      handleReset(name) {
        this.$refs.upload.fileList = [];
        this.$refs.service.handleRemove1();
        this.$refs[name].resetFields();
      },
      handleSuccess(res, file) {
        this.$refs.upload.fileList = this.$refs.upload.fileList.splice(-3)
      },
      
      add() {
        this.modal1 = true
        this.handleReset('formValidate')
      },
      info(item) {
        this.item = item
        this.ServiceList = []
        this.modal = true
        this.getServiceList(this.item.ID)
      },
      getServiceList(id) {
        this.Axios.post('/GetServiceList.ashx', {
          OrderId: id
        }).then(res => {
          if (res.data.error === 0) {
            this.ServiceList = res.data.data
          } else {
            this.$Message.error(res.data.errorMsg)
          }
        })
      },
      showImg(img) {
        this.img = img
        this.visible = true
      }
    },
    mounted() {
    
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .time {
    font-weight: 700;
  }
  
  .content {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
  }
</style>
