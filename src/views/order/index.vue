<template>
  <div class="components-container">
    <div class="filter">
      <el-form
        ref="filterForm"
        :model="filterForm"
        inline
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="订单号:">
          <el-input
            v-model="filterForm.orderNumber"
            placeholder="请输入订单号"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号:">
          <el-input
            v-model="filterForm.phone"
            placeholder="请输入用户手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单状态:">
          <el-select v-model="filterForm.status" placeholder="请选择订单状态">
            <el-option label="待支付" value="0"></el-option>
            <el-option label="已支付" value="1"></el-option>
            <el-option label="已完成" value="3"></el-option>
            <el-option label="已超时" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式:">
          <el-select
            v-model="filterForm.paymentMethod"
            placeholder="请选择支付方式"
          >
            <el-option label="微信" value="1"></el-option>
            <el-option label="支付宝" value="2"></el-option>
            <el-option label="手动支付" value="3"></el-option>
            <el-option label="其他" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付日期" prop="payDateRange">
          <el-date-picker
            v-model="filterForm.payDateRange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="创建时间:" prop="createDateRange">
          <el-date-picker
            v-model="filterForm.createDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetFilters">清空</el-button>
          <el-button type="primary" @click="queryOrders">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :data="orders"
      border
      row-key="orderNo"
      :pagination.sync="pagination"
    >
      <el-table-column
        prop="orderNo"
        label="订单号"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="username"
        label="用户名称"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="rechargeName"
        label="充值名称"
        width="150"
      ></el-table-column>
      <el-table-column prop="status" label="订单状态" width="120">
        <template #default="{ row }">
          <span>{{ statusFilter(row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentMethod" label="支付方式" width="120">
        <template #default="{ row }">
          <span>{{ paymentMethodFilter(row.paymentMethod) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="paymentTime"
        label="支付时间"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="180"
      ></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button
            v-if="row.status == 0"
            type="primary"
            size="small"
            @click="manualPayment(row)"
            >手动支付</el-button
          >
        </template></el-table-column
      ></el-table
    >

    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { selectOrders, manualPay } from "@/api/orders";
export default {
  data() {
    return {
      filterForm: {
        orderNumber: "",
        phone: "",
        status: "",
        paymentMethod: "",

        createDateRange: [],
      },
      orders: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  mounted() {
    this.queryOrders();
  },
  methods: {
    async queryOrders() {
      try {
        const response = await selectOrders({
          data: {
            orderNumber: this.filterForm.orderNumber,
            phone: this.filterForm.phone,
            status: this.filterForm.status,
            paymentMethod: this.filterForm.paymentMethod,
            payDateStart: this.filterForm.payDateRange
              ? this.filterForm.payDateRange[0]
              : null,
            payDateEnd: this.filterForm.payDateRange
              ? this.filterForm.payDateRange[1]
              : null,
            createDateStart: this.filterForm.createDateRange
              ? this.filterForm.createDateRange[0]
              : null,
            createDateEnd: this.filterForm.createDateRange
              ? this.filterForm.createDateRange[1]
              : null,
          },
          page: this.pagination.currentPage,
          size: this.pagination.pageSize,
        });
        if (response && response.data) {
          this.orders = response.data.dataList;
          this.pagination.total = response.data.total;
        }
      } catch (error) {
        this.$message.error("查询订单失败");
        console.error("查询订单失败：", error);
      }
    },
    manualPayment(row) {
      this.$confirm("确定要手动支付订单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await manualPay({ id: row.id });
        await this.queryOrders();
      });
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.queryOrders();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.queryOrders();
    },
    resetFilters() {
      this.filterForm.orderNumber = "";
      this.filterForm.phone = "";
      this.filterForm.status = "";
      this.filterForm.paymentMethod = "";
      this.filterForm.payDateRange = [];
      this.filterForm.createDateRange = [];
    },
    statusFilter(value) {
      if (value == 0) {
        return "待支付";
      } else if (value == 1) {
        return "已支付";
      } else if (value == 2) {
        return "已超时";
      } else if (value == 3) {
        return "已完成";
      }
      return value;
    },
    paymentMethodFilter(value) {
      if (value == 1) {
        return "微信";
      } else if (value == 2) {
        return "支付宝";
      } else if (value == 3) {
        return "手动";
      } else if (value == 4) {
        return "其他";
      }
      return value;
    },
  },
  filters: {},
};
</script>
<style scoped>
.order-manager {
  padding: 20px;
}

.filter {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
