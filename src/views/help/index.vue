<template>
  <div class="components-container">
    <div class="filter-container">
      <el-form :inline="true" :model="filters" class="demo-form-inline">
       
        <el-form-item label="名称:">
          <el-input v-model="filters.title" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button @click="clearFilters">清空查询条件</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <el-button type="success" @click="goToAdd">新增</el-button>
      <el-button type="primary"
       @click="refresh">刷新缓存</el-button>
    </div>
       

    <el-table :data="helpList" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="title" label="帮助名称"></el-table-column>
      <el-table-column
        prop="helpful"
        label="好评数量"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="unhelpful"
        label="差评数量"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="createAt"
        label="创建日期"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="updateAt"
        label="更新日期"
        width="200"
      ></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHelp(scope.row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="deleteHelp(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import {
  getHelpInfo,
  addHelp,
  deleteHelp,
  updateHelp,
  getHelpList,
  refresh
} from "@/api/help";

@Component
export default class HelpList extends Vue {
  private filters = {
    dateRange: "",
    title: ""
  };

  private helpList: any = [];
  private loading = true;
  private currentPage = 1;
  private pageSize = 10;
  private total = 0;

  created() {
    this.getList();
  }

  async getList() {
    this.loading = true;
    const data = await getHelpList({
      data: {
        title: this.filters.title,
      },
      page: this.currentPage,
      size: this.pageSize
    });
    this.total = data.data.total;
    this.helpList = data.data.dataList;
    this.loading = false;
  }

  clearFilters() {
 
    this.filters.title = "";
    this.getList();
  }

  goToAdd() {
    this.$router.push("helpeditor/0");
  }

  editHelp(row: any) {
    this.$router.push("helpeditor/" + row.id);
  }

  async deleteHelp(row: any) {
    this.loading = true;
    this.$confirm("确认删除该帮助信息吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        await deleteHelp({id:row.id});
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.getList();
      })
      .catch(() => {
        this.loading = false;
      });
    this.getList();
  }

  handleSizeChange(val: number) {
    this.pageSize = val;
    this.getList();
  }

  handleCurrentChange(val: number) {
    this.currentPage = val;
    this.getList();
  }
  refresh(){
    this.$confirm("确认刷新缓存吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        await  refresh({});
        this.$message({
          type: "success",
          message: "刷新成功!"
        });
      }) 
   
  }
}
</script>

<style scoped>
.filter-container {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
