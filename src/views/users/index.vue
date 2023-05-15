<template>
  <div class="components-container">
    <aside>
      漫画用户是指在本站注册的用户 ，可以在本站阅读漫画。余额通过充值完成。
      亦可通过其他方式获取
    </aside>
    <!-- 查询条件 -->
    <div class="search-container">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="手机号">
          <el-input
            v-model="queryForm.phone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker
            v-model="queryForm.createDateRange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            range-separator="至"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>

        <!-- 最后登陆日期 -->
        <el-form-item label="最后登陆日期">
          <el-date-picker
            v-model="queryForm.lastLoginDateRange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            range-separator="至"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
  <!-- 用户状态 -->
        <el-form-item label="用户状态">
          <el-select v-model="queryForm.status" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 用户列表 -->
    <div class="table-container">
      <el-table
        :data="userList"
        border
        stripe
        style="width: 100%"
        v-loading="listLoading"
        @sort-change="handleSortChange"
      >
        <el-table-column prop="nickname" label="用户昵称"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="balance" label="剩余点数" sortable>
          <template slot-scope="{row}">{{
            formatMoney(row.balance)
          }}(点) </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建日期" sortable>
          <template slot-scope="{row}">{{
            formatDate(row.createDate)
          }}</template>
        </el-table-column>
        <!-- 最后登陆日期 lastLoginDate -->
        <el-table-column prop="lastLoginDate" label="最后登陆日期" sortable>
          <template slot-scope="{row}">{{
            formatDate(row.lastLoginDate)
          }}</template>
        </el-table-column>

        <!-- 未登陆天数 -->
        <el-table-column prop="lastLoginDate" label="未登陆天数" sortable>
          <template slot-scope="{row}">{{
            formatLastLoginDate(row.lastLoginDate)
          }}</template>
        </el-table-column>

        <el-table-column prop="status" label="状态" :formatter="formatStatus">
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button
              class="item-btn"
              size="small"
              :type="row.status === 0 ? 'success' : 'danger'"
              @click="handleEnable(row)"
            >
              {{ row.status === 0 ? "启用" : "禁用" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getUserList, enableUser } from '@/api/user'
import { User } from '@/api/types'

@Component({
  name: 'UserList'
})
export default class UserList extends Vue {
  private listLoading = true;
  // 查询条件
  private queryForm: {
    phone: string | null
    createDateRange: string[] | null
    lastLoginDateRange: string[] | null
    sort: any | null
    status: string | null
  } = {
    phone: null,
    createDateRange: null,
    sort: undefined,
    lastLoginDateRange: null,
    status: null
  };

  // 用户列表数据
  private userList: User[] = [];

  // 分页相关数据
  private total = 0;
  private currentPage = 1;
  private pageSize = 10;
  // 排序相关数据
  sortby = '';
  sortdirection = '';

  // 日期选择器选项
  private pickerOptions = {
    shortcuts: [
      {
        text: '最近一周',
        onClick(picker: any) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '最近一个月',
        onClick(picker: any) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '最近三个月',
        onClick(picker: any) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          picker.$emit('pick', [start, end])
        }
      }
    ]
  };

  // 格式化余额数据
  private formatMoney(money: number): string {
    return money + ''
  }

  // 格式化创建日期数据
  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('zh-CN')
  }

  // 格式化状态数据
  private formatStatus(row: any): string {
    return row.status === 0 ? '禁用' : '启用'
  }

  // 查询用户列表
  private async getUserList() {
    this.listLoading = true
    this.userList = []
    const { data } = await getUserList({
      page: this.currentPage,
      size: this.pageSize,
      sortby: this.sortby,
      sortdirection: this.sortdirection,
      data: {
        phone: this.queryForm.phone,
        createDateStart: this.queryForm.createDateRange
          ? this.queryForm.createDateRange[0]
          : null,
        createDateEnd: this.queryForm.createDateRange
          ? this.queryForm.createDateRange[1]
          : null,
        lastLoginDateStart: this.queryForm.lastLoginDateRange
          ? this.queryForm.lastLoginDateRange[0]
          : null,
        lastLoginDateEnd: this.queryForm.lastLoginDateRange
          ? this.queryForm.lastLoginDateRange[1]
          : null,
        status: this.queryForm.status
      }
    })

    this.userList = data.dataList
    this.total = data.total
    this.listLoading = false
    this.$message({
      type: 'success',
      message: '查询成功!'
    })
  }

  // 处理查询按钮点击事件
  private handleQuery() {
    this.currentPage = 1
    this.getUserList()
  }

  // 处理启停事件
  private async handleEnable(row: any) {
    this.listLoading = true
    // 弹出提示框询问是否处理
    await this.$confirm(
      `确定要${row.status === 0 ? '启用' : '禁用'}该用户吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async() => {
      // 点击确定后的操作
      await enableUser({ id: row.id })
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.getUserList()
    })
  }

  // 处理分页大小变更事件
  private handleSizeChange(size: number) {
    this.pageSize = size
    this.getUserList()
  }

  // 处理分页页码变更事件
  private handleCurrentChange(page: number) {
    this.currentPage = page
    this.getUserList()
  }

  // 生命周期钩子函数，在组件创建时调用
  private created() {
    this.getUserList()
  }

  // 处理排序
  async handleSortChange(sort: any) {
    // 处理排序字段

    // sort: { prop: 'balance', order: 'ascending' or 'descending' }

    this.sortby = sort.prop
    this.sortdirection = sort.order

    this.getUserList()
  }

  // 计算未登陆天数
  formatLastLoginDate(date: Date) {
    if (date) {
      const now = new Date()
      const lastLoginDate = new Date(date)
      const diff = now.getTime() - lastLoginDate.getTime()
      const days = diff / (1000 * 60 * 60 * 24)
      return Math.floor(days) + '天'
    } else {
      return '未登陆过'
    }
  }
}
</script>
