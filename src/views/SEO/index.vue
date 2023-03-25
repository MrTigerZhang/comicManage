<template>
  <div class="components-container">
    <el-form :model="form" ref="form" label-width="120px" :rules="rules">
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
      <el-form-item label="七牛云 AK" prop="qiniu_ak">
        <el-input
          v-model="form.qiniu_ak"
          placeholder="请输入七牛云 AK"
          maxlength="64"
        ></el-input>
      </el-form-item>
      <el-form-item label="七牛云 SK" prop="qiniu_sk">
        <el-input
          v-model="form.qiniu_sk"
          placeholder="请输入七牛云 SK"
          maxlength="64"
        ></el-input>
      </el-form-item>
      <el-form-item label="七牛云 Bucket" prop="qiniu_bucket">
        <el-input
          v-model="form.qiniu_bucket"
          placeholder="请输入七牛云 Bucket"
          maxlength="64"
        ></el-input>
      </el-form-item>
      <el-form-item label="七牛云 Domain" prop="qiniu_domain">
        <el-input
          v-model="form.qiniu_domain"
          placeholder="请输入七牛云 Domain"
          maxlength="64"
        ></el-input>
      </el-form-item>

      <aside>
        在这里配置图片加密，建议开启，可跳过审查，防止被爬
        <br />
      </aside>
      <el-form-item label="启用图片加密">
        <el-switch
          v-model="form.image_encryption_enabled"
          active-text="启用"
          inactive-text="禁用"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="图片加密 Key" prop="image_encryption_key">
        <el-input
          v-model="form.image_encryption_key"
          placeholder="请输入图片加密 Key"
          maxlength="64"
        ></el-input>
      </el-form-item>
      <el-form-item label="图片加密 IV" prop="image_encryption_iv">
        <el-input
          v-model="form.image_encryption_iv"
          placeholder="请输入图片加密 IV"
          maxlength="64"
        ></el-input>
      </el-form-item>
      <aside>
        数据是否加密，请注意，如果开启数据加密，seo就没啥意义了。因为搜索引擎不知道网站是做什么的。
        <br />
      </aside>
      <el-form-item label="启用数据加密">
        <el-switch
          v-model="form.data_encryption_enabled"
          active-text="启用"
          inactive-text="禁用"
        ></el-switch>
      </el-form-item>
      <el-form-item label="数据加密 Key" prop="data_encryption_key">
        <el-input
          v-model="form.data_encryption_key"
          placeholder="请输入数据加密 Key"
          maxlength="64"
        ></el-input>
      </el-form-item>
      <el-form-item label="数据加密 IV" prop="data_encryption_iv">
        <el-input
          v-model="form.data_encryption_iv"
          placeholder="请输入数据加密 IV"
          maxlength="64"
        ></el-input>
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
import { Component, Vue } from 'vue-property-decorator'
import { getSystemInfo, setSystemInfo } from '@/api/settings'
import { MessageBox } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { ElForm } from 'element-ui/types/form'

@Component
export default class SystemInfoPage extends Vue {
  private form: any = {
    title: '',
    description: '',
    keywords: ''
  };

  private loading = false;

  private rules = {
    link: [{ required: true, message: '链接不能为空', trigger: 'blur' }],
    title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
    description: [
      { required: true, message: '描述不能为空', trigger: 'blur' },
      { max: 64, message: '描述不能超过64个字', trigger: 'blur' }
    ],
    keywords: [
      { required: true, message: '关键字不能为空', trigger: 'blur' },
      { max: 64, message: '关键字不能超过64个字', trigger: 'blur' }
    ]
  };

  created() {
    this.loadSystemInfo()
  }

  private async loadSystemInfo() {
    this.loading = true
    const res = await (await getSystemInfo()).data
    this.form = { ...res }
    this.loading = false
  }

  private async submit() {
    if (this.loading) {
      return
    }
    this.loading = true;
    (this.$refs.form as ElForm).validate(async(valid: any) => {
      if (valid) {
        try {
          await setSystemInfo(this.form)
          MessageBox.alert('提交成功', '提示', {
            confirmButtonText: '确定',
            type: 'info'
          })
          this.loading = false
        } catch (error) {
          MessageBox.alert('提交失败，请重试', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
        }
      }
    })
  }
} // class -end
</script>
