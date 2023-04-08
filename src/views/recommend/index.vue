<template>
  <!-- 创建一个用于管理推荐的模块  -->

  <div class="components-container">
    <!-- 提示信息
   -->
    <aside>
      <h3>推荐管理</h3>
      <br />
      不提供编辑方法，只提供删除方法
    </aside>
    <!-- 顶部的搜索框 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="推荐名称">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入推荐名称"
        ></el-input>
      </el-form-item>
      <!-- 清空查询条件 -->
      <el-form-item>
        <el-button type="primary" @click="resetSearchForm">清空</el-button>
      </el-form-item>
      <!-- 搜索按钮 -->
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
      <!-- 新增按钮 -->
      <el-form-item>
        <el-button type="primary" @click="showEditRecommendDialog"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 顶部的搜索框 -->
    <!-- 表格 -->
    <el-table :data="recommendList" border :v-loaing="listLoading">
      <el-table-column label="推荐名称" prop="name"></el-table-column>
      <el-table-column label="推荐类型" prop="type">
        <template slot-scope="{ row }">
          <el-tag v-if="row.type == 1">首页6</el-tag>
          <el-tag v-else-if="row.type == 2">首页3</el-tag>
          <el-tag v-else-if="row.type == 3">首页4</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="推荐内容" prop="content"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <!-- <el-button
            size="mini"
            type="text"
            @click="showEditRecommendDialog(row)"
            >编辑</el-button
          > -->
          <el-button size="mini" type="text" @click="deleteRecommend(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格 -->
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchForm.page"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="searchForm.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 分页 -->
    <!-- 添加推荐的对话框 -->
    <el-dialog title="添加推荐" :visible.sync="addRecommendDialogVisible">
      <el-form
        :model="addRecommendForm"
        ref="addRecommendFormRef"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="推荐名称" prop="name">
          <el-input v-model="addRecommendForm.name"></el-input>
        </el-form-item>
        <el-form-item label="推荐类型" prop="type">
          <el-radio-group v-model="addRecommendForm.type">
            <el-radio :label="1">首页6</el-radio>
            <el-radio :label="2">首页3</el-radio>
            <el-radio :label="3">首页4</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="推荐内容" prop="content">
          <el-select
            v-model="addRecommendForm.content"
            multiple
            placeholder="请选择推荐内容"
          >
            <el-option
              v-for="item in comicList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRecommendDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRecommend">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script  lang ="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  getRecommendList,
  addRecommend,
  deleteRecommend,
  editRecommend,
  getRecommendSelectList,
} from "@/api/recommend";

@Component({
  components: {},
})
export default class Recommend extends Vue {
  // 表单验证规则
  rules = {
    name: [{ required: true, message: "请输入推荐名称", trigger: "blur" }],
    type: [{ required: true, message: "请选择推荐类型", trigger: "blur" }],
    content: [{ required: true, message: "请选择推荐内容", trigger: "blur" }],
  };

  // 表格加载状态
  listLoading = false;
  // 搜索表单
  searchForm = {
    name: "",
    type: "",
    page: 1,
    limit: 10,
  };
  // 推荐列表
  recommendList: any[] = [];
  // 总条数
  total = 0;
  // 添加推荐的对话框
  addRecommendDialogVisible = false;
  // 添加推荐的表单
  addRecommendForm = {
    name: "",
    type: "1",
    content: [],
  };
  // 漫画列表
  comicList: any[] = [];

  // 搜索
  search() {
    this.searchForm.page = 1;
    this.getRecommendList();
  }

  // 获取推荐列表
  getRecommendList() {
    this.listLoading = true;
    getRecommendList({
      data: {
        name: this.searchForm.name,
        type: this.searchForm.type,
      },
      page: this.searchForm.page,
      size: this.searchForm.limit,
    }).then((res: any) => {
      this.recommendList = res.data.dataList;
      this.total = res.data.total;
      this.listLoading = false;
    });
  }

  // 漫画列表
  getComicList() {
    this.listLoading = true;

    getRecommendSelectList({}).then((res: any) => {
      this.comicList = res.data;
      this.listLoading = false;
    });
  }

  // 添加推荐
  addRecommend() {
    (this.$refs.addRecommendFormRef as any).validate((valid: boolean) => {
      if (valid) {
        addRecommend({
          name: this.addRecommendForm.name,
          type: this.addRecommendForm.type,
          content: this.addRecommendForm.content.join(","),
        }).then((res: any) => {
          this.$message.success("添加成功");
          this.addRecommendDialogVisible = false;
          this.getRecommendList();
        });
      }
    });
  }

  // 删除推荐
  deleteRecommend(row: any) {
    this.$confirm("此操作将永久删除该推荐, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      deleteRecommend({ id: row.id }).then((res: any) => {
        this.$message.success("删除成功");
        this.getRecommendList();
      });
    });
  }

  // 显示编辑推荐的对话框
  showEditRecommendDialog(row: any) {
    this.addRecommendDialogVisible = true;
    if (!row) {
      return;
    }
    this.addRecommendForm = {
      name: row.name,
      type: row.type,
      content: row.content,
    };
  }

  // 编辑推荐
  editRecommend() {
    (this.$refs.addRecommendFormRef as any).validate((valid: boolean) => {
      if (valid) {
        editRecommend({
          id: this.$route.query.id,
          name: this.addRecommendForm.name,
          type: this.addRecommendForm.type,
          content: this.addRecommendForm.content.join(","),
        }).then((res: any) => {
          this.$message.success("编辑成功");
          this.addRecommendDialogVisible = false;
          this.getRecommendList();
        });
      }
    });
  }

  handleSizeChange(val: number) {
    this.searchForm.limit = val;
    this.getRecommendList();
  }

  handleCurrentChange(val: number) {
    this.searchForm.page = val;
    this.getRecommendList();
  }

  created() {
    this.getRecommendList();
    this.getComicList();
  }
  resetSearchForm() {
    this.searchForm = {
      name: "",
      type: "",
      page: 1,
      limit: 10,
    };
  }
}
</script>