<template>
  <!-- 这段代码非常的混乱 请不要学习 -->
  <div class="components-container">
    <aside>
      本系统分类均为一级分类，分类下有若干漫画，漫画下有若干章节，漫画和章节的关系是一对多的关系，分类和漫画的关系是一对多的关。

      <br>
      尺寸为340*200
      <br>
      更新后数据设置为为未启用状态，需要手动启用。
      <br>
      清空缓存后，才可以立即看到效果
    </aside>

    <!-- 添加分类按钮 -->
    <el-button type="primary" @click="openDialog('add')">添加分类</el-button>
    <el-button type="warn" @click="clearCache()">清空缓存</el-button>
    <div style="height: 10px"></div>
    <!-- 分类列表表格 -->

    <el-table
      :data="comicCategories"
      v-loading="listLoading"
      border
      row-key="id"
      ref="form"
      fit
      highlight-current-row
    >
      <el-table-column prop="id" label="分类ID"></el-table-column>
      <el-table-column prop="code" label="分类序号"></el-table-column>
      <el-table-column prop="name" label="分类名称"></el-table-column>
      <el-table-column prop="description" label="分类描述"></el-table-column>
 
      <el-table-column prop="icon" label="分类图标" width="100">
        <template #default="{ row }">
          <el-image
            :src="row.icon"
            :preview-src-list="[row.icon]"
            :fit="'contain'"
            style="width: 50px; height: 50px"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="启用" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="toggle(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="拖拽" width="80">
        <template #default>
          <i class="el-icon-rank handle"></i>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button type="primary" size="mini" @click="openDialog('edit', row)"
            >编辑</el-button
          >
          <el-button type="danger" size="mini" @click="deleteCategory(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      @close="resetDialog"
    >
      <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="分类详情" prop="description">
          <el-input v-model="formData.description"></el-input>
        </el-form-item>
        
        <el-form-item label="分类图标" prop="icon">
          <div @click="showImageCropUpload = !showImageCropUpload">
            <el-image
              v-if="formData.icon"
              :src="formData.icon"
              :preview-src-list="[formData.icon]"
              :fit="'contain'"
              style="width: 50px; height: 50px"
            ></el-image>
            <span v-else class="el-icon-upload"></span>
          </div>
          <image-crop-upload
            :url="uploadUrl"
            :headers="{
              'X-Access-Token': getToken()
            }"
            :width="340"
            :height="200"
            :outputFormat="'png'"
            :scaleRatio="1"
            v-model="showImageCropUpload"
            :field="'file'"
            @crop-upload-success="handleSuccess"
            @crop-cancel="resetImageCropUpload"
          ></image-crop-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDialog">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ComicCategoryData } from "@/api/types";
import VueImageCropUpload from "vue-image-crop-upload";
import { UserModule } from "@/store/modules/user";
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  updateSort,
  toggleStatus,clearCache
} from "@/api/category";
import { Message } from "element-ui";
import Sortable from "sortablejs";
import { decryptImage } from "@/utils/AES";
@Component({
  components: {
    // 在这里注册你需要使用的组件
    "image-crop-upload": VueImageCropUpload
  }
})
export default class ComicCategory extends Vue {
  comicCategories:any=[];
  addCategoryDialogVisible = false;
  newCategory: ComicCategoryData = {};
  showImageCropUpload = false;
  listLoading = true;
  dialogVisible = false;
  dialogTitle = "";
  formData: ComicCategoryData = {};
  uploadUrl = process.env.VUE_APP_BASE_API + "/api/upload";
  submitting = false;
  private sortable: Sortable | null = null;
  rules = {
    name: [{ required: true, message: "分类名称是必填项", trigger: "blur" }],
    description: [
      { required: true, message: "分类详情是必填项", trigger: "blur" }
    ],
    code: [
      { required: true, message: "分类序号是必填项", trigger: "blur" },
      { type: "number", message: "分类序号必须为数值", trigger: "blur" }
    ],
    icon: [
      {
        validator: (rules: any, value: any, callback: any) => {
          if (!this.newCategory.iconUrl) {
            callback(new Error("分类图标是必填项"));
          } else {
            callback();
          }
        },
        trigger: "change"
      }
    ]
  };

  async created() {
    await this.searchCategories();
    this.$nextTick(() => {
      this.setSort();
    });
  }

  // 添加分类
  addCategory() {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    this.addCategoryDialogVisible = true;
    this.submitting = false;
  }

  // 打开添加/编辑对话框
  openDialog(type: string, category?: ComicCategoryData) {
    if (this.submitting) {
      return;
    }
    this.submitting = true;

    if (type === "add") {
      this.dialogTitle = "添加分类";
      this.formData = {};
    } else if (type === "edit") {
      this.dialogTitle = "编辑分类";
      this.formData = { ...category };
      this.newCategory.iconUrl = this.formData.iconUrl;
    }
    this.dialogVisible = true;
    this.submitting = false;
  }

