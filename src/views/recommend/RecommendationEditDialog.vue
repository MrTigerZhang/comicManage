<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="`编辑推荐: ${recommendation.name}`"
    width="70%"
    @close="resetForm"
  >
    <el-table :data="recommendationItems" border v-loading="loading">
      <el-table-column prop="sortIdx" label="序号" width="80"></el-table-column>
      <el-table-column prop="comicName" label="漫画名字"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.imgUrl"
            fit="cover"
            :preview-src-list="[scope.row.imgUrl]"
            style="width: 100px; height: 100px;"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="图片类型" width="180">
        <template slot-scope="scope">
          <el-select v-model="scope.row.imgurlType" placeholder="请选择">
            <el-option label="无图" :value="0"></el-option>
            <el-option label="竖图" :value="1"></el-option>
            <el-option label="横图" :value="2"></el-option>
            <el-option label="方图" :value="3"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="openComicSearchDialog(scope.row)"
          >
            选择漫画
          </el-button>
          <el-button
            size="mini"
            type="success"
            @click="updateRecommendationItem(scope.row)"
          >
            提交
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <comic-search-dialog
      ref="comicSearchDialog"
      @selectedComic="updateSelectedComic"
    ></comic-search-dialog>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ComicSearchDialog from "./ComicSearchDialog.vue";
import { contentList, updateContent } from "@/api/recommendations";

import { decryptImage } from "@/utils/AES";

export default {
  components: {
    ComicSearchDialog
  },
  data() {
    return {
      dialogVisible: false,
      recommendation: {},
      recommendationItems: [],
      loading: true
    };
  },
  methods: {
    async openDialog(recommendation) {
      this.dialogVisible = true;
      this.recommendation = recommendation;
      this.loading = true;
      const data = await contentList({ id: recommendation.id });
      //解密图片
      await Promise.all(
        data.data.map(async item => {
          if (item.imgUrl) {
            item.imgUrl = await decryptImage(item.imgUrl);
          }
        })
      );
      this.loading = false;
      this.recommendationItems = data.data;
    },
    resetForm() {
      this.recommendation = {};
      this.recommendationItems = [];
    },
    openComicSearchDialog(row) {
      this.$refs.comicSearchDialog.openDialog(row);
    },
    updateSelectedComic(row, comic) {
      row.comicId = comic.id;
      row.comicName = comic.name;
    },
    async updateRecommendationItem(row) {
      if (!row.comicId) {
        this.$message({
          type: "warning",
          message: "请选择漫画!"
        });
        return;
      }

      if (row.imgurlType == null || row.imgurlType == undefined) {
        this.$message({
          type: "warning",
          message: "请选择图片类型!"
        });
        return;
      }

      this.loading = true;
      const data = (await updateContent(row)).data;
      if (data.imgUrl && data.imgUrl != "")
        row.imgUrl = await decryptImage(data.imgUrl);
      else row.imgUrl = "";
      this.loading = false;
      this.$message({
        type: "success",
        message: "更新成功!"
      });
    }
  }
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
