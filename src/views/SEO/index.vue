<template>
  <div class="components-container">
    <el-form
      :model="form"
      ref="form"
      label-width="120px"
      :rules="rules"
      v-loading="loading"
    >
      <aside>
        网站的seo数据
        <br />
      </aside>
      <el-form-item label="网站名称" prop="title">
        <el-input
          v-model="form.title"
          placeholder="请输入网站名称"
          maxlength="64"
        ></el-input>
      </el-form-item>
      <el-form-item label="网站描述" prop="description">
        <el-input
          type="textarea"
          v-model="form.description"
          placeholder="请输入网站描述，最多64字"
          maxlength="64"
        ></el-input>
      </el-form-item>
      <el-form-item label="SEO关键字" prop="keywords">
        <el-input
          type="textarea"
          v-model="form.keywords"
          placeholder="请输关键词，使用分号分割"
          maxlength="64"
        ></el-input>
      </el-form-item>
      <aside>
        数据存储相关的配置
        <br />
      </aside>
      <el-form-item label="七牛云 AK" prop="qiniuAk">
        <el-input
          v-model="form.qiniuAk"
          placeholder="请输入七牛云 AK"
          maxlength="64"
        ></el-input>
      </el-form-item>
      <el-form-item label="七牛云 SK" prop="qiniuSk">
        <el-input
          v-model="form.qiniuSk"
          placeholder="请输入七牛云 SK"
          maxlength="64"
        ></el-input>
      </el-form-item>
      <el-form-item label="七牛云 Bucket" prop="qiniuBucket">
        <el-input
          v-model="form.qiniuBucket"
          placeholder="请输入七牛云 Bucket"
          maxlength="64"
        ></el-input>
      </el-form-item>
      <el-form-item label="七牛云 Domain" prop="qiniuDomain">
        <el-input
          v-model="form.qiniuDomain"
          placeholder="请输入七牛云 Domain"
          maxlength="64"
        ></el-input>
      </el-form-item>

      <aside>
        在这里配置图片加密，建议开启，可跳过审查，防止被爬.请勿随意修改图片加密开关，频繁切换会有图片无法显示的问题
        <br />
      </aside>
      <el-form-item label="启用图片加密">
        <el-switch
          v-model="form.imageEncryptionEnabled"
          active-text="启用"
          inactive-text="禁用"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="图片加密 Key" prop="imageEncryptionKey">
        <el-input
          v-model="form.imageEncryptionKey"
          placeholder="请输入图片加密 Key"
          maxlength="64"
        ></el-input>
      </el-form-item>
      <el-form-item label="图片加密 IV" prop="imageEncryptionIv">
        <el-input
          v-model="form.imageEncryptionIv"
          placeholder="请输入图片加密 IV"
          maxlength="64"
        ></el-input>
      </el-form-item>
      <aside>
        数据是否加密，请注意，如果开启数据加密，seo就没啥意义了。因为搜索引擎不知道网站是做什么的。
        <br />
      </aside>
      <el-form-item label="启用数据加密" prop="dataEncryptionEnabled">
        <el-switch
          v-model="form.dataEncryptionEnabled"
          active-text="启用"
          inactive-text="禁用"
        ></el-switch>
      </el-form-item>
      <el-form-item label="数据加密 Key" prop="dataEncryptionKey">
        <el-input
          v-model="form.dataEncryptionKey"
          placeholder="请输入数据加密 Key"
          maxlength="64"
        ></el-input>
      </el-form-item>
      <el-form-item label="数据加密 IV" prop="dataEncryptionIv">
        <el-input
          v-model="form.dataEncryptionIv"
          placeholder="请输入数据加密 IV"
          maxlength="64"
        ></el-input>
      </el-form-item>
      <aside>
        默认字段
        <br />
      </aside>
      <el-form-item label="默认用户名称" prop="defaultUserName">
        <el-input
          v-model="form.defaultUserName"
          placeholder="请输入默认用户名称"
          maxlength="64"
        ></el-input>
      </el-form-item>
      <el-form-item label="默认作者头像" prop="defaultAuthorAvatar">
        <el-image
          v-if="form.defaultAuthorAvatarUrl"
          :src="form.defaultAuthorAvatarUrl"
          :preview-src-list="[form.defaultAuthorAvatarUrl]"
        ></el-image>
        <el-button
          type="warning"
          @click="showImageCropUpload1 = !showImageCropUpload1"
          >修改图片</el-button
        >
        <image-crop-upload
          :url="uploadUrl"
          :headers="{
            'X-Access-Token': getToken()
          }"
          :width="300"
          :height="300"
          :outputFormat="'png'"
          :scaleRatio="1"
          v-model="showImageCropUpload1"
          :field="'file'"
          @crop-upload-success="handleSuccess1"
          @crop-cancel="resetImageCropUpload1"
        ></image-crop-upload>
      </el-form-item>

      <el-form-item label="默认用户头像" prop="defaultUserAvatar">
        <el-image
          v-if="form.defaultUserAvatarUrl"
          :src="form.defaultUserAvatarUrl"
          :preview-src-list="[form.defaultUserAvatarUrl]"
        ></el-image>
        <el-button
          type="warning"
          @click="showImageCropUpload2 = !showImageCropUpload2"
          >修改图片</el-button
        >
        <image-crop-upload
          :url="uploadUrl"
          :headers="{
            'X-Access-Token': getToken()
          }"
          :width="300"
          :height="300"
          :outputFormat="'png'"
          :scaleRatio="1"
          v-model="showImageCropUpload2"
          :field="'file'"
          @crop-upload-success="handleSuccess2"
          @crop-cancel="resetImageCropUpload2"
        ></image-crop-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit" :loading="loading"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getSystemInfo, setSystemInfo } from "@/api/settings";
