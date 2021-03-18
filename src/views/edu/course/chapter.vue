<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布"/>
    </el-steps>

    <el-button type="text" @click="addChapter()">添加章节</el-button>

    <!-- 章节 -->
    <ul class="chanpterList">
      <li
        v-for="chapter in chapterNestedList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}

          <span class="acts">
            <el-button type="text" @click="addVideo(chapter.id)">添加课时</el-button>
            <el-button type="text" @click="editChapter(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" :before-close="cancelSaveVideo" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :headers="myHeaders"
            :action="BASE_API+'/vod/video/upload'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false;cancelSaveVideo()">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'
import vod from '@/api/edu/vod'
import { getToken } from '@/utils/auth'
const token = getToken()

export default {
  data() {
    return {
      isAddVideo: true,
      myHeaders: { Authorization: token },
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: '', // 所属课程
      chapterNestedList: [], // 章节嵌套视频列表
      dialogChapterFormVisible: false, // 是否显示章节表单
      chapter: {// 章节对象
        title: '',
        courseId: '',
        sort: 0
      },
      emptyChapter: {
        title: '',
        courseId: '',
        sort: 0
      },
      saveVideoBtnDisabled: false, // 课时按钮是否禁用
      dialogVideoFormVisible: false, // 是否显示课时表单
      chapterId: '', // 课时所在的章节id
      video: {// 课时对象
        title: '',
        sort: 0,
        isFree: 0,
        chapterId: '',
        courseId: '',

        // 没钱使用视频点播测试的时候哦默认有视频
        videoSourceId: '',
        videoOriginalName: ''

      },
      emptyVideo: {// 空课时对象
        title: '',
        sort: 0,
        isFree: 0,
        chapterId: '',
        courseId: '',
        // 没钱使用视频点播测试的时候哦默认有视频
        videoSourceId: '',
        videoOriginalName: ''

      },
      fileList: [],
      BASE_API: process.env.BASE_API

    }
  },

  created() {
    console.log('chapter created')
    this.init()
  },

  methods: {

    addChapter() {
      this.dialogChapterFormVisible = true
      this.chapter = this.emptyChapter
    },

    // 添加课时
    addVideo(cId) {
      this.dialogVideoFormVisible = true
      this.video = this.emptyVideo
      this.chapterId = cId
      this.isAddVideo = true;
    },

    init() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        // 根据id获取课程基本信息
        this.getChapterAndVideoByCourseId(this.courseId)
      }
    },

    saveOrUpdate() {
      // 判断保存还是修改
      if (this.chapter.id) {
        this.updateChapter()
      } else {
        this.saveChapter()
      }
    },

    saveChapter() {
      this.chapter.courseId = this.courseId
      chapter.save(this.chapter)
        .then(response => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.helpSave()
        })
    },

    updateChapter() {
      chapter.updateById(this.chapter)
        .then(response => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.helpSave()
        })
    },

    editChapter(chapterId) {
      this.dialogChapterFormVisible = true
      chapter.getChapterById(chapterId)
        .then(response => {
          this.chapter = response.data.data
        })
    },

    removeChapter(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return chapter.removeById(id)
      }).then(() => {
        this.getChapterAndVideoByCourseId(this.courseId)// 刷新列表
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((response) => { // 失败
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },

    saveOrUpdateVideo() {
      // 要等视频上传完成
      if (!this.video.videoSourceId) {
        this.$message({
          type: 'error',
          message: '请等待视频上传完成!'
        })
      } else {
        this.saveVideoBtnDisabled = true
        if (this.video.id) {
          this.updateDataVideo()
        } else {
          this.saveDataVideo()
        }
      }
    },

    saveDataVideo() {
      this.video.courseId = this.courseId
      this.video.chapterId = this.chapterId
      video.saveVideo(this.video)
        .then(response => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.helpSaveVideo()
        })
        .catch(() => {
          this.helpSaveVideo()
        })
    },

    editVideo(videoId) {
      this.dialogVideoFormVisible = true
      this.isAddVideo = false;
      video.getVideoById(videoId)
        .then(response => {
          this.video = response.data.data
          if (this.video.videoOriginalName) {
            this.fileList = [{ 'name': this.video.videoOriginalName }]
          }
        })
    },

    updateDataVideo() {
      video.updateVideo(this.video)
        .then(response => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.helpSaveVideo()
        })
        .catch(() => {
          this.helpSaveVideo()
        })
    },

    removeVideo(videoId) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return video.removeVideoById(videoId)
      }).then(() => {
        this.getChapterAndVideoByCourseId(this.courseId)// 刷新列表
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((response) => { // 失败
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      })
    },

    getChapterAndVideoByCourseId(id) {
      chapter.getChapterAndVideoByCourseId(id)
        .then(response => {
          this.chapterNestedList = response.data.data
        })
    },

    // 视频上传成功后赋值
    handleVodUploadSuccess(response, file, fileList) {
      console.log(response)
      this.video.videoSourceId = response.data
      this.video.videoOriginalName = file.name
    },

    // 视图上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },

    // 删除视频
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleVodRemove(file, fileList) {
      console.log(file)
      vod.removeById(this.video.videoSourceId)
        .then(response => {
          this.video.videoSourceId = ''
          this.video.videoOriginalName = ''
          this.fileList = []
          this.$message({
            type: 'success',
            message: response.message
          })
        })
    },

    previous() {
      console.log('previous')
      this.$router.push({ path: '/course/info/' + this.courseId })
    },

    next() {
      console.log('next')
      this.$router.push({ path: '/course/publish/' + this.courseId })
    },

    cancelSaveVideo() {
      // 如果是添加 isUpdate 判断是不是更新还是添加  更新的关闭不能删除  如果是添加上传成功了 关闭窗口 删除视频
      if (this.video.videoSourceId && this.video.id && this.isAddVideo) {
        video.removeVideoSource(this.video.videoSourceId)
      }
      this.dialogVideoFormVisible = false// 如果保存成功则关闭对话框
      this.getChapterAndVideoByCourseId(this.courseId)// 刷新列表
      // this.video.id = ''
      // this.video.title = ''// 重置章节标题
      // this.video.sort = 0// 重置章节标题
      // this.video.isFree = 0 // 重置小节是否免费
      // this.video.videoSourceId = ''// 重置视频资源id
      // this.video.videoOriginalName = ''// 重置视频资源名称
      this.video = this.emptyVideo
      this.fileList = []
      this.saveVideoBtnDisabled = false
    },

    helpSave() {
      // 关闭文本框
      this.dialogChapterFormVisible = false
      // 刷新页面
      this.getChapterAndVideoByCourseId(this.courseId)
      // 重置章节标题
      this.chapter.title = ''
      // 重置章节排序
      this.chapter.sort = 0
      this.chapter.id = ''
      this.saveBtnDisabled = false
    },

    helpSaveVideo() {
      this.dialogVideoFormVisible = false // 如果保存成功则关闭对话框
      this.getChapterAndVideoByCourseId(this.courseId)// 刷新列表
      // this.video.id = ''
      // this.video.title = ''// 重置章节标题
      // this.video.sort = 0// 重置章节标题
      // this.video.isFree = 0 // 重置小节是否免费
      // this.video.videoSourceId = ''// 重置视频资源id
      // this.video.videoOriginalName = ''// 重置视频资源名称
      this.video = this.emptyVideo
      this.fileList = []
      this.saveVideoBtnDisabled = false
    }
  }
}
</script>
<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>
