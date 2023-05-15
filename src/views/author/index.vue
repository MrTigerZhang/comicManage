<template>
  <div class="components-container">
    <aside>
      作者与漫画是一对多的关系。每个漫画只能有一个作者。
      </br>
      多人协作的漫画，可以创建一个新的作者署名，例如作者名叫：张三与李四
    </aside>
    <!-- 查询表单 -->
    <el-form
      ref="searchForm"
      :model="searchForm"
      class="search"
      inline
      label-width="80px"
    >
      <el-form-item label="作者名字">
        <el-input v-model="searchForm.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="searchForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="创建日期">
        <el-date-picker
          v-model="searchForm.createDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchAuthors">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="openDialog('add')"
          >新增作者</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 作者列表 -->
    <el-table
      :data="authors"
      border
      style="width: 100%"
      v-loading="listLoading"
    >
      <el-table-column prop="icon" label="头像ICON">
        <template #default="{ row }">
          <div>
            <el-image
              :src="row.icon"
              :preview-src-list="[row.icon]"
              :fit="'contain'"
              style="width: 50px; height: 50px"
            ></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="作者名字"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="createDate" label="创建日期"></el-table-column>
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="toggleAuthorStatus(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="mini"
            @click="openDialog('edit', row)"
          >
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="deleteAuthor(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 20px"
    ></el-pagination>

    <!-- 添加/编辑作者对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      @close="resetDialog"
    >
      <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="头像" prop="icon">
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
              'X-Access-Token': getToken(),
            }"
            :width="300"
            :height="300"
            :outputFormat="'png'"
            :scaleRatio="1"
            v-model="showImageCropUpload"
            :field="'file'"
            @crop-upload-success="uploadSuccess"
            @crop-cancel="resetImageCropUpload"
          ></image-crop-upload>
        </el-form-item>
        <el-form-item label="作者名字" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email"></el-input>
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
import VueImageCropUpload from "vue-image-crop-upload";
import { UserModule } from "@/store/modules/user";
import { decryptImage } from "@/utils/AES";
import {
  getAuthors,
  addAuthor,
  updateAuthor,
  deleteAuthor,
  toggleAuthorStatus,
} from "@/api/author";

@Component({
  components: {
    "image-crop-upload": VueImageCropUpload,
  },
})
export default class AuthorManagement extends Vue {
  authors: any[] = [];
  currentPage = 1;
  pageSize = 10;
  total = 0;
  uploadUrl = process.env.VUE_APP_BASE_API + "/api/upload";
  private listLoading = true;

  searchForm = {
    name: "",
    phone: "",
    createDate: [],
  };

  dialogVisible = false;
  dialogTitle = "";
  formData: any = {};
  rules = {};
  beforeMount() {
    this.rules = {
      icon: [
        {
          validator: (rules: any, value: any, callback: any) => {
            if (!this.formData.icon) {
              callback(new Error("头像是必填项"));
            } else {
              callback();
            }
          },
          trigger: "change",
        },
      ],
      name: [{ required: true, message: "作者名字是必填项", trigger: "blur" }],
      phone: [
        { required: true, message: "手机号是必填项", trigger: "blur" },
        {
          pattern: /^1[3-9]\d{9}$/,
          message: "请输入有效的手机号",
          trigger: "blur",
        },
      ],
      email: [
        { required: true, message: "邮箱是必填项", trigger: "blur" },
        { type: "email", message: "请输入有效的邮箱地址", trigger: "blur" },
      ],
    };
  }
  showImageCropUpload = false;

  mounted() {
    this.getAuthorsData();
  }

  async getAuthorsData() {
    await this.searchAuthors();
  }

  async searchAuthors() {
    
    if(this.searchForm.createDate==null) {
      this.searchForm.createDate = [];
    }
    // 实现查询方法
    // 实现数据请求方法
    this.listLoading = true;
    const data: any = await getAuthors({
      data: {
        name: this.searchForm.name,
        phone: this.searchForm.phone,
        startDate:  this.searchForm.createDate[0] ? this.searchForm.createDate[0] : null,
        endDate: this.searchForm.createDate[1] ? this.searchForm.createDate[1] : null,
      },
      page: this.currentPage,
      size: this.pageSize,
    });
    this.authors = [];
    this.authors = data.data.dataList;
    const decryptedIcons = await Promise.all(
      this.authors.map(async (author) => {
        return await decryptImage(author.iconUrl);
      })
    );

    this.authors = this.authors.map((author, index) => {
      author.iconUrl = author.icon;
      author.icon = decryptedIcons[index];
      return author;
    });

    this.total = data.data.total;
    this.listLoading = false;
  }

  handleSizeChange(val: number) {
    this.pageSize = val;
    this.getAuthorsData();
  }

  handleCurrentChange(val: number) {
    this.currentPage = val;
    this.getAuthorsData();
  }

  openDialog(type: string, author?: any) {
    this.dialogTitle = type === "add" ? "新增作者" : "编辑作者";
    this.formData = author ? Object.assign({}, author) : {};
    this.dialogVisible = true;
  }

  submitDialog() {
    // 实现表单提交方法
    (this.$refs.form as any).validate((valid: boolean) => {
      if (valid) {
        const submitMethod =
          this.dialogTitle === "新增作者" ? addAuthor : updateAuthor;
        submitMethod({
          id: this.formData.id,
          name: this.formData.name,
          phone: this.formData.phone,
          email: this.formData.email,
          icon: this.formData.iconUrl,
        }).then(() => {
          this.$message.success(`${this.dialogTitle}成功`);
          this.dialogVisible = false;
          this.getAuthorsData();
        });
      }
    });
  }

  resetDialog() {
    (this.$refs.form as any).resetFields();
    this.showImageCropUpload = false;
  }

  async uploadSuccess(response: any) {

    if (response.code !== 200) {
      this.$message.error(response.message);
      this.showImageCropUpload = false;
      return;
    }
    //loading
    this.$message.success("上传成功");
    this.listLoading = true;

    this.formData.iconUrl = response.data.key;

    this.formData.icon = await decryptImage(response.data.url);
    this.showImageCropUpload = false;
    // Manually trigger the 'change' event for the 'icon' field
    (this.$refs.form as any).validateField("icon");

    this.listLoading = false;
  }

  resetImageCropUpload() {
    this.showImageCropUpload = false;
  }

  deleteAuthor(author: any) {
    // 实现删除作者方法
    this.$confirm("确定删除该作者吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        deleteAuthor(author).then(() => {
          this.$message.success("删除成功");
          this.getAuthorsData();
        });
      })
      .catch(() => {
        this.$message.info("已取消删除");
        this.getAuthorsData();
      });
  }

  toggleAuthorStatus(author: any) {
    //询问
    this.$confirm("确定要修改该作者状态吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      // 实现启用/禁用作者方法
      toggleAuthorStatus(author).then(() => {
        this.$message.success(author.status === 1 ? "已启用" : "已禁用");
        this.getAuthorsData();
      });
    });
  }

  getToken() {
    return UserModule.token;
  }
}
</script>

<style scoped>
.author-container {
  margin: 20px;
}
.search {
  margin-bottom: 20px;
}

/* ... */

.image-preview {
  max-width: 90%;
  max-height: 90%;
}
</style>
