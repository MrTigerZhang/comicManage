<template>
  <div class="components-container">
    <!-- 查询表单 -->
    <el-form ref="searchForm" :model="searchForm" inline label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="searchForm.name"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="searchForm.category" placeholder="请选择">
          <el-option
            v-for="(category, index) in categories"
            :key="index"
            :label="category.label"
            :value="category.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="searchForm.author"></el-input>
      </el-form-item>

      <el-form-item label="连载状态">
        <el-select v-model="searchForm.status" placeholder="请选择">
          <el-option label="请选择" value=""></el-option>
          <el-option label="连载中" value="ongoing"></el-option>
          <el-option label="已完结" value="completed"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上架状态">
        <el-select v-model="searchForm.banned" placeholder="请选择">
          <el-option label="请选择" value=""></el-option>
          <el-option label="是" value="true"></el-option>
          <el-option label="否" value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建日期">
        <el-date-picker
          v-model="searchForm.createDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="更新日期">
        <el-date-picker
          v-model="searchForm.updateDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="text" @click="resetSearchConditions"
          >清空查询条件</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchMangas">查询</el-button>
      </el-form-item>
      <el-form-item>
        <div />
        <el-button type="info" @click="openMangaEditor(-1)">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="startScraping">采集</el-button>
      </el-form-item>
    </el-form>

    <!-- 漫画列表 -->
    <el-table
      :data="mangas"
      border
      style="width: 100%"
      @sort-change="onSortChange"
    >
      <el-table-column
        prop="id"
        label="编号"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        prop="category"
        label="分类"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        prop="author"
        label="作者"
        sortable="custom"
      ></el-table-column>
      <el-table-column prop="description" label="简介" sortable="custom">
        <template slot-scope="scope">
          <div @click="showDescriptionDialog(scope.row)">
            {{
              scope.row.description.slice(0, 10) +
              (scope.row.description.length > 10 ? "..." : "")
            }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="thumbnail" label="缩略图">
        <template #default="{row}">
          <div @click="showImagePreview(row.thumbnail)">
            <el-image
              :src="row.thumbnail"
              :preview-src-list="[row.thumbnail]"
              :fit="'contain'"
              style="width: 50px; height: 50px"
            ></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="chapters"
        label="连载到"
        sortable="custom"
      ></el-table-column>
      <el-table-column prop="status" label="连载状态" sortable="custom">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 'ongoing'">连载中</el-tag>
          <el-tag v-else type="success">已完结</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建日期"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        prop="updateDate"
        label="更新日期"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        prop="freeUntil"
        label="免费至"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        prop="rating"
        label="评分"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        prop="favorites"
        label="收藏人气"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        prop="purchases"
        label="购买人气"
        sortable="custom"
      ></el-table-column>
      <el-table-column prop="banned" label="上架状态" sortable="custom">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.banned" type="danger">是</el-tag>
          <el-tag v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="openMangaEditor(scope.row.id)"
            >编辑</el-button
          >
          <el-button type="text" @click="deleteManga(scope.row)"
            >删除</el-button
          >
          <el-button type="text" @click="toggleBan(scope.row)">{{
            scope.row.banned ? "下架" : "上架"
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 图片预览对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="imagePreviewDialogVisible"
      width="300px"
    >
      <el-image
        :src="previewImageUrl"
        :fit="'contain'"
        class="image-preview"
      ></el-image>
    </el-dialog>

    <el-dialog :visible.sync="descriptionDialogVisible" title="详细简介">
      <p>{{ selectedDescription }}</p>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getComicList,
  getCategorys,
  toggleBan,
  deleteManga,
  startScraping
} from '@/api/comic'
@Component
export default class MangaManagement extends Vue {
  mangas: any[] = [];
  currentPage = 1;
  pageSize = 10;
  total = 0;
  searchForm = {
    // 在此处添加查询表单的其他字段
  };

  categories = [];
  sort = {};
  imagePreviewDialogVisible = false;
  previewImageUrl = '';
  descriptionDialogVisible = false;
  selectedDescription = '';
  async mounted() {
    this.searchMangas()
    this.categories = await (await getCategorys({})).data
  }

  async searchMangas() {
    const data = await getComicList({
      search: this.searchForm,
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      sort: this.sort
    })
    this.mangas = []
    this.mangas = data.data.list
    this.total = data.data.total
  }

  // 打开漫画编辑页面
  openMangaEditor(mangaId: string | null = null) {
    // 编辑模式
    this.$router.push({ name: 'editor', params: { id: mangaId } })
  }

  // 开始抓取漫画
  async startScraping() {
    this.$confirm('请不要频繁抓取', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      const response: any = await startScraping({})
      if (response.code === 20000) {
        this.$message.success('已开始采集任务')
      } else {
        this.$message.error(response.msg)
      }
    })
  }

  // 删除漫画
  async deleteManga(manga: any) {
    this.$confirm('确定删除该漫画吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      const response: any = await deleteManga({ id: manga.id })
      if (response.code === 20000) {
        this.$message.success(manga.isBanned ? '已解封' : '已上架')

        this.searchMangas()
      } else {
        this.$message.error('操作失败，请稍后重试')
      }
    })
  }

  // 切换漫画上架状态
  async toggleBan(manga: any) {
    this.$confirm(
      '确定' + manga.isBanned ? '上架' : '下架' + '该漫画吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async() => {
      const response: any = await toggleBan({ id: manga.id })
      if (response.code === 20000) {
        this.$message.success(manga.isBanned ? '已下架' : '已上架')
        this.searchMangas()
      } else {
        this.$message.error('操作失败，请稍后重试')
      }
    })
  }

  // 处理每页大小变化
  handleSizeChange(val: number) {
    this.pageSize = val
    this.searchMangas()
  }

  // 处理当前页变化
  handleCurrentChange(val: number) {
    this.currentPage = val
    this.searchMangas()
  }

  // 处理排序变化
  async onSortChange({ prop, order }: { prop: string, order: string }) {
    this.sort = { prop, order }
    this.searchMangas()
  }

  // 在 methods 中添加以下方法
  resetSearchConditions() {
    this.searchForm = {
      name: '',
      category: '',
      author: '',
      description: '',
      thumbnail: '',
      status: '',
      isBanned: '',
      createDateStart: '',
      createDateEnd: '',
      updateDateStart: '',
      updateDateEnd: ''
    }
  }

  showDescriptionDialog(row: { description: string }) {
    this.selectedDescription = row.description
    this.descriptionDialogVisible = true
  }
}
</script>
