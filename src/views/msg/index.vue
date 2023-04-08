<template>
  <div class="components-container">
    <div class="query-panel">
      <el-form ref="queryForm" :model="queryForm" label-width="120px">
        <el-form-item label="消息日期">
          <el-date-picker
            v-model="queryForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="消息状态">
          <el-select v-model="queryForm.status" placeholder="请选择">
            <el-option label="已读" value="1"></el-option>
            <el-option label="未读" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryMessages">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :data="messages"
      style="width: 100%"
      @row-click="openMessageDialog"
    >
      <el-table-column prop="id" label="消息ID" width="180"></el-table-column>
      <el-table-column prop="title" label="消息标题">
        <template #default="{ row }">
          <span>{{ row.title }}</span>
          <span v-if="row.isRead == 0" class="red-dot"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="msgDate"
        label="消息日期"
        width="180"
      ></el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <el-dialog :visible.sync="messageDialogVisible" title="消息内容">
      <p>{{ currentMessage.content }}</p>
    </el-dialog>
  </div>
</template>

<script>
import { getMessages, setMessageRead } from "@/api/message";

export default {
  data() {
    return {
      queryForm: {
        dateRange: "",
        status: "",
      },
      messages: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      messageDialogVisible: false,
      currentMessage: {},
    };
  },
  mounted() {
    this.queryMessages();
  },
  methods: {
    async queryMessages() {
      try {
        const { data } = await getMessages({
          data: {
            msgStatus: this.queryForm.status,
            msgDateStart: this.queryForm.dateRange[0],
            msgDateEnd: this.queryForm.dateRange[1],
          },
          page: this.currentPage,
          size: this.pageSize,
        });

        this.messages = data.dataList;
        this.total = data.total;
      } catch (error) {
        console.error("查询消息失败：", error);
      }
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.queryMessages();
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.queryMessages();
    },
    openMessageDialog(message) {
      this.currentMessage = message;
      this.messageDialogVisible = true;
      this.setMessageRead(message);
    },
    async setMessageRead(message) {
      if (message.isRead ==0) {
        try {
          await setMessageRead({ id: message.id });
          message.isRead = 1;
        } catch (error) {
          console.error("更新消息状态失败：", error);
        }
      }
    },
  },
};
</script>

<style scoped>
.red-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: red;
  border-radius: 50%;
  margin-left: 5px;
}
</style>
