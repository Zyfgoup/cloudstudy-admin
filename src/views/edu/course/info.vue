<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布"/>
    </el-steps>

    <el-form :rules="rules" label-width="120px" :model='this.courseInfo'>

      <el-form-item label="课程标题" prop="title">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别" prop="category">
        <el-select
          v-model="courseInfo.categoryParentId"
          placeholder="请选择"
          @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectNestedList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.categoryId" placeholder="请选择">
          <el-option
            v-for="subject in subSubjectList"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师" prop="teacher">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时" prop="lesNum">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->
      <!-- 课程简介-->
      <el-form-item label="课程简介" prop="description">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面 TODO -->
      <!-- 课程封面-->
      <el-form-item label="课程封面" >

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :headers="myHeaders"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/user/user/avatar/upload'"
          class="avatar-uploader">
          <img :src="courseInfo.cover" width="600px" height="480px">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格" prop="price">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import course from '@/api/edu/course.js'
import subject from '@/api/edu/subject.js'
import teacher from '@/api/edu/teacher.js'
import Tinymce from '@/components/Tinymce'
import { getToken } from '@/utils/auth'
const token = getToken()

const eduCourse = {
  title: '',
  categoryId: '', // 课程二级分类
  teacherId: '',
  lessonNum: 0,
  cover: 'https://cloudstudy-avatar.oss-cn-hangzhou.aliyuncs.com/avatar/2021/02/26/ec72ffef-137f-4439-92fe-af0569efde2f.png',
  price: 0,
  categoryParentId: '', // 课程一级分类
  description: ''
}

export default {
  components: { Tinymce },
  data() {
    return {
      myHeaders: { Authorization: token },
      courseInfo: eduCourse,
      saveBtnDisabled: false, // 保存按钮是否禁用
      subjectNestedList: [], // 一级分类列表
      subSubjectList: [], // 二级分类列表
      teacherList: [], // 讲师列表
      BASE_API: process.env.BASE_API,// 接口API地址
      rules: {
        title: [
          { required: true, message: '请输入课程标题', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        teacher: [
          { required: true, message: '请选择讲师', trigger: 'blur' }
        ],
        lesnum: [
          { required: true, message: '课时不能为空'},
          { type: 'number', message: '课时必须为数字值'}
        ],
        description: [
          { required: true, message: '请输入简介', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '价格不能为空' },
          { type: 'number', message: '价格必须为数字' }
        ]
      }
    }
  },
  // 当路由发生变化的时候，我们应该有一个监听，监听获取参数
  watch: {
    $route(to, from) {
      console.log('watch $route')
      this.init()
    }
  },
  created() {
    console.log('info created')
    // 初始化
    this.init()
  },

  methods: {
    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        console.log(id)
        // 根据id获取课程基本信息
        this.getCourseInfoById(id)
      } else {
        this.courseInfo = eduCourse
        this.initSubjectList()
        // 获取讲师列表
        this.initTeacherList()
      }
    },
    getCourseInfoById(id) {
      course.getCourseInfoById(id)
        .then(response => {
          this.courseInfo = response.data.data
          console.log(this.courseInfo)
          // 初始化课程分类列表
          subject.getNestedTreeList().then(responseSubject => {
            this.subjectNestedList = responseSubject.data.data
            for (let i = 0; i < this.subjectNestedList.length; i++) {
              if (this.subjectNestedList[i].id === this.courseInfo.categoryParentId) {
                this.subSubjectList = this.subjectNestedList[i].children
              }
            }
          })

          // 获取讲师列表
          this.initTeacherList()
        }).catch((response) => {
          this.$message({
            type: 'error',
            message: response.message
          })
        })
    },
    initTeacherList() {
      teacher.getList()
        .then(response => {
          this.teacherList = response.data.data
        })
    },
    initSubjectList() {
      subject.getNestedTreeList()
        .then(response => {
          this.subjectNestedList = response.data.data
        })
    },
    subjectLevelOneChanged(value) {
      console.log(value)
      for (let i = 0; i < this.subjectNestedList.length; i++) {
        if (this.subjectNestedList[i].id === value) {
          this.subSubjectList = this.subjectNestedList[i].children
          this.courseInfo.categoryId = ''
        }
      }
    },
    // 上传封面后成功回调的方法
    handleAvatarSuccess(res, file) {
      console.log(res)// 上传响应
      console.log(URL.createObjectURL(file.raw))// base64编码
      this.courseInfo.cover = res.data
    },
    // 上传封面之前校验方法
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 根据课程ID判断是保存还是修改
    next() {
      console.log('next')
      if (!this.courseInfo.id) {
        this.saveVo()
      } else {
        this.updateVo()
      }
    },
    saveVo() {
      course.saveCourseInfo(this.courseInfo)
        .then(response => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.$router.push({ path: '/course/chapter/' + response.data.data })
        })
        .catch(response => {
          this.$message({
            type: 'error',
            message: '保存失败'
          })
        })
    },
    updateVo() {
      course.updateCourseInfo(this.courseInfo)
        .then(response => {
          this.$message({
            type: 'success',
            message: '更新成功'
          })
          this.$router.push({ path: '/course/chapter/' + this.courseInfo.id })
        })
        .catch(response => {
          this.$message({
            type: 'error',
            message: '更新失败'
          })
        })
    }
  }
}
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
