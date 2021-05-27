<template>
  <div>
    <div style="height: 30px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        <el-breadcrumb-item>跟进历史管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- <el-button type="danger" @click="deleteByids">批量删除</el-button> -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column label="编号" type="index" width="55"> </el-table-column>
      <el-table-column prop="customer" label="姓名" width="80"> </el-table-column>
      <el-table-column prop="transTime" label="操作日期"> </el-table-column>
      <el-table-column prop="transuser" label="操作人"> </el-table-column>
      <el-table-column prop="oldSeller" label="旧营销人员"> </el-table-column>
      <el-table-column prop="newSeller" label="新营销人员"> </el-table-column>
      <el-table-column prop="transReason" label="移交原因"> </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      page: 1,
      size: 10,
      total: 0,
    };
  },
  created() {
    this.getHistoryformList();
  },
  methods: {
    getHistoryformList() {
      Vue.axios
        .get("/operator?page=" + this.page + "&limit=" + this.size)
        .then((res) => {
          this.total = res.data.data.total;
          this.tableData = res.data.data.records;

          console.log(res);
        });
    },
    handleSizeChange(val) {
      this.size = val;
      this.getHistoryformList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getHistoryformList();
    },
  },
};
</script>
<style>
.block {
  position: absolute;
  bottom: 60px;
}
</style>