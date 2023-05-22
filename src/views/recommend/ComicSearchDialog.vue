<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="搜索漫画"
    width="50%"
    @close="resetForm"
    :modal="false"
  >
    <el-input
      v-model="searchParams.name"
      placeholder="请输入漫画名字"
      @keyup.enter.native="search"
    ></el-input>
    <el-button
      type="primary"
      icon="el-icon-search"
      @click="search"
      style="margin-bottom: 20px"
    >
      查询
    </el-button>

    <el-table :data="comicList" style="width: 100%" border v-loading="loading">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="漫画名字"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="selectComic(scope.row)"
            >选择</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :page-size="pagination.pageSize"
      :current-page="pagination.currentPage"
      :total="pagination.total"
      layout="total, prev, pager, next, jumper"
      @current-change="handlePageChange"
      style="text-align: center; margin-top: 20px;"
    ></el-pagination>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getComicList } from "@/api/recommendations";

export default {
  data() {
    return {
      dialogVisible: false,
      searchParams: {
        name: ""
      },
      comicList: [
        // Replace this with data fetched from API
      ],
      selectedRow: null,
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  methods: {
    openDialog(row) {
      this.selectedRow = row;
      this.dialogVisible = true;
      this.searchParam= {
        name: ""
      }
      this.pagination = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      };
      this.search();
    },
    resetForm() {
      this.searchParams.name = "";
    },
    async search() {

      this.loading = true;
      const { data } = await getComicList({
        data: this.searchParams,
        page: this.pagination.currentPage, // 使用当前页
        size: this.pagination.pageSize // 使用每页大小
      });
      this.comicList = data.dataList;
      this.pagination.total = data.total; // 更新总记录数
      this.loading = false;
    },
    selectComic(comic) {
      this.$emit("selectedComic", this.selectedRow, comic);
      this.dialogVisible = false;
      //alert
      this.$message({
        message: "选择成功: "+comic.name+". 提交后更新图片",
        type: "success"
      });

    },
    handlePageChange(newPage) {
      this.pagination.currentPage = newPage;
      this.search();
    }
  }
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
