<template>
  <div >
<!--    <div class="dashboard-text">欢迎：{{ name }}</div>-->
<!--    <div class="dashboard-text">角色：<span v-for="role in roles" :key="role">{{ role }}&nbsp&nbsp</span></div>-->
    <el-row style="margin-top: 20px">
      <el-col :span="12"><div id="chart1" style="width: 500px;height: 400px;margin-left: 20px"></div></el-col>
      <el-col :span="12"><div id="chart2" style="width: 100%;height: 400px"></div></el-col>
    </el-row>

    <el-row style="margin-top: 20px">
      <el-col :span="12"><div id="chart3" style="width: 500px;height: 400px;margin-left: 40px"></div></el-col>
      <el-col :span="12"><div id="chart4" style="width: 100%;height: 400px"></div></el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import echarts from 'echarts'
import chartApi from '@/api/statistics/chart'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ]),

  },
  data(){
    return {
      chart1: null,  //今日曲线图
      chart1Data: {
        yes: null,
        today: null,
        yes_data: null,
        now_data: null
      },
      chart2: null,  //昨日今日对比图
      chart3: null,   //总购买前5课程
      chart4: null,  //分类比例

    }
  },
  methods: {
    initChart1(){

      chartApi.chart1().then(response => {
        const data = response.data.data;
        this.chart1Data.yes = data.yesterday
        this.chart1Data.today = data.today;
        this.chart1Data.yes_data = data.yesData;
        this.chart1Data.now_data = data.nowData;
        const date = []
        date.push(this.chart1Data.yes);
        date.push(this.chart1Data.today);
        this.chart1 = echarts.init(document.getElementById('chart1'))
        var option;
        option = {
          title: {
            text: '今昨日数据对比'
          },

          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: date
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: ['注册人数', '登陆人数', '视频观看人数', '课程总数']
          },
          series: [
            {
              name:  this.chart1Data.yes,
              type: 'bar',
              data:  this.chart1Data.yes_data
            },
            {
              name:  this.chart1Data.today,
              type: 'bar',
              data:  this.chart1Data.now_data
            }
          ]
        };
        this.chart1.setOption(option);
      }).catch(()=>{

      })

    },
    initChart2() {
      chartApi.chart2().then(response => {
        const data = response.data.data
        const date = data.date
        const registerNum = data.registerNum
        const loginNum = data.loginNum
        const videoViewNum = data.videoViewNum
        const courseNum = data.courseNum
        this.chart2 = echarts.init(document.getElementById('chart2'))
        var option;
        option = {
          title: {
            text: '七天数据展示'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['注册人数', '登陆人数', '视频观看量', '课程总数']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '注册人数',
              type: 'line',
              stack: '总量',
              data: registerNum
            },
            {
              name: '登陆人数',
              type: 'line',
              stack: '总量',
              data: loginNum
            },
            {
              name: '视频观看量',
              type: 'line',
              stack: '总量',
              data: videoViewNum
            },
            {
              name: '课程总数',
              type: 'line',
              stack: '总量',
              data: courseNum
            },
          ]
        };
        this.chart2.setOption(option);
      }).catch(() => {

      })
    },
    initChart3(){
      chartApi.chart3().then(response => {
        const courseName  = response.data.data.name
        const buyCount = response.data.data.buyCount
        this.chart3 = echarts.init(document.getElementById('chart3'))
        var option;
        option = {
          title: {
            text: '购买前5课程'
          },
          xAxis: {
            type: 'category',
            data: courseName
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: buyCount,
            type: 'bar',
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: 'top', //在上方显示
                  textStyle: { //数值样式
                    color: 'black',
                    fontSize: 16
                  }
                }
              }
            }
          }]
        };
        this.chart3.setOption(option);
      }).catch(()=> {

      })
    },
    initChart4(){
      chartApi.chart4().then(response => {
        const data = response.data.data;
        this.chart4 = echarts.init(document.getElementById('chart4'))
        var option;
        option = {
          title: {
            text: '课程分类'
          },
          legend: {
            top: 'bottom'
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          series: [
            {
              name: '课程分类',
              type: 'pie',
              radius: [40,160],
              center: ['50%', '50%'],
              roseType: 'area',
              itemStyle: {
                borderRadius: 8
              },
              data: data
            }
          ]
        };
        this.chart4.setOption(option);
      }).catch(()=>{

      })
    }
  },

  created() {
    this.$nextTick(()=>{
      this.initChart1();
      this.initChart2();
      this.initChart3();
      this.initChart4()
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }

  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
}
</style>
