<template>
  <Upload
    action="/Upload/SupplierAdmin/UploadExpressLog.aspx"
    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
    :format="['xls','xlsx']"
    :show-upload-list="false"
    :on-success="uploadsuccess">
    <Button  type="dashed" icon="ios-cloud-upload-outline">批量发货</Button>
  </Upload>
</template>
<script>
  export default {
    methods: {
      uploadsuccess(res, file, fileList) {
        if (res.msg !== '') {
          this.$Message.success('文件上传成功！')
        } else {
          this.$Message.error('文件上传失败')
        }
      },
    }
  }
</script>
