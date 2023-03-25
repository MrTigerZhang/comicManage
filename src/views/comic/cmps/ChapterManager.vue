<template>
  <div v-if="isEditMode" class="components-container">
    <aside>
      章节删除或者下架后不会重被后面的章节填补。在客户端会展示为404
      <br />
    </aside>
    <h3>章节管理 - {{ title }}</h3>

    <template>
      <!-- 查询条件 -->
      <el-form ref="searchForm" :model="searchForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="章节序号">
              <el-input
                v-model.number="searchForm.order"
                type="number"
                :min="1"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="章节名称">
              <el-input v-model="searchForm.name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="上架状态">
              <el-select v-model="searchForm.status" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="已上架" value="1"></el-option>
                <el-option label="已下架" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="创建日期">
          <el-date-picker
            v-model="searchForm.createDate"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="更新日期">
          <el-date-picker
            v-model="searchForm.updateDate"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button @click="resetSearchForm">重置</el-button>
          <el-button type="primary" @click="searchChapters">查询</el-button>
          <el-button type="success" @click="showEditChapterDialog(null)"
            >新增章节</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 分页列表 -->
      <el-table
        :data="chapters"
        @sort-change="handleSortChange"
        border
        stripe
        v-loading="listLoading"
      >
        <el-table-column label="章节ID" prop="id"></el-table-column>
        <el-table-column
          label="章节序号"
          prop="order"
          sortable
        ></el-table-column>
        <el-table-column label="章节名称" prop="name"></el-table-column>
        <el-table-column label="缩略图">
          <template slot-scope="{row}">
            <el-image
              :src="row.thumbnail"
              :preview-src-list="[row.thumbnail]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="总页数"
          prop="pageCount"
          sortable
        ></el-table-column>
        <el-table-column label="价格" prop="price" sortable></el-table-column>
        <el-table-column
          label="人气"
          prop="popularity"
          sortable
        ></el-table-column>
        <el-table-column
          label="创建日期"
          prop="createdAt"
          sortable
        ></el-table-column>
        <el-table-column
          label="更新日期"
          prop="updatedAt"
          sortable
        ></el-table-column>

        <el-table-column label="上架状态" prop="status">
          <template slot-scope="{row}">
            <el-tag v-if="row.status === 1">已上架</el-tag>
            <el-tag v-else type="danger">已下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button size="mini" type="text" @click="deleteChapter(row)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="toggleChapterStatus(row)"
            >
              {{ row.status === 1 ? "下架" : "上架" }}
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="showEditChapterDialog(row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalItems"
      ></el-pagination>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { queryChapters, deleteChapter, toggleChapterStatus } from '@/api/comic'
import { decryptImage } from '@/utils/AES'
interface Chapter {
  id: number
  name: string
  order: number
  thumbnail: string
  pageCount: number
  price: number
  popularity: number
  createdAt: string
  updatedAt: string
  status: number
  thumbnailUrl: string
}

interface SearchForm {
  order?: number
  name?: string
  createdAtFrom?: string
  createdAtTo?: string
  updatedAtFrom?: string
  updatedAtTo?: string
  status?: number
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: string
}

@Component
export default class ChapterManager extends Vue {
  chapters: Chapter[] = [];
  searchForm: SearchForm = {};
  @Prop({ required: true }) title!: string;
  @Prop({ required: true }) comicId!: number;
  isEditMode = this.comicId !== -1;
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  listLoading = false;
  async mounted() {
    this.searchChapters()
  }

  async searchChapters() {
    this.listLoading = true
    try {
      const { list, total } = (
        await queryChapters({
          ...this.searchForm,
          page: this.currentPage,
          pageSize: this.pageSize
        })
      ).data
      this.chapters = list
      const decryptedIcons = await Promise.all(
        this.chapters.map(async(chapter) => {
          return await decryptImage(chapter.thumbnailUrl)
        })
      )

      this.chapters = this.chapters.map((chapter, index) => {
        chapter.thumbnail = decryptedIcons[index]
        return chapter
      })

      this.totalItems = total
      this.listLoading = false
    } catch (error) {
      this.$message.error('查询章节失败')
    }
  }

  handleSizeChange(newSize: number) {
    this.pageSize = newSize
    this.searchChapters()
  }

  handleCurrentChange(newPage: number) {
    this.currentPage = newPage
    this.searchChapters()
  }

  handleSortChange({ prop, order }: { prop: string, order: string }) {
    console.log('wocao')
    this.searchForm.sortBy = prop
    this.searchForm.sortOrder = order
    this.searchChapters()
  }

  resetSearchForm() {
    this.searchForm = {}
  }

  async deleteChapter(row: any) {
    this.$confirm('确定删除该章节吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      await deleteChapter(row.id)
      this.$message.success('删除成功')
      this.searchChapters()
    })
  }

  async toggleChapterStatus(row: any) {
    const action = row.status === 1 ? '下架' : '上架'
    this.$confirm('确定' + action + '该章节吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      await toggleChapterStatus(row.id)
      this.$message.success(action + '成功')
      this.searchChapters()
    })
  }

  // 跳转到章节新增管理页面
  showEditChapterDialog(row: any) {
    const id = row == null ? '-1' : row.id
    this.$router.push({
      name: 'editorChapter',
      params: {
        chapterId: id,
        comicId: this.comicId + '',
        comicTitle: this.title
      }
    })
  }
}
</script>

<style scoped>
.chapter-manager {
  margin-top: 20px;
}
</style>
