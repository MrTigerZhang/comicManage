
<template>
  <!-- 用于展示一个仪表盘页面。它包含了以下组件：

GithubCorner：一个放置在右上角的Github图标

LineChart：展示折线图的组件。
RadarChart：展示雷达图的组件。
PieChart：展示饼图的组件。
BarChart：展示柱状图的组件。
TransactionTable：展示交易表格的组件。
TodoList：展示待办事项的组件。
BoxCard：展示带图标的卡片式信息的组件。
该组件的数据存储在lineChartData中，是一个包含多个数据系列的对象。默认情况下，lineChartData.newVisitis被选中。当用户在PanelGroup中选择其他数据系列时，组件会通过handleSetLineChartData方法更新展示的数据。

整个组件的样式使用了SCSS预处理器，并在1024px的屏幕宽度以下进行了媒体查询调整。 -->
  <div class="dashboard-editor-container">
    <!-- 右上角git图标 -->
    <!-- <github-corner class="github-corner" /> -->
    <!-- PanelGroup：用于展示多个数据面板的组件，可以添加或删除数据面板。 -->
    <panel-group   />
  </div>
</template>

<script lang="ts">
import 'echarts/theme/macarons.js' // Theme used in BarChart, LineChart, PieChart and RadarChart
import { Component, Vue } from 'vue-property-decorator'
import GithubCorner from '@/components/GithubCorner/index.vue'
import BarChart from './components/BarChart.vue'
import BoxCard from './components/BoxCard.vue'
import PanelGroup from './components/PanelGroup.vue'

@Component({
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    BarChart,
    BoxCard,
    PanelGroup
  }
})
export default class extends Vue {

}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
