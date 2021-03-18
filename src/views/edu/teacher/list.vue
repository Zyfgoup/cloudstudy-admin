<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchObj.name" placeholder="讲师名"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="searchObj.level" clearable placeholder="讲师头衔">
          <el-option :value="3" label="普通讲师"/>
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="searchObj.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="datetime"
          placeholder="选择截止时间"
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
      bteacher
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

      <el-table-column prop="name" label="名称" width="80" align="center"/>

      <el-table-column label="头衔" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level==1" type="success">高级讲师</el-tag>
          <el-tag v-if="scope.row.level==2" type="success" >首席讲师</el-tag>
          <el-tag v-if="scope.row.level==3" type="success" >普通讲师</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="资历" align="center"/>

      <el-table-column prop="createTime" label="添加时间" width="160" align="center"/>

      <el-table-column prop="sort" label="排序" width="60" align="center"/>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
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
        'name': '',
        'level': '',
        'start': '',
        'end': ''
      }// 查询条件
    }
  },
  // 初始化，在加载的时候执行
  created() {
    // 调用查询列表的方法
    this.getPageList()
  },
  // 存放方法的
  methods: {
    getPageList(page = 1) {
      this.page = page
      // 发送请求从后台获取数据
      teacher.getPageList(this.page, this.limit, this.searchObj)
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
        return teacher.removeById(id)
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
