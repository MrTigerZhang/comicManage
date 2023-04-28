<template>
  <div class="components-container">
    <aside>
      推荐模块-推荐内容-推荐的漫画<br />
      大家都在搜这种，选择无图模式，
      <br />
      可以通过拖拽更改图片的顺序
      
      </br>
      
      首页banner — 特殊   type = banner </br>
      超热门推荐！ 6 type = hot6 </br>
      精品-好康打滚推荐！4 type = hot4</br>
      好康，真的非常好康！ 4 type = nice4</br>
      近期热门推荐 6 type = recent6</br>
      [大家都在搜] 搜索的推荐内容 —- 特殊4 type = search4 </br>
      大家都在搜 搜索内容为空时的推荐 4 type = search42</br>
    </aside>
    <el-row>
      <el-col :span="6">
        <el-input
          v-model="searchParams.name"
          placeholder="推荐名称"
          @keyup.enter.native="search"
        ></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-search" @click="search"
          >查询</el-button
        >
      </el-col>
      <el-col :span="3">
        <el-button type="primary" icon="el-icon-plus" @click="showAddDialog"
          >添加</el-button
        >
      </el-col>
      <el-col :span="4">
        <el-button type="danger" icon="el-icon-refresh" @click="refreshCache"
          >刷新缓存</el-button
        >
      </el-col>
      <el-col :span="4">
        <el-button type="primary" icon="el-icon-check" @click="validateData"
          >校验数据</el-button
        >
      </el-col>
    </el-row>

    <el-table :data="recommendationModules" border v-loading="loading">
      <el-table-column prop="name" label="推荐名称"></el-table-column>
      <el-table-column prop="type" label="类型" width="180"></el-table-column>
      <el-table-column
        prop="imgCount"
        label="图片数量"
        width="180"
      ></el-table-column>
      <el-table-column label="启用状态" width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            :active-value="1"
            :inactive-value="0"
            @change="toggleStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showRecommendationEditDialog(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteRecommendation(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <add-or-edit-recommendation-dialog
      ref="addOrEditRecommendationDialog"
      @refreshData="search"
    ></add-or-edit-recommendation-dialog>

    <recommendation-edit-dialog
      ref="recommendationEditDialog"
    ></recommendation-edit-dialog>
  </div>
</template>

<script>
import AddOrEditRecommendationDialog from "./AddOrEditRecommendationDialog.vue";

import { list, clearCache, check, del, enable } from "@/api/recommendations";
import RecommendationEditDialog from "./RecommendationEditDialog.vue";

export default {
  components: {
    AddOrEditRecommendationDialog,
    RecommendationEditDialog // 引入推荐编辑组件
  },
  data() {
    return {
      searchParams: {
        name: ""
      },
      recommendationModules: [],
      loading: false
    };
  },
  created() {
    this.search();
  },
  methods: {
    async search() {
      this.loading = true;
      const { data } = await list({
        data: this.searchParams,
        page: 1,
        size: 1000
      });
      this.recommendationModules = data.dataList;
      this.loading = false;
    },
    showAddDialog() {
      this.$refs.addOrEditRecommendationDialog.showAddDialog();
    },
    showEditDialog(row) {
      this.loading = true;
      this.$refs.addOrEditRecommendationDialog.showEditDialog(row);
    },
    showRecommendationEditDialog(row) {
      this.$refs.recommendationEditDialog.openDialog(row);
    },
    deleteRecommendation(row) {
      this.$confirm("此操作将永久删除该推荐模块, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await del({ id: row.id });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.search();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    toggleStatus(row) {
      this.$confirm("此操作将切换推荐模块的启用状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await enable({ id: row.id });
          this.$message({
            type: "success",
            message: "切换成功!"
          });
          this.search();
        })
        .catch(() => {
          this.search();
        });
    },
    refreshCache() {
      //clearCache
      // 调用 API 刷新缓存
      this.$confirm("此操作将刷新推荐模块的缓存, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await clearCache();
          this.$message({
            type: "success",
            message: "刷新成功!"
          });
          this.search();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消刷新"
          });
        });
    },
    validateData() {
      // 调用 API 校验数据
      this.$confirm("此操作将校验推荐模块的数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await check();
          this.$message({
            type: "success",
            message: "校验成功!"
          });
          this.search();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消校验"
          });
        });
    }
  }
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
</style>
