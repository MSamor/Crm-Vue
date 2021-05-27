<template>
  <div>
    <div style="height: 30px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>平台管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-button
      type="primary"
      @click="
        dialogFormVisible = true;
        platform = {};
      "
      >添加</el-button
    >
    <el-button type="danger" @click="deleteByids">批量删除</el-button>
    <el-button type="success" @click="dialogFormVisibleSearch = true"
      >条件查询</el-button
    >
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
     @selection-change="handleSelectionChange"
    >
      <!-- @selection-change="handleSelectionChange" -->
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="platformName" label="平台名称" width="120">
      </el-table-column>
      <el-table-column prop="pictureUrl" label="平台图片" width="300">
      </el-table-column>
      <el-table-column prop="hrefUrl" label="平台地址" show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="platformIntro"
        label="平台简介"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleUpdate(scope.row)"
            >编 辑</el-button
          >
        </template>
      </el-table-column>
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
    <!-- 表单 -->
    <el-dialog title="添加平台" :visible.sync="dialogFormVisible">
      <el-form
        :rules="platformRules"
        label-position="right"
        ref="ruleForm"
        label-width="80px"
        :model="platform"
      >
        <el-form-item prop="platformName" label="平台名称">
          <el-input
            v-model="platform.platformName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pictureUrl" label="图片路径">
          <el-input v-model="platform.pictureUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="hrefUrl" label="平台路径">
          <el-input v-model="platform.hrefUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="platformIntro" label="平台简介">
          <el-input
            v-model="platform.platformIntro"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="resetForm('ruleForm')">重 置</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')"
        >确 定</el-button
      >
    </el-dialog>
    <!-- 修改 -->
    <el-dialog title="修改信息" :visible.sync="dialogFormVisibleUpdate">
      <el-form
        :rules="platformRules"
        label-position="right"
        ref="ruleFormUpdate"
        label-width="80px"
        :model="platform"
      >
        <el-form-item prop="platformName" label="平台名称">
          <el-input
            v-model="platform.platformName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pictureUrl" label="图片路径">
          <el-input v-model="platform.pictureUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="hrefUrl" label="平台路径">
          <el-input v-model="platform.hrefUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="platformIntro" label="平台简介">
          <el-input
            v-model="platform.platformIntro"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="resetForm('ruleForm')">重 置</el-button>
      <el-button type="primary" @click="submitFormUpdate('ruleForm')"
        >确 定</el-button
      >
    </el-dialog>
    <!-- 条件查询 -->
    <el-dialog title="条件查询" :visible.sync="dialogFormVisibleSearch">
      <el-form
        label-position="right"
        ref="searchForm"
        label-width="80px"
        :model="search"
      >
        <el-form-item prop="platformName" label="平台名称">
          <el-input v-model="search.platformName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="platformIntro" label="平台简介">
          <el-input
            v-model="search.platformIntro"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="resetForm('searchForm')">重 置</el-button>
      <el-button type="primary" @click="submitSearchForm('searchForm')"
        >查 询</el-button
      >
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
      platformRules: {
        platformName: [
          { required: true, message: "请输入平台名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        pictureUrl: [
          { required: true, message: "请输入图片链接", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "长度在 3 到 50 个字符",
            trigger: "blur",
          },
        ],
        hrefUrl: [
          { required: true, message: "请输入平台链接", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "长度在 3 到 50 个字符",
            trigger: "blur",
          },
        ],
        platformIntro: [
          { required: true, message: "请输入平台介绍", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 10 到 50 个字符",
            trigger: "blur",
          },
        ],
      },
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      page: 1,
      size: 10,
      total: 0,
      platform: {
        id: "",
        platformName: "",
        pictureUrl: "",
        hrefUrl: "",
        platformIntro: "",
      },
      search: {
        platformName: "",
        platformIntro: "",
      },
      dialogFormVisible: false,
      dialogFormVisibleSearch: false,
      dialogFormVisibleUpdate: false,
    };
  },
  created() {
    this.getPlatformList();
  },
  methods: {
    getPlatformList() {
      Vue.axios
        .get("/platform?page=" + this.page + "&limit=" + this.size)
        .then((res) => {
          console.log(this);
          this.tableData = res.data.data.records;
          this.total = res.data.data.total;
        });
    },

    handleSizeChange(val) {
      this.size = val;
      this.getPlatformList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getPlatformList();
    },

    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields();
    },

    submitForm(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          Vue.axios.post("/platform", this.platform).then((res) => {
            if (res.data.status == 200) {
              this.dialogFormVisible = false;
              this.resetForm("ruleForm");
              this.getPlatformList();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    submitSearchForm(searchForm) {
      this.$refs[searchForm].validate((valid) => {
        if (valid) {
          Vue.axios.get("/search", { params: this.search }).then((res) => {
            if (res.data.status == 200) {
              this.dialogFormVisibleSearch = false;
              this.resetForm(searchForm);
              this.tableData = res.data.data;
              this.total = res.data.data.length;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    handleSelectionChange(selection, row) {
      this.multipleSelection = selection;
    },

    deleteByids() {
      if (this.multipleSelection.length == 0) {
        return this.$message.error("还没有选中数据");
      }
      let ids = [];
      for (let index = 0; index < this.multipleSelection.length; index++) {
        const id = this.multipleSelection[index].id;
        ids.push(id);
      }
      console.log(ids);
      Vue.axios
        .delete("/deletemany", {
          params: {
            ids: ids.join(","),
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.status == 200) {
            this.getPlatformList();
          }
        });
    },

    handleUpdate(row) {
      this.dialogFormVisibleUpdate = true;
      this.platform = row;
    },
    submitFormUpdate() {
      this.$refs["ruleFormUpdate"].validate((valid) => {
        if (valid) {
          Vue.axios.put("/platform", this.platform).then((res) => {
            if (res.data.status == 200) {
              this.dialogFormVisibleUpdate = false;
              this.getPlatformList();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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