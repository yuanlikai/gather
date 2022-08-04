<template>
  <div class="content">
    <div v-for="(item,index) in uploadList" class="demo-upload-list-box">
      <div class="demo-upload-list">
        <template v-if="item.status === 'finished'">
          <img :src="item.filename+'?x-oss-process=image/resize,m_pad,h_100,w_100,color_FFFFFF'">
          <div class="demo-upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item.filename)"></Icon>
            <Icon v-show="!$route.query.examineId" type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
          </div>
        </template>
        <template v-else>
          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
      </div>
      <br>
      <span class="demo-upload-list-box-index">{{index+1}}</span>
    </div>
    <Upload
      ref="upload"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png']"
      :max-size="1024"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :multiple="true"
      :data="data"
      type="drag"
      action="https://ylmanager.oss-cn-shanghai.aliyuncs.com"
      style="display: inline-block;width:58px;" v-show="!$route.query.examineId">
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal title="View Image" v-model="visible" width="300">
      <img :src="imgName" v-if="visible" style="width: 100%">
      <div slot="footer">
        <Button type="primary" size="large" @click="visible=!visible">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import uuid from 'uuid';

  export default {
    props: ['num'],
    data() {
      return {
        data: {
          callback: '',
          policy: '',
          signature: '',
          key: '',
          ossaccessKeyId: '',
          dir: '',
          host: 'http://ylmanager.oss-cn-shanghai.aliyuncs.com',
          success_action_status: '200',
        },
        defaultList: [],
        imgName: '',
        visible: false,
        uploadList: [],
        index: 1,
        dir: '',
      }
    },
    methods: {
      handleView(name) {
        this.imgName = name;
        this.visible = true;
      },
      handleRemove(file) {
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      },
      handleRemove1(file) {
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(0, this.uploadList.length);
      },
      handleSuccess(res, file) {
        file.filename = file.response.data.filename;
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        });
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: '图片大小不能超过1MB'
        });
      },
      handleBeforeUpload() {
        this.data.key = this.dir + `/${uuid.v4()}`;
        let num = this.num ? this.num : 1;
        const check = this.uploadList.length < num;
        if (!check) {
          this.$Notice.warning({
            title: '最多只能上传' + num + '张图片'
          });
        }
        return check;
      },
      upload() {
        setTimeout(() => {
          this.uploadList = this.$refs.upload.fileList;
        }, 800)
      },

      key() {
        return this.policyData.dir + `/${uuid.v4()}`
      },

      //获取上传权限
      policy() {
        const _this = this;
        _this.Axios.get('/aliyun/oss/policy').then(res => {
          _this.dir = res.data.data.dir;
          _this.data.callback = res.data.data.callback;
          _this.data.policy = res.data.data.policy;
          _this.data.signature = res.data.data.signature;
          _this.data.key = res.data.data.dir + `/${uuid.v4()}`;
          _this.data.ossaccessKeyId = res.data.data.accessKeyId;
          _this.data.dir = res.data.data.dir;
          console.log(_this.data)
        })
      }

    },
    mounted() {
      this.uploadList = this.$refs.upload.fileList;
      this.upload();
      this.policy();
      const _this = this;
      setInterval(function () {
        _this.policy()
      }, 180000)
    }
  }
</script>
<style>
  .demo-upload-list-box{
    float: left;
  }
  .demo-upload-list-box-index {
    float: left;
    width: 100%;
    line-height: 20px;
    color: red;
    font-weight: 700;
    font-size: 14px;
    text-align: center;
  }
  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
