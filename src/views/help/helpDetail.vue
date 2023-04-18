<template>
  <div class="components-container">
    <el-form
      :model="helpInfo"
      label-width="120px"
      ref="helpForm"
      :rules="rules"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="helpInfo.title"></el-input>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-upload
          class="upload-list"
          :action="uploadUrl"
          :headers="uploadHeaders"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="helpInfo.imageList"
          :auto-upload="true"
          list-type="picture-card"
          :on-change="handleChange"
          :on-success="handleUploadSuccess"
          v-if="!loading"
        >
          <div v-if="loading">
            <el-spin></el-spin>
          </div>
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input type="textarea" v-model="helpInfo.content"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('helpForm')">{{
          isEdit ? "更新" : "提交"
        }}</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { getHelpInfo, addHelp, updateHelp } from "@/api/help";
import { UserModule } from "@/store/modules/user";
import { decryptImage } from "@/utils/AES";

@Component
export default class HelpAdd extends Vue {
  private helpInfo: any = {};
  // 添加一个loading字段
  private loading = true;

  private rules = {
    title: [{ required: true, message: "请输入标题", trigger: "blur" }],
    content: [{ required: true, message: "请输入内容", trigger: "blur" }]
  };

  private isEdit = false;

  get uploadUrl() {
    return process.env.VUE_APP_BASE_API + "/api/upload";
  }

  get uploadHeaders() {
    return {
      "X-Access-Token": UserModule.token
    };
  }
  created() {
    this.checkIsEdit();
  }

  @Watch("$route.params.id")
  onIdChanged() {
    this.checkIsEdit();
  }

  async checkIsEdit() {
    const id = parseInt(this.$route.params.id, 10);
    if (id !== 0) {
      this.isEdit = true;
      this.helpInfo = (await getHelpInfo({ id: id })).data;

      await this.decryptImageList();
      this.loading = false;
    } else {
      this.isEdit = false;
      this.resetForm();
      this.loading = false;
    }
  }

  async decryptImageList() {
    this.helpInfo.imageList = await Promise.all(
      this.helpInfo.imgList.map(async (image: any) => {
        const decryptedUrl = await decryptImage(image.url);

        return {
          key: image.key,
          url: decryptedUrl
        };
      })
    );
  }

  async submitForm(formName: string) {
    (this.$refs[formName] as any).validate(async (valid: boolean) => {
      if (valid) {
        const data = {
          id: this.helpInfo.id,
          title: this.helpInfo.title,
          content: this.helpInfo.content,
          imgs: this.helpInfo.imageList.map((image: any) => image.key).join(",")
        };
        if (this.isEdit) {
          await updateHelp(data);
          this.$message.success("更新成功");
        } else {
          await addHelp(data);
          this.$message.success("添加成功");
        }
        this.$router.push({ name: "help" });
      } else {
        this.$message.error("表单验证失败");
        return false;
      }
    });
  }

  goBack() {
    this.$router.push({ name: "/help" });
  }

  async handlePreview(file: any) {
    const image = await decryptImage(file.url as string);
    window.open(image);
  }

  handleRemove(file: any, fileList: any[]) {
    this.helpInfo.imageList.forEach((item: any, index: number) => {
      if (item.key === file.key) {
        this.helpInfo.imageList.splice(index, 1);
      }
    });
  }

  handleChange(file: any, fileList: any[]) {
    console.log(file);
    this.helpInfo.imageList = fileList;
  }

  async handleUploadSuccess(response: any, file: any, fileList: any[]) {
    const { key, url } = response.data;
    file.key = key;
    file.url = await decryptImage(url);
  }

  resetForm() {
    this.helpInfo = {
      id: 0,
      createAt: "",
      updateAt: "",
      title: "",
      helpful: 0,
      unhelpful: 0,
      content: "",
      imageList: []
    };
  }
}
</script>

<style scoped>
.help-add {
  width: 60%;
  margin: 0 auto;
}

.upload-list {
  width: 100%;
}
</style>
