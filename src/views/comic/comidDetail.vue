<template>
  <div class="components-container">
    <h3>
      {{ isEditMode ? "编辑漫画" : "新增漫画" }}
    </h3>
    <aside>
      新增漫画后 ，刷新页面可以编辑章节内容哦
      <br />
      竖图 ：630X840 横图 : 750X436
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
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标签" prop="labels">
        <el-input
          v-model="mangaForm.label"
          placeholder="请输入标签，用逗号分隔"
          @input="handleTagsInput"
        >
        </el-input>
        <div>
          <el-tag
            v-for="(tag, index) in mangaForm.labels"
            :key="index"
            closable
            @close="handleTagClose(index)"
          >
            {{ tag }}
          </el-tag>
        </div>
      </el-form-item>

      <el-form-item label="作者" prop="authorId">
        <el-select v-model="mangaForm.authorId" placeholder="请选择作者">
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
      <!-- 竖图 -->
      <el-form-item label="竖图" prop="thumbnail">
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
          :url="uploadUrl"
          :headers="{
            'X-Access-Token': getToken()
          }"
          :outputFormat="'png'"
          :scaleRatio="1"
          :autoCrop="false"
          :width="630"
          :height="840"
          v-model="showImageCropUpload"
          :field="'file'"
          @crop-upload-success="uploadSuccess"
          @crop-cancel="resetImageCropUpload"
        ></image-crop-upload>
      </el-form-item>
      <!-- 横图 -->
      <el-form-item label="横图" prop="thumbnail2">
        <div v-if="!mangaForm.thumbnail2">
          <el-button type="primary" @click="showImageCropUpload = true"
            >上传图片</el-button
          >
        </div>
        <div v-else>
          <el-image
            :src="mangaForm.thumbnail2"
            :preview-src-list="[mangaForm.thumbnail2]"
            :fit="'contain'"
            style="width: 100px; height: 100px"
          ></el-image>

          <el-button type="text" @click="showImageCropUpload = true"
            >修改图片</el-button
          >
        </div>
        <image-crop-upload
          ref="imageCropper"
          :url="uploadUrl"
          :headers="{
            'X-Access-Token': getToken()
          }"
          :outputFormat="'png'"
          :scaleRatio="1"
          :autoCrop="false"
          :width="750"
          :height="436"
          v-model="showImageCropUpload"
          :field="'file'"
          @crop-upload-success="uploadSuccess2"
          @crop-cancel="resetImageCropUpload"
        ></image-crop-upload>
      </el-form-item>

      <el-form-item label="连载状态" prop="status">
        <el-select v-model="mangaForm.status" placeholder="请选择">
          <el-option label="连载中" :value="1"></el-option>
          <el-option label="已完结" :value="2"></el-option>
        </el-select>
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
      v-if="isEditMode"
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
  addOrUpdateComic
} from "@/api/comic";
import ChapterManager from "./cmps/ChapterManager.vue";
@Component({
  components: {
    "image-crop-upload": VueImageCropUpload,
    "chapter-manager": ChapterManager // 章节管理组件
  }
})
export default class MangaEditor extends Vue {
  uploadUrl = process.env.VUE_APP_BASE_API + "/api/upload";
  isEditMode = false;
  listLoading = false;
  mangaForm = {
    id: "",
    name: "",
    category: "",
    authorId: "",
    description: "",
    thumbnail: "",
    status: "",
    banned: false,
    labels: [] as string[],
    thumbnailUrl: "",
    thumbnail2: "",
    thumbnailUrl2: "",
    label: ""
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
        trigger: "blur"
      }
    ],
    category: [
      { required: true, message: "漫画分类是必填项", trigger: "change" }
    ],
    author: [
      { required: true, message: "漫画作者是必填项", trigger: "change" }
    ],
    description: [
      { required: true, message: "漫画简介是必填项", trigger: "change" },
      {
        min: 30,
        max: 256,
        message: "漫画简介长度必须在 30 到 256 之间",
        trigger: "blur"
      }
    ],
    status: [
      { required: true, message: "连载状态是必填项", trigger: "change" }
    ],
    thumbnail: [{ required: true, message: "竖图不能为空", trigger: "change" }],
    thumbnail2: [{ required: true, message: "横图不能为空", trigger: "change" }]
  };

  async created() {
    const id: string = this.$route.params.id as string;

    this.categories = await (await getCategorys({})).data;
    this.authors = (await getAuthors({})).data; // 获取作者列表
    //不能使用  !==
    if (id && "-1" != id) {
      this.isEditMode = true;
      this.getComicDetails(id);
    }
  }

  async getComicDetails(id: any) {
    this.listLoading = true;
    const data = (await getComicDetail({ id: id })).data;

    this.mangaForm = data;
    // 由于后端返回的是加密的图片，所以需要解密
    var tmp: string = this.mangaForm.thumbnail;
    if (
      this.mangaForm.thumbnailUrl &&
      this.mangaForm.thumbnailUrl.indexOf("null") == -1
    ) {
      this.mangaForm.thumbnail = await decryptImage(
        this.mangaForm.thumbnailUrl
      );
      this.mangaForm.thumbnailUrl = tmp;
    }

    // 由于后端返回的是加密的图片，所以需要解密
    var tmp2: string = this.mangaForm.thumbnail2;
    if (
      this.mangaForm.thumbnailUrl2 &&
      this.mangaForm.thumbnailUrl2.indexOf("null") == -1
    ) {
      this.mangaForm.thumbnail2 = await decryptImage(
        this.mangaForm.thumbnailUrl2
      );
      this.mangaForm.thumbnailUrl2 = tmp2;
    }

    this.listLoading = false;

    this.handleTagsInput();
  }

  async uploadSuccess(response: any) {
    this.mangaForm.thumbnailUrl = response.data.key;
    this.mangaForm.thumbnail = await decryptImage(response.data.url);
  }

  async uploadSuccess2(response: any) {
    this.mangaForm.thumbnailUrl2 = response.data.key;
    this.mangaForm.thumbnail2 = await decryptImage(response.data.url);
  }

  resetImageCropUpload() {
    this.showImageCropUpload = false;
  }

  async submitForm() {
    (this.$refs.mangaForm as any).validate(async (valid: boolean) => {
      if (valid) {
        const result = await addOrUpdateComic({
          id: this.mangaForm.id,
          name: this.mangaForm.name,
          category: this.mangaForm.category,
          authorId: this.mangaForm.authorId,
          description: this.mangaForm.description,
          thumbnail: this.mangaForm.thumbnailUrl,
          thumbnail2: this.mangaForm.thumbnailUrl2,
          status: this.mangaForm.status,
          banned: this.mangaForm.banned,
          label: this.mangaForm.label,
          enable: 0
        });
        if (result) {
          this.$message.success("提交成功");
          //刷新页面
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
    this.mangaForm.labels = this.mangaForm.label
      .split(",")
      .map((item: string) => item.trim())
      .filter((item: string) => item.length > 0);
  }

  handleTagClose(index: any) {
    this.mangaForm.labels.splice(index, 1);
    this.mangaForm.label = this.mangaForm.labels.join(", ");
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
