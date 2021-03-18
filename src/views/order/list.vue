<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">


      <el-select
        v-model="searchObj.courseId"
        placeholder="请选择或者搜索课程" clearable filterable>
        <el-option
          v-for="course in courseList"
          :key="course.id"
          :label="course.title"
          :value="course.id"/>
      </el-select>

      <!-- 讲师 -->
      <el-form-item>
        <el-select
          v-model="searchObj.teacherName"
          placeholder="请选择或者搜索讲师" clearable filterable>
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.name"/>
        </el-select>
      </el-form-item>

      <!-- 讲师 -->
      <el-form-item>
        <el-select
          v-model="searchObj.userId"
          placeholder="请选择或者搜索用户" clearable filterable>
          <el-option
            v-for="user in userList"
            :key="user.id"
            :label="user.nickname"
            :value="user.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="购买时间">
        <el-date-picker
          v-model="searchObj.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getPageList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="courseTitle" label="课程名称"  align="center"/>
      <el-table-column prop="teacherName" label="讲师名称" width="150" align="center"/>
      <el-table-column prop="nickname" label="购买用户" width="150" align="center"/>
      <el-table-column label="状态" width="200" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==0" type="warning">未支付</el-tag>
          <el-tag v-if="scope.row.status==1" type="success" >已支付</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="购买时间" width="200" align="center"/>

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getPageList"
    />

  </div>
</template>

<script>
// 引用teacher.js
import teacher from '@/api/edu/teacher'
import course from '@/api/edu/course'
import user from '@/api/user'
import order from '@/api/order/order'

export default {
  // 定义数据变量
  data() {
    return {
      listLoading: true, // 是否显示loading信息
      list: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录
      searchObj: {
        'courseId': '',
        'teacherName': '',
        'start': '',
        'userId': ''
      },// 查询条件
      teacherList: [],
      courseList: [],
      userList: [],
    }
  },
  // 初始化，在加载的时候执行
  created() {
    // 调用查询列表的方法
    this.getPageList()
    this.initTeacherList();
    this.initCourseList();
    this.initUserList();
  },
  // 存放方法的
  methods: {


    initTeacherList() {
      teacher.getList().then(response => {
        this.teacherList = response.data.data
      })
    },

    initCourseList() {
      course.getList().then(response => {
        this.courseList = response.data.data
      })
    },

    initUserList() {
      user.getList().then(response => {
        this.userList = response.data.data
      })
    },

    getPageList(page = 1) {
      this.page = page
      // 发送请求从后台获取数据
      order.getPageList(this.page, this.limit, this.searchObj)
        .then(response => {
          console.log(response.data)
          this.list = response.data.data.data
          this.total = response.data.data.total
          // 当数据记载完后把listLoading关闭
          this.listLoading = false
        })
        .catch(response => {
          console.log(response.data.message)
        })
    },
    resetData() {
      this.searchObj = {}
      this.getPageList()
    },
    removeDataById(id) {
      // 提示：是否删除
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return order.removeById(id)
      }).then(() => {
        // 已经向后台发送请求了并且是成功的
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getPageList()
      }).catch((response) => { // 失败
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        } else {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        }
      })
    }

  }
}
</script>
