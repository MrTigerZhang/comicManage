<template>
  <div class="components-container">
    <h3>
      {{ isEditMode ? "编辑漫画" : "新增漫画" }}
    </h3>
    <aside>
      新增漫画后 ，刷新页面可以编辑章节内容哦
      <br />
      竖图 ：630X840 横图 : 750X436 方图 ：532 *532
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
          <el-button type="primary" @click="showImageCropUpload1 = true"
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

          <el-button type="text" @click="showImageCropUpload1 = true"
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
          v-model="showImageCropUpload1"
          :field="'file'"
          @crop-upload-success="uploadSuccess"
          @crop-cancel="resetImageCropUpload"
        ></image-crop-upload>
      </el-form-item>
      <!-- 横图 -->
      <el-form-item label="横图" prop="thumbnail2">
        <div v-if="!mangaForm.thumbnail2">
          <el-button type="primary" @click="showImageCropUpload2 = true"
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

          <el-button type="text" @click="showImageCropUpload2 = true"
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
          :height="432"
          v-model="showImageCropUpload2"
          :field="'file'"
          @crop-upload-success="uploadSuccess2"
          @crop-cancel="resetImageCropUpload"
        ></image-crop-upload>
      </el-form-item>

      <!-- 方图 -->
      <el-form-item label="方图" prop="thumbnail3">
        <div v-if="!mangaForm.thumbnail3">
          <el-button type="primary" @click="showImageCropUpload3 = true"
            >上传图片</el-button
          >
        </div>
        <div v-else>
          <el-image
            :src="mangaForm.thumbnail3"
            :preview-src-list="[mangaForm.thumbnail3]"
            :fit="'contain'"
            style="width: 100px; height: 100px"
          ></el-image>

          <el-button type="text" @click="showImageCropUpload3 = true"
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
          :width="532"
          :height="532"
          v-model="showImageCropUpload3"
          :field="'file'"
          @crop-upload-success="uploadSuccess3"
          @crop-cancel="resetImageCropUpload"
        ></image-crop-upload>
      </el-form-item>

      <el-form-item label="连载状态" prop="status">
        <el-select v-model="mangaForm.status" placeholder="请选择">
          <el-option label="连载中" :value="1"></el-option>
          <el-option label="已完结" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <aside v-if="isEditMode">
        批量设置章节收费 从第几章开始收费，每章节的费用
      </aside>
      <!-- 开始收费章节 输入从第几章开始收费 -->
      <el-form-item label="开始收费" prop="fromFee" v-if="isEditMode">
        <el-input v-model="mangaForm.fromFee"></el-input>
      </el-form-item>
      <!-- 收费章节的费用，开始收费章节不等于0时，该值必填，并且显示，否则隐藏 -->
      <el-form-item
        label="收费章节费用"
        prop="fee"
        v-if="isEditMode && mangaForm.fromFee && mangaForm.fromFee != 0"
      >
        <el-input v-model="mangaForm.fee"></el-input>
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
    thumbnail: "" as string | null,
    status: "",
    banned: false,
    labels: [] as string[],
    thumbnailUrl: "" as string | null,
    thumbnail2: "" as string | null,
    thumbnailUrl2: "" as string | null,
    thumbnail3: ""  as string | null,
    thumbnailUrl3: "" as string | null,
    label: "",
    fee: 0,
    fromFee: 0
  };

  imagePreviewDialogVisible = false;
  showImageCropUpload1 = false;
  showImageCropUpload2 = false;
  showImageCropUpload3 = false;

  previewImageUrl = "";
  comicId = this.$route.params.id ? parseInt(this.$route.params.id) : -1;
  categories = [];
  authors = []; // 添加一个authors数组来存储作者列表

  rules = {
    name: [
      { required: true, message: "漫画名称是必填项", trigger: "blur" },
      {
        min: 1,
        max: 64,
        message: "漫画名称长度必须在 1 到 64 之间",
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
        min: 10,
        max: 256,
        message: "漫画简介长度必须在 10 到 256 之间",
        trigger: "blur"
      }
    ],
    status: [
      { required: true, message: "连载状态是必填项", trigger: "change" }
    ],
    thumbnail: [{ required: true, message: "竖图不能为空", trigger: "change" }],
    thumbnail2: [
      { required: true, message: "横图不能为空", trigger: "change" }
    ],
    thumbnail3: [{ required: true, message: "方图不能为空", trigger: "change" }]
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
    this.mangaForm.fromFee = data.freeUntil + 1;
    // 由于后端返回的是加密的图片，所以需要解密
    var tmp: string|null = this.mangaForm.thumbnail;
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
    var tmp2: string|null = this.mangaForm.thumbnail2;
    if (
      this.mangaForm.thumbnailUrl2 &&
      this.mangaForm.thumbnailUrl2.indexOf("null") == -1
    ) {
      this.mangaForm.thumbnail2 = await decryptImage(
        this.mangaForm.thumbnailUrl2
      );
      this.mangaForm.thumbnailUrl2 = tmp2;
    }

    // 由于后端返回的是加密的图片，所以需要解密
    var tmp3: string|null = this.mangaForm.thumbnail3;
    if (
      this.mangaForm.thumbnailUrl3 &&
      this.mangaForm.thumbnailUrl3.indexOf("null") == -1
    ) {
      this.mangaForm.thumbnail3 = await decryptImage(
        this.mangaForm.thumbnailUrl3
      );
      this.mangaForm.thumbnailUrl3 = tmp3;
    }

    this.listLoading = false;

    this.handleTagsInput();
  }

  async uploadSuccess(response: any) {
    this.listLoading = true;
    this.showImageCropUpload1 = false;
    this.listLoading = false;
    if (response.code != 200) {
      this.$message.error("上传失败");
      console.log("上传失败");
      return;
    }
    this.mangaForm.thumbnailUrl = response.data.key;
    this.mangaForm.thumbnail = await decryptImage(response.data.url);
  }

  async uploadSuccess2(response: any) {
    this.listLoading = true;
    this.showImageCropUpload2 = false;
    this.listLoading = false;
    if (response.code != 200) {
      this.$message.error("上传失败");
      return;
    }
    this.mangaForm.thumbnailUrl2 = response.data.key;
    this.mangaForm.thumbnail2 = await decryptImage(response.data.url);
  }

  async uploadSuccess3(response: any) {
    this.listLoading = true;
    this.showImageCropUpload3 = false;
    this.listLoading = false;
    if (response.code != 200) {
      this.$message.error("上传失败");
      return;
    }
    this.mangaForm.thumbnailUrl3 = response.data.key;
    this.mangaForm.thumbnail3 = await decryptImage(response.data.url);
  }

  resetImageCropUpload() {
    this.showImageCropUpload1 = false;
    this.showImageCropUpload2 = false;
    this.showImageCropUpload3 = false;
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
          thumbnail3: this.mangaForm.thumbnailUrl3,
          status: this.mangaForm.status,
          banned: this.mangaForm.banned,
          label: this.mangaForm.label,
          fee: this.mangaForm.fee,
          fromFee: this.mangaForm.fromFee,
          enable: 0
        });
        if (result) {
          this.$message.success("提交成功");
          //刷新页面
          this.$router.push({ name: "comic" });
          this.mangaForm.id = result.data.comicId;
          this.comicId = result.data.comicId;
          this.isEditMode = true;
          //跳转到漫画列表页面
          this.$router.push({ name: "comic" });
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
