<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="模板下载">
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="'/static/category.xlsx'">点击下载模版</a>
        </el-tag>

      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :headers="myHeaders"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :before-upload="beforeUpload"
          :limit="1"
          :action="BASE_API+'/service/category/import'"
          name="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">{{ fileUploadBtnText }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
const token = getToken()

export default {
  data() {
    return {
      BASE_API: process.env.BASE_API, // 接口API地址
      OSS_PATH: process.env.OSS_PATH, // 阿里云OSS地址
      fileUploadBtnText: '上传', // 按钮文字
      myHeaders: { Authorization: token },
      importBtnDisabled: false, // 按钮是否禁用,
      loading: false
    }
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit()
    },

    beforeUpload(file) {
      console.log(file)
      if (!file) {
        this.$message({
          type: 'warning',
          message: '请选择文件'
        })
        this.fileUploadBtnText = '上传'
        this.importBtnDisabled = false
        this.loading = false
      } else {
        this.fileUploadBtnText = '正在上传'
        this.importBtnDisabled = true
        this.loading = true
      }
    },

    // 上传成功
    fileUploadSuccess(response) {
      // 提示信息
      this.loading = false
      this.$message({
        type: 'success',
        message: '导入文件成功'
      })
      // 跳转到课程分类列表中去
      // 路由跳转
      this.$router.push({ path: '/subject/list' })
    },

    // 上传失败
    fileUploadError() {
      this.loading = false
      this.$message({
        type: 'error',
        message: '导入文件失败'
      })
    }
  }

}
</script>
