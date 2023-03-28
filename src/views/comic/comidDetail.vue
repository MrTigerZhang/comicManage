<template>
  <div class="components-container">
    <h3>
      {{ isEditMode ? "编辑漫画" : "新增漫画" }}
    </h3>
    <aside>
      新增漫画后 ，刷新页面可以编辑章节内容哦
      <br />
    </aside>
    <el-form
      ref="mangaForm"
      :model="mangaForm"
      :rules="rules"
      label-width="100px"
      v-loading="listLoading"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="mangaForm.name"></el-input>
        <div class="word-count">{{ currentNameLength }} / 64</div>
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-select v-model="mangaForm.category" placeholder="请选择">
          <el-option
            v-for="(category, index) in categories"
            :key="index"
            :label="category.label"
            :value="category.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标签" prop="tags">
        <el-input
          v-model="mangaForm.tagsString"
          placeholder="请输入标签，用逗号分隔"
          @input="handleTagsInput"
        >
        </el-input>
        <div>
          <el-tag
            v-for="(tag, index) in mangaForm.tags"
            :key="index"
            closable
            @close="handleTagClose(index)"
          >
            {{ tag }}
          </el-tag>
        </div>
      </el-form-item>

      <el-form-item label="作者" prop="author">
        <el-select v-model="mangaForm.author" placeholder="请选择作者">
          <el-option
            v-for="(author, index) in authors"
            :key="index"
            :label="author.name"
            :value="author.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="简介" prop="description">
        <el-input type="textarea" v-model="mangaForm.description"></el-input>
        <div class="word-count">{{ currentDescriptionLength }} / 256</div>
      </el-form-item>
      <el-form-item label="缩略图" prop="thumbnail">
        <div v-if="!mangaForm.thumbnail">
          <el-button type="primary" @click="showImageCropUpload = true"
            >上传图片</el-button
          >
        </div>
        <div v-else>
          <el-image
            :src="mangaForm.thumbnail"
            :preview-src-list="[mangaForm.thumbnail]"
            :fit="'contain'"
            style="width: 100px; height: 100px"
          ></el-image>

          <el-button type="text" @click="showImageCropUpload = true"
            >修改图片</el-button
          >
        </div>
        <image-crop-upload
          ref="imageCropper"
          url="/api/upload"
          :headers="{
            'X-Access-Token': getToken(),
          }"
          :outputFormat="'png'"
          :scaleRatio="1"
          :autoCrop="false"
          :width="150"
          :height="300"
          v-model="showImageCropUpload"
          :field="'icon'"
          @crop-upload-success="uploadSuccess"
          @crop-cancel="resetImageCropUpload"
        ></image-crop-upload>
      </el-form-item>
      <el-form-item label="连载状态" prop="status">
        <el-select v-model="mangaForm.status" placeholder="请选择">
          <el-option label="连载中" value="1"></el-option>
          <el-option label="已完结" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上架状态">
        <el-switch
          v-model="mangaForm.banned"
          active-text="是"
          inactive-text="否"
        ></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>

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
    <!-- 章节管理组件 -->
    <chapter-manager
      :title="mangaForm.name"
      :comicId="comicId"
    ></chapter-manager>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VueImageCropUpload from "vue-image-crop-upload";
import { decryptImage } from "@/utils/AES";
import { UserModule } from "@/store/modules/user";
import {
  getCategorys,
  getAuthors,
  getComicDetail,
  addOrUpdateComic,
} from "@/api/comic";
import ChapterManager from "./cmps/ChapterManager.vue";
@Component({
  components: {
    "image-crop-upload": VueImageCropUpload,
    "chapter-manager": ChapterManager, // 章节管理组件
  },
})
export default class MangaEditor extends Vue {
  isEditMode = false;
  listLoading = false;
  mangaForm = {
    id: "",
    name: "",
    category: "",
    author: "",
    description: "",
    thumbnail: "",
    status: "",
    banned: false,
    tags: [] as string[],
    tagsString: "",
    thumbnailUrl: "",
  };

  imagePreviewDialogVisible = false;
  showImageCropUpload = false;
  previewImageUrl = "";
  comicId = this.$route.params.id ? parseInt(this.$route.params.id) : -1;
  categories = [];
  authors = []; // 添加一个authors数组来存储作者列表

  rules = {
    name: [
      { required: true, message: "漫画名称是必填项", trigger: "blur" },
      {
        min: 3,
        max: 64,
        message: "漫画名称长度必须在 3 到 64 之间",
        trigger: "blur",
      },
    ],
    category: [
      { required: true, message: "漫画分类是必填项", trigger: "change" },
    ],
    author: [
      { required: true, message: "漫画作者是必填项", trigger: "change" },
    ],
    description: [
      { required: true, message: "漫画简介是必填项", trigger: "change" },
      {
        min: 30,
        max: 256,
        message: "漫画简介长度必须在 30 到 256 之间",
        trigger: "blur",
      },
    ],
    status: [
      { required: true, message: "连载状态是必填项", trigger: "change" },
    ],
    thumbnail: [
      { required: true, message: "缩略图不能为空", trigger: "change" },
    ],
  };

  async created() {
    const id:string = this.$route.params.id as string;

    this.categories = await (await getCategorys({})).data;
    this.authors = (await getAuthors({})).data; // 获取作者列表
    console.log(id);
    //不能使用  !==
    if (id &&  "-1" != id) {
      this.isEditMode = true;
      this.getComicDetails(id);
    }
  }

  async getComicDetails(id: any) {
    this.listLoading = true;
    const data = (await getComicDetail(id)).data;

    this.mangaForm = data;
    this.mangaForm.thumbnail = await decryptImage(this.mangaForm.thumbnailUrl);
    this.listLoading = false;
  }

  async uploadSuccess(response: any) {
    this.mangaForm.thumbnailUrl = response.data;
    this.mangaForm.thumbnail = await decryptImage(this.mangaForm.thumbnailUrl);
  }

  resetImageCropUpload() {
    this.showImageCropUpload = false;
  }

  async submitForm() {
    (this.$refs.mangaForm as any).validate(async (valid: boolean) => {
      if (valid) {
        const result = await addOrUpdateComic(this.mangaForm);
        if (result) {
          this.$message.success("添加成功");
          // 关闭当前页面并导航到目标页面（例如，返回到漫画列表页）
          this.$router.go(0);
          this.mangaForm.id = result.data.comicId;
          this.comicId = result.data.comicId;
          this.isEditMode = true;
        } else {
          this.$message.error("添加失败");
        }
      }
    });
  }

  handleTagsInput() {
    this.mangaForm.tags = this.mangaForm.tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }

  handleTagClose(index: any) {
    this.mangaForm.tags.splice(index, 1);
    this.mangaForm.tagsString = this.mangaForm.tags.join(", ");
  }

  get currentDescriptionLength(): number {
    return this.mangaForm.description.length;
  }

  get currentNameLength(): number {
    return this.mangaForm.name.length;
  }

  getToken() {
    return UserModule.token;
  }
}
</script>

<style scoped>
.manga-editor {
  padding: 20px;
}
.word-count {
  color: #999;
}
</style>
