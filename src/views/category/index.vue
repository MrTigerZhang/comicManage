<template>
  <div class="components-container">
    <!-- 添加分类按钮 -->
    <el-button type="primary" @click="openDialog('add')">添加分类</el-button>
    <div style="height: 10px"></div>
    <!-- 分类列表表格 -->

    <el-table
      :data="comicCategories"
      border
      row-key="id"
      ref="form"
      fit
      highlight-current-row
    >
      <el-table-column prop="id" label="分类ID"></el-table-column>
      <el-table-column prop="name" label="分类名称"></el-table-column>
      <el-table-column prop="description" label="分类详情"></el-table-column>
      <el-table-column prop="code" label="分类序号"></el-table-column>

      <el-table-column prop="icon" label="分类图标" width="100">
        <template #default="{row}">
          <el-image
            :src="row.icon"
            :preview-src-list="[row.icon]"
            :fit="'contain'"
            style="width: 50px; height: 50px"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{row}">
          <el-switch
            v-model="row.status"
            active-value="active"
            inactive-value="inactive"
            @change="updateCategory(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="拖拽" width="80">
        <template #default>
          <i class="el-icon-rank handle"></i>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template #default="{row}">
          <el-button type="primary" size="mini" @click="openDialog('edit', row)"
            >编辑</el-button
          >
          <el-button type="danger" size="mini" @click="deleteCategory(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      @close="resetDialog"
    >
      <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="分类详情" prop="description">
          <el-input v-model="formData.description"></el-input>
        </el-form-item>
        <el-form-item label="分类序号" prop="code">
          <el-input v-model.number="formData.code"></el-input>
        </el-form-item>
        <el-form-item label="分类图标" prop="icon">
          <div @click="showImageCropUpload = !showImageCropUpload">
            <el-image
              v-if="formData.icon"
              :src="formData.icon"
              :preview-src-list="[formData.icon]"
              :fit="'contain'"
              style="width: 50px; height: 50px"
            ></el-image>
            <span v-else class="el-icon-upload"></span>
          </div>
          <image-crop-upload
            url="https://httpbin.org/post"
            :width="150"
            :height="150"
            :outputFormat="'png'"
            :scaleRatio="0.1"
            v-model="showImageCropUpload"
            :field="'icon'"
            @crop-success="cropSuccess"
            @crop-cancel="resetImageCropUpload"
          ></image-crop-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDialog">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ComicCategoryData } from '@/api/types'
import VueImageCropUpload from 'vue-image-crop-upload'
import {
  addCategory,
  getCategories,
  deleteCategory,
  updateSort
} from '@/api/category'
import { Message } from 'element-ui'
import Sortable from 'sortablejs'
@Component({
  components: {
    // 在这里注册你需要使用的组件
    'image-crop-upload': VueImageCropUpload
  }
})
export default class ComicCategory extends Vue {
  comicCategories: ComicCategoryData[] = [];
  addCategoryDialogVisible = false;
  newCategory: ComicCategoryData = {};
  showImageCropUpload = false;

  dialogVisible = false;
  dialogTitle = '';
  formData: ComicCategoryData = {};

  submitting = false;
  private sortable: Sortable | null = null;
  rules = {
    name: [{ required: true, message: '分类名称是必填项', trigger: 'blur' }],
    description: [
      { required: true, message: '分类详情是必填项', trigger: 'blur' }
    ],
    code: [
      { required: true, message: '分类序号是必填项', trigger: 'blur' },
      { type: 'number', message: '分类序号必须为数值', trigger: 'blur' }
    ],
    icon: [
      {
        validator: (rules: any, value: any, callback: any) => {
          if (!this.newCategory.icon) {
            callback(new Error('分类图标是必填项'))
          } else {
            callback()
          }
        },
        trigger: 'change'
      }
    ]
  };

  async mounted() {
    this.comicCategories = (await getCategories({})).data.list
    this.$nextTick(() => {
      this.setSort()
    })
  }

  // 添加分类
  addCategory() {
    if (this.submitting) {
      return
    }
    this.submitting = true
    this.addCategoryDialogVisible = true
    this.submitting = false
  }

  // 打开添加/编辑对话框
  openDialog(type: string, category?: ComicCategoryData) {
    if (this.submitting) {
      return
    }
    this.submitting = true

    if (type === 'add') {
      this.dialogTitle = '添加分类'
      this.formData = {}
    } else if (type === 'edit') {
      this.dialogTitle = '编辑分类'
      this.formData = { ...category }
    }
    this.dialogVisible = true
    this.submitting = false
  }

  // 提交添加/编辑对话框
  submitDialog() {
    if (this.submitting) {
      return
    }
    this.submitting = true;
    (this.$refs.form as any).validate(async(valid: boolean) => {
      if (valid) {
        if (this.dialogTitle === '添加分类') {
          this.submitNewCategory()
        } else if (this.dialogTitle === '编辑分类') {
          this.updateCategory(this.formData)
        }
      } else {
        Message.warning('表单验证未通过')
      }
      this.submitting = false
    })
  }

  // 重置对话框状态
  resetDialog() {
    this.showImageCropUpload = false
    this.formData = {}
  }

  // 更新分类
  async updateCategory(row: ComicCategoryData) {
    // 在这里实现更新
    console.log(row)
  }

  // 删除分类
  async deleteCategory(category: ComicCategoryData) {
    if (this.submitting) {
      return
    }
    this.submitting = true
    // 在这里实现删除分类的逻辑
    await deleteCategory(category.id)
    this.submitting = false
  }

  // 重置 newCategory 对象
  resetNewCategory() {
    this.newCategory = {}
  }

  resetDialogState() {
    this.showImageCropUpload = false
  }

  // 新方法：处理图片裁剪成功
  async cropSuccess(imgDataUrl: string) {
    this.newCategory.icon = imgDataUrl
    this.formData.icon = imgDataUrl
  }

  resetImageCropUpload() {
    this.showImageCropUpload = false
  }

  async submitNewCategory() {
    // 验证表单

    // 在这里实现提交新分类数据的逻辑，例如调用 API
    try {
      const response = await addCategory(this.newCategory)
      this.comicCategories.push(response.data)
      this.addCategoryDialogVisible = false
      this.resetNewCategory()
    } catch (error) {
      // 处理错误，例如显示一个错误消息
      console.error(error)
    }
  }

  private setSort() {
    const el = (this.$refs.form as Vue).$el.querySelectorAll(
      '.el-table__body-wrapper > table > tbody'
    )[0] as HTMLElement
    this.sortable = Sortable.create(el, {
      ghostClass: 'sortable-ghost', // Class name for the drop placeholder
      onEnd: async(evt) => {
        if (
          typeof evt.oldIndex !== 'undefined' &&
          typeof evt.newIndex !== 'undefined'
        ) {
          if (this.submitting) {
            return
          }
          console.log('提交排序方法')
          this.submitting = true
          await updateSort({ from: evt.oldIndex, to: evt.newIndex })
          this.comicCategories = []
          this.comicCategories = (await getCategories({})).data.list
          this.submitting = false
        }
      }
    })
  }
}
</script>

<style scoped>
/* 在这里编写你的样式 */
.el-icon-upload {
  font-size: 50px;
  cursor: pointer;
}
</style>
<style lang="scss">
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>

<style lang="scss" scoped>
.icon-star {
  margin-right: 2px;
}

.draggable-handler {
  cursor: pointer;
}

.show-d {
  margin-top: 15px;
}
</style>
