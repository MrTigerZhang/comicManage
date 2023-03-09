<template>
  <div class="components-container">
    <el-form :model="form" ref="form" label-width="120px" :rules="rules">
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
