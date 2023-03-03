<template>
  <!-- 它展示了一个包含4个卡片面板的面板组件。
每个卡片面板包含一个图标、一个标题和一个计数器，计数器会从0增加到一个指定的结束值。
当用户点击任何一个面板时，会触发handleSetLineChartData函数，它会将该面板的类型作为参数发送给父组件。

具体地，组件包含一个el-row元素，它将el-col元素放在一行中
，每个el-col元素代表一个面板。
每个el-col元素中包含一个div元素，它包含一个图标和一个标题，还有一个count-to元素，
它是一个计数器组件。当用户点击面板时，
handleSetLineChartData函数将该面板的类型作为参数发送给父组件，
以便父组件可以根据用户选择的面板类型更新图表数据。
组件还导入了vue-count-to计数器组件，并将它注册为一个局部组件。 -->
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('userTotal')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon name="people" class="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">用户总数</div>
          <count-to
            :start-val="0"
            :end-val="userTotal"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon name="education" class="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">漫画总数</div>
          <count-to
            :start-val="0"
            :end-val="comicTotal"
            :duration="3000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon name="money" class="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">充值总额</div>
          <count-to
            :start-val="0"
            :end-val="money"
            :duration="3200"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon name="message" class="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">系统消息</div>
          <count-to
            :start-val="0"
            :end-val="magTotal"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CountTo from 'vue-count-to'

@Component({
  name: 'PanelGroup',
  components: {
    CountTo
  }
})
export default class extends Vue {
  private userTotal = 1000;
  private comicTotal = 1000;
  private money = 30;
  private magTotal = 12;
  private handleSetLineChartData(type: string) {
    this.$emit('handle-set-line-chart-data', type)
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