import { MessageBox } from "element-ui";
import { ElForm } from "element-ui/types/form";
import { UserModule } from "@/store/modules/user";
import { decryptImage } from "@/utils/AES";
import VueImageCropUpload from "vue-image-crop-upload";

@Component({
  components: {
    // 在这里注册你需要使用的组件
    "image-crop-upload": VueImageCropUpload
  }
})
export default class SystemInfoPage extends Vue {
  uploadUrl = process.env.VUE_APP_BASE_API + "/api/upload";
  private form: any = {
    link: "",
    title: "",
    description: "",
    keywords: "",
    qiniuAk: "",
    qiniuSk: "",
    qiniuBucket: "",
    qiniuDomain: "",
    imageEncryptionEnabled: 0,
    imageEncryptionKey: "",
    imageEncryptionIv: "",
    dataEncryptionEnabled: 0,
    dataEncryptionKey: "",
    dataEncryptionIv: "",
    defaultUserName: "",
    defaultAuthorAvatar: "",
    defaultAuthorAvatarUrl: "",
    defaultUserAvatar: "",
    defaultUserAvatarUrl: ""
  };

  private showImageCropUpload1 = false;
  private showImageCropUpload2 = false;
  private loading = false;

  private rules = {
    link: [{ required: true, message: "链接不能为空", trigger: "blur" }],
    title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
    description: [
      { required: true, message: "描述不能为空", trigger: "blur" },
      { max: 64, message: "描述不能超过64个字", trigger: "blur" }
    ],
    keywords: [
      { required: true, message: "关键字不能为空", trigger: "blur" },
      { max: 64, message: "关键字不能超过64个字", trigger: "blur" }
    ],
    qiniuAk: [
      { required: true, message: "七牛云 AK 不能为空", trigger: "blur" }
    ],
    qiniuSk: [
      { required: true, message: "七牛云 SK 不能为空", trigger: "blur" }
    ],
    qiniuBucket: [
      { required: true, message: "七牛云 Bucket 不能为空", trigger: "blur" }
    ],
    qiniuDomain: [
      { required: true, message: "七牛云 Domain 不能为空", trigger: "blur" }
    ],
    imageEncryptionKey: [
      { required: true, message: "图片加密 Key 不能为空", trigger: "blur" },
      //长度必须为16个字节
      { min: 16, message: "图片加密 Key 长度必须为16个字节", trigger: "blur" },
      { max: 16, message: "图片加密 Key 长度必须为16个字节", trigger: "blur" }
    ],
    imageEncryptionIv: [
      { required: true, message: "图片加密 IV 不能为空", trigger: "blur" },
      //长度必须为16个字节
      { min: 16, message: "图片加密 IV 长度必须为16个字节", trigger: "blur" },
      { max: 16, message: "图片加密 IV 长度必须为16个字节", trigger: "blur" }
    ],
    dataEncryptionKey: [
      { required: true, message: "数据加密 Key 不能为空", trigger: "blur" },
      //长度必须为16个字节
      { min: 16, message: "数据加密 Key 长度必须为16个字节", trigger: "blur" },
      { max: 16, message: "数据加密 Key 长度必须为16个字节", trigger: "blur" }
    ],
    dataEncryptionIv: [
      { required: true, message: "数据加密 IV 不能为空", trigger: "blur" },
      //长度必须为16个字节
      { min: 16, message: "数据加密 IV 长度必须为16个字节", trigger: "blur" },
      { max: 16, message: "数据加密 IV 长度必须为16个字节", trigger: "blur" }
    ],
    defaultUserName: [
      { required: true, message: "默认用户名称不能为空", trigger: "blur" },
      { max: 64, message: "默认用户名称不能超过64个字", trigger: "blur" }
    ],
    defaultAuthorAvatar: [
      { required: true, message: "默认作者头像不能为空", trigger: "blur" }
    ],
    defaultUserAvatar: [
      { required: true, message: "默认用户头像不能为空", trigger: "blur" }
    ]
  };