  // 提交添加/编辑对话框
  submitDialog() {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    (this.$refs.form as any).validate(async (valid: boolean) => {
      if (valid) {
        if (this.dialogTitle === "添加分类") {
          this.submitNewCategory();
        } else if (this.dialogTitle === "编辑分类") {
          this.submitUpdateCategory();
        }
      } else {
        Message.warning("表单验证未通过");
      }
      this.submitting = false;
    });
  }

  // 查询方法
  async searchCategories() {
    this.listLoading = true;
   const dataLists:any =(await getCategories({})).data.dataList;
    // 在客户端解密图片
    // 解密图片
    this.comicCategories =  await Promise.all(
     dataLists.map(async (cc: any) => {
       var tmp = cc.icon;
        cc.icon = await decryptImage(cc.iconUrl);
        cc.iconUrl = tmp;
        return cc;
      })
    );

    
    this.listLoading = false;
  }

  // 重置对话框状态
  resetDialog() {
    this.showImageCropUpload = false;
    this.formData = {};
  }

  // 删除分类
  async deleteCategory(category: ComicCategoryData) {
    if (this.submitting) {
      return;
    }

    this.$confirm("确定删除该分类吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(async () => {
      // 在这里实现删除分类的逻辑
      this.submitting = true;
      await deleteCategory({ id: category.id });
      this.submitting = false;
      this.searchCategories();
    });
  }

  // 重置 newCategory 对象
  resetNewCategory() {
    this.newCategory = {};
    this.formData = {};
    (this.$refs.form as any).resetFields();
  }

  resetDialogState() {
    this.showImageCropUpload = false;
  }

  // 新方法：处理图片上传成功
  async handleSuccess(response: any) {

    //判断是否上传成功
    if (response.code !== 200) {
      this.$message.error("上传失败");
       //close upload dialog
      this.showImageCropUpload = false;
      return;
    }

    // 上传后 解密
    this.formData.iconUrl = response.data.key;
    this.newCategory.iconUrl = response.data.key;
    this.formData.icon = await decryptImage(response.data.url as string);
  }

  resetImageCropUpload() {
    this.showImageCropUpload = false;
  }

  async submitNewCategory() {
    // 验证表单
    // 在这里实现提交新分类数据的逻辑，例如调用 API
    try {
      const response = await addCategory({
        name: this.formData.name,
        description: this.formData.description,
        code: this.formData.code,
        icon: this.formData.iconUrl
      });

      this.resetNewCategory();
      this.$message.success("提交成功");
      //关闭弹框 刷新列表
      this.resetDialog();
      this.addCategoryDialogVisible = false;
      this.dialogVisible = false;
      this.searchCategories();
    } catch (error) {
      // 处理错误，例如显示一个错误消息
      console.error(error);
    }
  }

  async submitUpdateCategory() {
    // 验证表单
    // 在这里实现提交新分类数据的逻辑，例如调用 API
    try {
      const response = await updateCategory({
        id: this.formData.id,
        name: this.formData.name,
        description: this.formData.description,
        
        icon: this.formData.iconUrl
      });

      this.resetNewCategory();
      this.$message.success("更新成功");
      //关闭弹框 刷新列表
      this.resetDialog();
      this.addCategoryDialogVisible = false;
      this.dialogVisible = false;
      this.searchCategories();
    } catch (error) {
      // 处理错误，例如显示一个错误消息
      console.error(error);
    }
  }

  async toggle(row: any) {
    //询问是否要设置
    await this.$confirm(
      `确定要${row.status === 1 ? "启用" : "禁用"}该分类吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    )
      .then(async () => {
        await toggleStatus({ id: row.id });

        this.$message.success("设置成功");
      })
      .catch(() => {
        this.$message.info("已取消设置");
      })
      .finally(() => {
        this.searchCategories();
      });
  }

  async clearCache() {
    await clearCache();
    this.$message.success("清除缓存成功");
  }

  getToken() {
    return UserModule.token;
  }

  private setSort() {
    const el = (this.$refs.form as Vue).$el.querySelectorAll(
      ".el-table__body-wrapper > table > tbody"
    )[0] as HTMLElement;
    this.sortable = Sortable.create(el, {
      ghostClass: "sortable-ghost", // Class name for the drop placeholder
      onEnd: async evt => {
        if (
          typeof evt.oldIndex !== "undefined" &&
          typeof evt.newIndex !== "undefined"
        ) {
          if (this.submitting) {
            return;
          }
          console.log("提交排序方法");
          //获取oldIndex 和 newIndex  的id
          const oldId = this.comicCategories[evt.oldIndex].id;
          const newId = this.comicCategories[evt.newIndex].id;
          this.submitting = true;
          await updateSort({ id: oldId, anotherId: newId });
          this.comicCategories = [];
          await this.searchCategories();
          this.submitting = false;
        }
      }
    });
  }
}
</script>

<style scoped>
/* 在这里编写你的样式 */
.el-icon-upload {
  font-size: 50px;
  cursor: pointer;
}
</style>
<style lang="scss">
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>

<style lang="scss" scoped>
.icon-star {
  margin-right: 2px;
}

.draggable-handler {
  cursor: pointer;
}

.show-d {
  margin-top: 15px;
}
</style>
