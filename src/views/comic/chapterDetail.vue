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
      v-loading="listLoading"
    >
      <el-form-item
        label="章节名称"
        prop="name"
        :rules="[
          { required: true, message: '请输入章节名称', trigger: 'blur' },
          {
            min: 1,
            max: 15,
            message: '章节名称应为1-15个字',
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
      <el-form-item label="章节序号" prop="chapterNo" v-if="isEditMode">
        <!-- 显示章节序号 不能编辑 -->
        <el-input v-model="chapterForm.chapterNo" disabled></el-input>
      </el-form-item>

      <el-form-item
        label="缩略图"
        :prop="thumbnailUrl"
        :rules="[
          { required: true, message: '请上传缩略图', trigger: 'change' }
        ]"
      >
        <div v-if="chapterForm.thumbnailUrl2">
          <el-image
            :src="chapterForm.thumbnailUrl2"
            :preview-src-list="[chapterForm.thumbnailUrl2]"
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
      :url="uploadUrl"
      :headers="{
        'X-Access-Token': getToken()
      }"
      :field="'file'"
      v-model="showCropDialog"
      :output-format="'jpeg'"
      :width="272"
      :height="160"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
    ></vue-image-crop-upload>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VueImageCropUpload from "vue-image-crop-upload";
import { getChapterById, addOrUpdateChapter, getComicPrice } from "@/api/comic";
import ImageList from "./cmps/ImageList.vue";
import { decryptImage } from "@/utils/AES";
import { UserModule } from "@/store/modules/user";
import { get } from "http";
@Component({
  components: {
    VueImageCropUpload,
    "image-list": ImageList
  }
})
export default class EditChapter extends Vue {
  uploadUrl = process.env.VUE_APP_BASE_API + "/api/upload";

  chapterForm = {
    name: "",
    thumbnail: "",
    thumbnailUrl: "",
    thumbnailUrl2: "",
    pageCount: 1,
    price: 0,
    status: true,
    chapterNo: 1,
    chapterId: ""
  };

  listLoading = false;

  isEditMode = false;
  showCropDialog = false;
  comicTitle = "";
  comicId = "";
  nameLength = 0;
  chapterId = "";

  async created() {
    this.comicId = this.$route.params.comicId;
    this.comicTitle = this.$route.params.comicTitle;
    this.chapterId = this.$route.params.chapterId;

    if (this.comicId == null || this.comicId === "") {
      this.$message.error("漫画ID不能为空");
      this.goBack();
    }

    if (
      this.chapterId != null &&
      this.chapterId !== "" &&
      this.chapterId != "-1"
    ) {
      this.isEditMode = true;
      this.listLoading = true;
      // 在这里获取章节数据并赋值给 chapterForm
      const data = await getChapterById({ id: this.chapterId });
      this.chapterForm = data.data;
      this.chapterForm.thumbnailUrl2 = await decryptImage(
        this.chapterForm.thumbnailUrl
      );
      this.listLoading = false;
      this.updateNameLength();
    } else {
      this.chapterForm.price = (
        await await getComicPrice({ id: this.comicId })
      ).data;
      if(!this.chapterForm.price){
        this.chapterForm.price = 0;
      }
      this.listLoading = false;
    }
  }

  updateNameLength() {
    this.nameLength = this.chapterForm.name.length;
  }

  async saveChapter() {
    this.$confirm(" 确定要更新章节吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(async () => {
      // 在这里实现保存章节的逻辑
      const isValid = await (this.$refs.chapterForm as any).validate();
      if (isValid) {
        //判断图片不能为空
        if (this.chapterForm.thumbnail === "") {
          this.$message.error("请上传缩略图");
          return;
        }
        //开启loading
        this.listLoading = true;

        const result: any = await addOrUpdateChapter({
          id: this.chapterId === "-1" ? null : this.chapterId,
          comicId: this.comicId,
          name: this.chapterForm.name,
          thumbnail: this.chapterForm.thumbnail,
          price: this.chapterForm.price,
          chapterNo: this.chapterForm.chapterNo
        });
        this.listLoading = false;

        if (result.code === 200) {
          this.$message.success("操作成功");
          //跳转到漫画详情页面
          this.$router.push({ name: "editor", params: { id: this.comicId } });
        } else {
          this.$message.error("系统繁忙，请稍后重试");
        }
      } else {
        this.$message.error("表单验证失败，请检查输入项");
      }
    });
  }

  goBack() {
    // 返回上一页面
    this.$router.go(-1);
  }

  showImageCropDialog() {
    this.showCropDialog = true;
  }

  //上传成功后，将返回的图片地址赋值给chapterForm.thumbnailUrl
  async cropUploadSuccess(response: any) {
    //关闭上传对话框
    this.showCropDialog = false;
    if (response.code !== 200) {
      this.$message.error("上传失败，请稍后重试");
      return;
    }
    //开启loading
    this.listLoading = true;
    this.chapterForm.thumbnailUrl2 = await decryptImage(response.data.url);
    this.chapterForm.thumbnail = response.data.key;
    this.listLoading = false;
  }

  cropUploadFail(error: any) {
    console.log("cropUploadFail", error);
  }

  getToken() {
    return UserModule.token;
  }
}
</script>
