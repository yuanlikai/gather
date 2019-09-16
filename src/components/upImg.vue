<template>
  <div class="content">
    <div class="demo-upload-list" v-for="item in uploadList">
      <template v-if="item.status === 'finished'">
        <img :src="item.filename">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.filename)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
      ref="upload"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png']"
      :max-size="20480"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      multiple
      :data="{
        callback:policyData.callback,
        policy:policyData.policy,
        signature:policyData.signature,
        key:policyData.key,
        ossaccessKeyId:policyData.accessKeyId,
        dir:policyData.dir,
        host:'http://ylmanager.oss-cn-shanghai.aliyuncs.com',
        success_action_status:'200',
      }"
      type="drag"
      action="/img"
      style="display: inline-block;width:58px;">
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal title="View Image" v-model="visible" width="300">
      <img :src="imgName" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
  import uuidv1 from 'uuid/v1';

  export default {
    data() {
      return {
        policyData: {},
        defaultList: [{
          "filename": "http://ylmanager.oss-cn-shanghai.aliyuncs.com/Image/20190916/5e0fe2c0-d830-11e9-a215-714f93aad73b"
        }],
        imgName: '',
        visible: false,
        uploadList: []
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
      handleSuccess(res, file) {
        file.filename = file.response.data.filename;
        file.name = file.response.data.filename;
        console.log(this.uploadList)
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
          desc: 'File  ' + file.name + ' is too large, no more than 20M.'
        });
      },
      handleBeforeUpload() {
        const check = this.uploadList.length < 1;
        if (!check) {
          this.$Notice.warning({
            title: 'Up to five pictures can be uploaded.'
          });
        }
        return check;
      },
      upload() {
        setTimeout(() => {
          this.uploadList = this.$refs.upload.fileList;
        }, 300)
      },

      //获取上传权限
      policy() {
        const _this = this;
        _this.Axios.get('/aliyun/oss/policy').then(res => {
          _this.policyData = res.data.data;
          _this.policyData.key = _this.policyData.dir + `/${uuidv1()}`
          console.log(_this.policyData)
        })
      }

    },
    mounted() {
      this.upload();
      this.policy();
    }
  }
</script>
<style>
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
    width: 100%;
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
