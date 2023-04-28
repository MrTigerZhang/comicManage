<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="dialogTitle"
    width="50%"
    @close="resetForm"
  >
    <el-form :model="formData" ref="form" :rules="rules" label-width="120px">
      <el-form-item label="推荐模块类型" prop="type">
        <el-input
          v-model="formData.type"
          placeholder="请输入推荐模块类型"
        ></el-input>
      </el-form-item>
      <el-form-item label="推荐模块名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入推荐模块名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="图片数量" prop="imgCount">
        <el-input-number v-model="formData.imgCount" :min="1"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { create } from "@/api/recommendations";

export default {
  data() {
    return {
      dialogVisible: false,
      dialogTitle: "",
      formData: {
        id: null,
        type: "",
        name: "",
        imgCount: 1
      },
      rules: {
        type: [
          { required: true, message: "推荐模块类型不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "推荐模块名称不能为空", trigger: "blur" }
        ],
        imgCount: [
          { required: true, message: "图片数量不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    showAddDialog() {
      this.dialogTitle = "添加推荐模块";
      this.dialogVisible = true;
    },
    showEditDialog(row) {
      this.dialogTitle = "编辑推荐模块";
      this.formData = { ...row };
      this.dialogVisible = true;
    },
    resetForm() {
      this.$refs.form.resetFields();
      this.formData = {
        id: null,
        type: "",
        name: "",
        imgCount: 1
      };
    },
    async submitForm() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;

      await create(this.formData);
      this.$message({
        type: "success",
        message: this.formData.id ? "编辑成功!" : "添加成功!"
      });
      this.dialogVisible = false;
      this.resetForm();
      this.$emit("refreshData");
    }
  }
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
