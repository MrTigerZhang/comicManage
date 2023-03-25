<template>
  <div class="comic-content-manager">
    <aside>
      上传或者删除图片后，不需要再次点击保存按钮
      <br />
      可以通过拖拽更改图片的顺序
    </aside>

    <div class="editor-container">
      <dropzone
        id="myVueDropzone"
        url="https://httpbin.org/post"
        @dropzone-success="dropzoneSuccess"
        @dropzone-removed-file="dropzoneRemovedFile"
      />
      <div class="toolbar"></div>
      <el-button type="danger" @click="deleteSelected">批量删除</el-button>
    </div>
    <el-table
      ref="form"
      :data="comicList"
      border
      row-key="id"
      @selection-change="handleSelectionChange"
       v-loading="listLoading"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column
        prop="pageNumber"
        label="页码"
        width="100"
      ></el-table-column>
      <el-table-column prop="imgSrc" label="图片">
        <template #default="{row}">
          <el-image
            :src="row.imgSrc"
            :preview-src-list="[row.imgSrc]"
            style="max-width: 100px"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="拖拽" width="80">
        <template #default>
          <i class="el-icon-rank handle"></i>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{row}">
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="deleteRow(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Dropzone from '@/components/Dropzone/index.vue'
import {
  addContent,
  queryContentList,
  deleteContent,
  updateContentSort
} from '@/api/comic'
import Sortable from 'sortablejs'
import { decryptImage } from '@/utils/AES'
@Component({
  components: {
    dropzone: Dropzone
  }
})
export default class ComicContentManager extends Vue {
  @Prop({ required: true }) chapterId!: string;
  @Prop({ required: true }) comicId!: string;
  private sortable: Sortable | null = null;
  listLoading =false
  comicList:any = [
    // 示例数据
  ];

  selectedRows: any[] = [];

  async mounted() {
    await this.queryContent()
    this.$nextTick(() => {
      this.setSort()
    })
  }

  async queryContent() {
    this.listLoading = true
    const data = await queryContentList({ chapterId: this.chapterId })
    this.comicList = data.data

    const decryptedIcons = await Promise.all(
      this.comicList.map(async(cc:any) => {
        return await decryptImage(cc.imgSrcUrl)
      })
    )

    this.comicList = this.comicList.map((cc:any, index:any) => {
      cc.imgSrc = decryptedIcons[index]
      return cc
    })
    this.listLoading = false
  }

  handleSelectionChange(selectedRows: any[]) {
    this.selectedRows = selectedRows
  }

  deleteSelected() {
    this.$confirm('是否要批量删除这些图片？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      this.selectedRows.forEach(async(row) => {
        await this.del(row)
      })
    })
  }

  deleteRow(row: any) {
    this.$confirm('是否要删除图片？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      await this.del(row)
    })
  }

  async del(row: any) {
    await deleteContent({ id: row.id })
    this.queryContent()
  }

  private async dropzoneSuccess(file: File, response: any) {
    // 假设response返回文件id;
    console.log(file.name)
    await addContent({ chapterId: this.chapterId, imgSrc: response.imgSrc })
    await this.queryContent()
    this.$message({ message: 'Upload success', type: 'success' })
  }

  private dropzoneRemovedFile(file: File, error: Error, xhr: XMLHttpRequest) {
    // this.$message({ message: "Delete success", type: "success" });
    console.log(file, error, xhr)
  }

  private setSort() {
    const el = (this.$refs.form as Vue).$el.querySelectorAll(
      '.el-table__body-wrapper > table > tbody'
    )[0] as HTMLElement
    console.log(el)
    this.sortable = Sortable.create(el, {
      ghostClass: 'sortable-ghost2', // Class name for the drop placeholder
      handle: '.handle', // 拖拽手柄的选择器
      onEnd: async(evt) => {
        if (
          typeof evt.oldIndex !== 'undefined' &&
          typeof evt.newIndex !== 'undefined'
        ) {
          // 您可以在这里处理拖拽结束时的操作，例如更新数据的顺序
          console.log('From:', evt.oldIndex, 'To:', evt.newIndex)
          // 调用您的 API 更新排序，例如：
          await updateContentSort({
            chapteriD: this.chapterId,
            from: evt.oldIndex,
            to: evt.newIndex
          })
          this.$message.success('操作成功')
          await this.queryContent()
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped >

/* 在这里编写你的样式 */
.handle {
  cursor: move;
}
.sortable-ghost2 {
  opacity: 0.8;
  color: #fff !important;
  background: #e66604 !important;
}

.icon-star {
  margin-right: 2px;
}

.draggable-handler {
  cursor: pointer;
}

.show-d {
  margin-top: 15px;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
</style>
