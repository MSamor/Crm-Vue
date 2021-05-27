<template>
  <div>
    <div style="height: 30px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>员工管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-button
      type="primary"
      @click="
        dialogFormVisible = true;
        adminform = {};
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
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="adminCode" label="用户账号" >
      </el-table-column>
      <el-table-column prop="realName" label="真实姓名" >
      </el-table-column>
      <el-table-column prop="sex" label="性别" > </el-table-column>
      <el-table-column prop="phone" label="电话" > </el-table-column>
      <el-table-column prop="loginTime" label="登录时间">
      </el-table-column>
      <el-table-column prop="roleName" label="角色名字" >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleUpdate(scope.row)"
            >编 辑</el-button
          >
          <el-button size="mini" type="primary" @click="handleRole(scope.row)"
            >角色分配</el-button
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
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form
        :rules="adminFormRules"
        label-position="right"
        ref="ruleForm"
        label-width="80px"
        :model="adminform"
      >
        <el-form-item prop="adminCode" label="角色账号">
          <el-input v-model="adminform.adminCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="realName" label="真实姓名">
          <el-input v-model="adminform.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <!-- <el-input v-model="adminform.sex" autocomplete="off"></el-input> -->
          <el-select v-model="adminform.sex" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="phone" label="电话">
          <el-input v-model="adminform.phone" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="loginTime" label="登录时间">
          <el-input v-model="adminform.loginTime" autocomplete="off"></el-input>
        </el-form-item> -->
        <!-- <el-form-item prop="roleName" label="角色名字">
          <el-input v-model="adminform.roleName" autocomplete="off"></el-input>
        </el-form-item> -->
      </el-form>
      <el-button @click="resetForm('ruleForm')">重 置</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')"
        >确 定</el-button
      >
    </el-dialog>
    <!-- 修改 -->
    <el-dialog title="修改信息" :visible.sync="dialogFormVisibleUpdate">
      <el-form
        :rules="adminFormRules"
        label-position="right"
        ref="ruleFormUpdate"
        label-width="80px"
        :model="adminform"
      >
        <el-form-item prop="adminCode" label="角色账号">
          <el-input v-model="adminform.adminCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="realName" label="真实姓名">
          <el-input v-model="adminform.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <!-- <el-input v-model="adminform.sex" autocomplete="off"></el-input> -->
          <el-select v-model="adminform.sex" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="phone" label="电话">
          <el-input v-model="adminform.phone" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="loginTime" label="登录时间">
          <el-input v-model="adminform.loginTime" autocomplete="off"></el-input>
        </el-form-item> -->
        <!-- <el-form-item prop="roleName" label="角色名字">
          <el-input v-model="adminform.roleName" autocomplete="off"></el-input>
        </el-form-item> -->
      </el-form>
      <el-button @click="resetForm('ruleFormUpdate')">重 置</el-button>
      <el-button type="primary" @click="submitFormUpdate('ruleFormUpdate')"
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
        <el-form-item prop="realName" label="用户名称">
          <el-input v-model="search.realName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="resetForm('searchForm')">重 置</el-button>
      <el-button type="primary" @click="submitSearchForm('searchForm')"
        >查 询</el-button
      >
    </el-dialog>
    <!-- 角色分配 -->
    <el-dialog title="权限分配" :visible.sync="dialogFormVisibleRole">
      <el-table
        ref="multipleTableRole"
        :data="tableDataRole"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChangeRole"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="120">
        </el-table-column>
        <el-table-column
          prop="rightName"
          label="权限名称"
          show-overflow-tooltip
        >
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="submitRole()">确 认</el-button>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
      roles: [],
      options: [
        {
          value: "1",
          label: "男",
        },
        {
          value: "0",
          label: "女",
        },
      ],
      adminFormRules: {
        adminName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      tableData: [],
      tableDataRole: [],
      multipleSelection: [],
      multipleSelectionRole: [],
      currentPage: 1,
      page: 1,
      size: 10,
      total: 0,
      adminform: {
        id: "",
        adminCode: "",
        realName: "",
        sex: "",
        phone: "",
        loginTime: new Date(),
        roleName: "",
      },
      search: {
        realName: "",
      },
      dialogFormVisible: false,
      dialogFormVisibleSearch: false,
      dialogFormVisibleUpdate: false,
      dialogFormVisibleRole: false,
      roleCurrent: "",
    };
  },
  created() {
    this.getAdminformList();
    this.getRoleList();
  },
  methods: {
    getAdminformList() {
      Vue.axios
        .get("/admin?page=" + this.page + "&limit=" + this.size)
        .then((res) => {
          console.log(this);
          this.tableData = res.data.data.records;
          this.tableData.forEach((item) => {
            item.sex = item.sex == 1 ? "男" : "女";
          });
          this.total = res.data.data.total;
        });
    },

    handleSizeChange(val) {
      this.size = val;
      this.getAdminformList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getAdminformList();
    },

    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields();
    },

    submitForm(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          Vue.axios.post("/admin", this.adminform).then((res) => {
            if (res.data.status == 200) {
              this.dialogFormVisible = false;
              this.resetForm("ruleForm");
              this.getAdminformList();
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
          Vue.axios.get("/searchadmin", { params: this.search }).then((res) => {
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
        .delete("/deletemanyadmin", {
          params: {
            ids: ids.join(","),
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.status == 200) {
            this.getAdminformList();
          }
        });
    },

    handleUpdate(row) {
      this.dialogFormVisibleUpdate = true;
      this.adminform = row;
      console.log();
    },
    submitFormUpdate() {
      this.$refs["ruleFormUpdate"].validate((valid) => {
        if (valid) {
          Vue.axios.put("/admin", this.adminform).then((res) => {
            if (res.data.status == 200) {
              this.dialogFormVisibleUpdate = false;
              this.getAdminformList();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //角色分配
    handleRole(row) {
      this.dialogFormVisibleRole = true;
      this.roleCurrent = row;
      //需要get一下现在的权限状态
      Vue.axios.get("/adminrole?adminId=" + row.id).then((res) => {
        this.$refs.multipleTableRole.clearSelection();
        if (res.data.data != "") {
          console.log(res.data.data);
          this.tableDataRole.forEach((tableItem) => {
            res.data.data.forEach((roleItem) => {
              if (tableItem.id == roleItem.roleId) {
                this.$refs.multipleTableRole.toggleRowSelection(tableItem);
              }
            });
          });
        }
      });
    },

    //角色分配中的表格处理
    handleSelectionChangeRole(selection) {
      this.multipleSelectionRole = selection;
    },

    getRoleList() {
      Vue.axios.get("/role").then((res) => {
        console.log(res);
        this.tableDataRole = res.data.data;
      });
    },

    //提交权限分配
    submitRole() {
      let ids = [];
      for (let index = 0; index < this.multipleSelectionRole.length; index++) {
        const id = this.multipleSelectionRole[index].id;
        ids.push(id);
      }
      Vue.axios({
        url: "/adminrole",
        method: "post",
        params: {
          adminId: this.roleCurrent.id,
          roleId: ids.join(","),
        },
      }).then((res) => {
        if (res.data.status == 200) {
          this.$message.success("修改成功");
          this.dialogFormVisibleRole = false;
          this.getAdminformList()
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