  created() {
    this.loadSystemInfo();
  }

  private async loadSystemInfo() {
    this.loading = true;
    const res = await (await getSystemInfo()).data;
    this.form = {
      id: res.id,
      link: res.link,
      title: res.title,
      description: res.description,
      keywords: res.keywords,
      qiniuAk: res.qiniuAk,
      qiniuSk: res.qiniuSk,
      qiniuBucket: res.qiniuBucket,
      qiniuDomain: res.qiniuDomain,
      imageEncryptionEnabled: res.imageEncryptionEnabled == 1,
      imageEncryptionKey: res.imageEncryptionKey,
      imageEncryptionIv: res.imageEncryptionIv,
      dataEncryptionEnabled: res.dataEncryptionEnabled == 1,
      dataEncryptionKey: res.dataEncryptionKey,
      dataEncryptionIv: res.dataEncryptionIv,
      defaultUserName: res.defaultUserName,
      defaultAuthorAvatar: res.defaultAuthorAvatar,
      defaultAuthorAvatarUrl: await decryptImage(res.defaultAuthorAvatarUrl),
      defaultUserAvatar: res.defaultUserAvatar,
      defaultUserAvatarUrl: await decryptImage(res.defaultUserAvatarUrl)
    };
    this.loading = false;
  }
  getToken() {
    return UserModule.token;
  }
  resetImageCropUpload1() {
    this.showImageCropUpload1 = false;
  }
  resetImageCropUpload2() {
    this.showImageCropUpload2 = false;
  }
  async handleSuccess2(res: any) {
    this.showImageCropUpload2 = false;
    if (res.code != 200) {
      MessageBox.alert("上传失败，请重试", "提示", {
        confirmButtonText: "确定",
        type: "error"
      });
      return;
    }
    this.form.defaultUserAvatar = res.data.key;
    this.form.defaultUserAvatarUrl = await decryptImage(res.data.url);
  }
  async handleSuccess1(res: any) {
    this.showImageCropUpload1 = false;
    if (res.code != 200) {
      MessageBox.alert("上传失败，请重试", "提示", {
        confirmButtonText: "确定",
        type: "error"
      });
      return;
    }
    this.form.defaultAuthorAvatar = res.data.key;
    this.form.defaultAuthorAvatarUrl = await decryptImage(res.data.url);
  }

  private async submit() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    (this.$refs.form as ElForm).validate(async (valid: any) => {
      if (valid) {
        try {
          await setSystemInfo({
            id: this.form.id,
            link: this.form.link,
            title: this.form.title,
            description: this.form.description,
            keywords: this.form.keywords,
            qiniuAk: this.form.qiniuAk,
            qiniuSk: this.form.qiniuSk,
            qiniuBucket: this.form.qiniuBucket,
            qiniuDomain: this.form.qiniuDomain,
            imageEncryptionEnabled: this.form.imageEncryptionEnabled ? 1 : 0,
            imageEncryptionKey: this.form.imageEncryptionKey,
            imageEncryptionIv: this.form.imageEncryptionIv,
            dataEncryptionEnabled: this.form.dataEncryptionEnabled ? 1 : 0,
            dataEncryptionKey: this.form.dataEncryptionKey,
            dataEncryptionIv: this.form.dataEncryptionIv,
            defaultUserName: this.form.defaultUserName,
            defaultAuthorAvatar: this.form.defaultAuthorAvatar,
            defaultUserAvatar: this.form.defaultUserAvatar
          });
          MessageBox.alert("提交成功", "提示", {
            confirmButtonText: "确定",
            type: "info"
          });

          UserModule.GetSystemConfig();

          this.loading = false;
        } catch (error) {
          MessageBox.alert("提交失败，请重试", "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        }
      } else {
        this.loading = false;
      }
    });
  }
} // class -end
</script>
