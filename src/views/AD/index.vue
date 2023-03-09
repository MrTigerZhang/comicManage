<template>
  <div class="components-container">
    <el-form :model="formData" ref="form" label-width="120px" :rules="rules">
      <el-form-item label="链接" prop="link">
        <el-input v-model="formData.link" placeholder="请输入链接"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="imgUrl">
        <img
          v-if="formData.imgUrl"
          :src="formData.imgUrl"
          width="600"
          height="200"
          @click="previewImg"
        />
        <div />
        <el-button
          type="info"
          icon="el-icon-upload"
          tyle="position: absolute;bottom: 15px;margin-left: 40px;"
          @click="toggleShow"
        >
          {{ formData.imgUrl ? "修改图片" : "上传图片" }}
        </el-button>
        <vue-image-crop-upload
          v-model="showUpload"
          @crop-upload-success="handleSuccess"
          :headers="{
            'X-Access-Token': getToken()
          }"
          url="https://httpbin.org/post"
          :accept="'image/png, image/jpeg, image/gif'"
          :img-format="'png'"
          :img-quality="1"
          :crop-config="{aspectRatio: 16 / 9}"
          :icon="{type: 'md-camera', size: '28px', color: '#8c939d'}"
          :canCrop="false"
          :crop-center="false"
          :max-file-size-in-bytes="5000000"
        ></vue-image-crop-upload>
      </el-form-item>
      <el-form-item label="是否显示" prop="isShow">
        <el-switch v-model="formData.isShow"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="loading"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" width="50%">
      <img :src="formData.imgUrl" style="width: 100%" />
    </el-dialog>
  </div>
</template>
<script>
import { getIndexAd, setIndexAd } from '@/api/settings'
import VueImageCropUpload from 'vue-image-crop-upload'
import { MessageBox } from 'element-ui'
import { UserModule } from '@/store/modules/user'
export default {
  data() {
    return {
      formData: {
        link: '',
        imgUrl: '',
        isShow: false
      },
      loading: false,
      dialogVisible: false,
      rules: {
        link: [{ required: true, message: '链接不能为空', trigger: 'blur' }],
        imgUrl: [{ required: true, message: '请上传图片', trigger: 'change' }]
      },
      showUpload: false
    }
  },
  components: {
    VueImageCropUpload
  },
  async created() {
    // 模拟数据加载
    this.loading = true
    const ad = await (await getIndexAd()).data
    this.formData.link = ad.link
    this.formData.imgUrl = ad.imgUrl
    this.formData.isShow = ad.isShow === 1
    this.loading = false
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          // 提交表单
          await setIndexAd(this.formData)
          this.loading = false
          MessageBox.alert('提交成功', '提示', {
            confirmButtonText: '确定',
            type: 'info'
          })
        } else {
          console.log('error submit!!')
          this.loading = false
        }
      })
    },
    handleSuccess(response) {
      console.log('我日你妈')
      console.log(response.files.avatar)
      this.formData.imgUrl = response.files.avatar
    },
    toggleShow() {
      this.showUpload = !this.showUpload
    },
    previewImg() {
      this.dialogVisible = true
    },
    getToken() {
      return UserModule.token
    }
  }
}
</script>
