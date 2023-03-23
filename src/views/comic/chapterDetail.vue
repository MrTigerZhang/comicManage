<template>
  <div class="components-container">
    <aside>
      当前修改的漫画： {{ comicTitle }}
      <br />
      章节修改后自动更新为下架状态，需要手动重新上架
    </aside>
    <h3>{{ isEditMode ? "编辑章节" : "新增章节" }}</h3>
    <el-form
      ref="chapterForm"
      :model="chapterForm"
      label-width="120px"
      @submit.native.prevent
    >
      <el-form-item
        label="章节名称"
        prop="name"
        :rules="[
          {required: true, message: '请输入章节名称', trigger: 'blur'},
          {
            min: 3,
            max: 15,
            message: '章节名称应为3-15个字',
            trigger: 'blur'
          }
        ]"
      >
        <el-input
          v-model="chapterForm.name"
          @input="updateNameLength"
        ></el-input>
        <div>{{ nameLength }} / 15</div>
      </el-form-item>
      <el-form-item label="章节序号" prop="order">
        <el-input-number v-model="chapterForm.order" :min="1"></el-input-number>
      </el-form-item>

      <el-form-item
        label="缩略图"
        prop="thumbnail"
        :rules="[
          {required: true, message: '请上传缩略图', trigger: 'change'}
        ]"

      >
        <div v-if="chapterForm.thumbnail">
          <el-image
            :src="chapterForm.thumbnail"
            :preview-src-list="[chapterForm.thumbnail]"
            style="width: 150px; height: 150px"
          ></el-image>
        </div>

        <el-button type="text" size="mini" @click="showImageCropDialog"
          >修改图片</el-button
        >
      </el-form-item>

      <el-form-item label="价格">
        <el-input-number v-model="chapterForm.price" :min="0"></el-input-number>
      </el-form-item>

      <el-form-item>
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="saveChapter">保存</el-button>
      </el-form-item>
    </el-form>

    <image-list
      v-if="isEditMode"
      :comicId="comicId"
      :chapterId="chapterId"
    ></image-list>
    <vue-image-crop-upload
      v-model="showCropDialog"
      :output-format="'jpeg'"
      :width="150"
      :height="300"
      @crop-success="cropSuccess"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
    ></vue-image-crop-upload>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import VueImageCropUpload from 'vue-image-crop-upload'
import { getChapterById, addOrUpdateChapter } from '@/api/comic'
import ImageList from './cmps/ImageList.vue'
@Component({
  components: {
    VueImageCropUpload,
    'image-list': ImageList
  }
})
export default class EditChapter extends Vue {
  chapterForm = {
    name: '',
    thumbnail: '',
    pageCount: 1,
    price: 0,
    status: true,
    order: 1,
    chapterId: ''
  };

  isEditMode = false;
  showCropDialog = false;
  comicTitle = '';
  comicId = '';
  nameLength = 0;
  chapterId = '';

  async created() {
    this.comicId = this.$route.params.comicId
    this.comicTitle = this.$route.params.comicTitle
    if (this.$route.params.chapterId !== '-1') {
      this.isEditMode = true
      // 在这里获取章节数据并赋值给 chapterForm
      const data = await getChapterById(this.$route.params.chapterId)
      this.chapterForm = data.data
      this.updateNameLength()
    }
  }

  updateNameLength() {
    this.nameLength = this.chapterForm.name.length
  }

  async saveChapter() {
    this.$confirm('章节修改后自动更新为下架状态，需要手动重新上架', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      // 在这里实现保存章节的逻辑
      const isValid = await (this.$refs.chapterForm as any).validate()
      if (isValid) {
        const result: any = await addOrUpdateChapter(this.chapterForm)

        if (result.code === 20000) {
          this.$message.success('更新成功')
          if (this.isEditMode) {
            // 更新章节逻辑
            console.log('更新章节')
          } else {
            // 新增章节逻辑
            console.log('新增章节')
            // 转换到编辑模式
            this.isEditMode = true
          }
        } else {
          this.$message.error('系统繁忙，请稍后重试')
        }
      } else {
        this.$message.error('表单验证失败，请检查输入项')
      }
    })
  }

  goBack() {
    // 返回上一页面
    this.$router.go(-1)
  }

  showImageCropDialog() {
    this.showCropDialog = true
  }

  cropSuccess(imgDataUrl: string) {
    this.chapterForm.thumbnail = imgDataUrl
    this.showCropDialog = false
  }

  cropUploadSuccess(response: any) {
    console.log('cropUploadSuccess', response)
  }

  cropUploadFail(error: any) {
    console.log('cropUploadFail', error)
  }
}
</script>
