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
      <el-table-column prop="name" label="姓名" width="80"> </el-table-column>
      <el-table-column prop="traceTime" label="跟进日期"> </el-table-column>
      <el-table-column prop="traceDetails" label="跟进内容"> </el-table-column>
      <el-table-column prop="traceType" label="跟进方式"> </el-table-column>
      <el-table-column prop="traceResult" label="跟进结果"> </el-table-column>
      <el-table-column prop="inputUser" label="录入人"> </el-table-column>
      <el-table-column prop="type" label="跟进类型"> </el-table-column>
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
        .get("/trace?page=" + this.page + "&limit=" + this.size)
        .then((res) => {
          this.total = res.data.data.total;
          this.tableData = res.data.data.records;

          this.tableData.forEach(async (item) => {
            let client = await Vue.axios.get("/clientone?id=" + item.clientId);
            this.$set(item, 'name', client.data.data.name)
            // item.name = client.data.data.name;
            // console.log(client.data.data.name);
          });

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