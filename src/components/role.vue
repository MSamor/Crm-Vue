<template>
  <div>
    <div style="height: 30px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
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
      <el-table-column prop="roleName" label="角色名称" >
      </el-table-column>
      <el-table-column prop="rightName" label="权限名称" >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="primary" @click="handleUpdate(scope.row)"
            >编 辑</el-button> -->
          <el-button
            size="mini"
            type="primary"
            @click="handleRoleDelivery(scope.row)"
            >分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="block">
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
    </div> -->
    <!-- 表单 -->
    <el-dialog title="添加平台" :visible.sync="dialogFormVisible">
      <el-form
        :rules="roleformRules"
        label-position="right"
        ref="ruleForm"
        label-width="80px"
        :model="roleform"
      >
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="roleform.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="rightName" label="真实姓名">
          <el-input v-model="roleform.rightName" autocomplete="off"></el-input>
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
        :rules="roleformRules"
        label-position="right"
        ref="ruleFormUpdate"
        label-width="80px"
        :model="roleform"
      >
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="roleform.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="rightName" label="真实姓名">
          <el-input v-model="roleform.rightName" autocomplete="off"></el-input>
        </el-form-item>
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
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="search.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="rightName" label="真实姓名">
          <el-input v-model="search.rightName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="resetForm('searchForm')">重 置</el-button>
      <el-button type="primary" @click="submitSearchForm('searchForm')"
        >查 询</el-button
      >
    </el-dialog>

    <!-- 树形权限 -->
    <el-dialog title="权限分配" :visible.sync="dialogFormVisibleRole">
      <el-tree
        ref="tree"
        :data="dataTree"
        show-checkbox
        node-key="id"
        default-expand-all
      >
      </el-tree>
      <el-button type="primary" @click="submitRoleDelivery()">确 认</el-button>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
      dataTree: [],
      roleformRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        rightName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
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
      roleform: {
        id: "",
        roleName: "",
        rightName: "",
      },
      search: {
        roleName: "",
        rightName: "",
      },
      dialogFormVisible: false,
      dialogFormVisibleSearch: false,
      dialogFormVisibleUpdate: false,
      dialogFormVisibleRole: false,
      currentRoleId: "",
    };
  },
  created() {
    this.getRoleformList();
  },
  methods: {
    getRoleformList() {
      // ?page=" + this.page + "&limit=" + this.size
      Vue.axios
        .get("/role")
        .then((res) => {
          this.tableData = res.data.data;
          // this.total = res.data.data.total;
        });
    },

    handleSizeChange(val) {
      this.size = val;
      this.getRoleformList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getRoleformList();
    },

    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields();
    },

    submitForm(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          Vue.axios.post("/role", this.roleform).then((res) => {
            if (res.data.status == 200) {
              this.dialogFormVisible = false;
              this.resetForm("ruleForm");
              this.getRoleformList();
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
          Vue.axios.get("/searchrole", { params: this.search }).then((res) => {
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
        .delete("/deletemanyrole", {
          params: {
            ids: ids.join(","),
          },
        })
        .then((res) => {
          if (res.data.status == 200) {
            this.getRoleformList();
          }
        });
    },

    handleUpdate(row) {
      this.dialogFormVisibleUpdate = true;
      this.roleform = row;
    },
    submitFormUpdate() {
      this.$refs["ruleFormUpdate"].validate((valid) => {
        if (valid) {
          Vue.axios.put("/role", this.roleform).then((res) => {
            if (res.data.status == 200) {
              this.dialogFormVisibleUpdate = false;
              this.getRoleformList();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //权限加载显示
    handleRoleDelivery(row) {
      this.currentRoleId = row.id;
      this.dialogFormVisibleRole = true;
      let dataTree = [];
      Vue.axios.get("/rightparent").then((res) => {
        res.data.data.forEach((item, index) => {
          dataTree[index] = {
            id: item.id,
            label: item.rightName,
            children: [],
          };
          Vue.axios
            .get("/rightson", {
              params: {
                parentId: item.id,
              },
            })
            .then((child) => {
              if (child) {
                child.data.data.forEach((element) => {
                  dataTree[index].children.push({
                    id: element.id,
                    label: element.rightName,
                  });
                  this.dataTree = dataTree;
                  if (index == res.data.data.length - 1) {
                    this.setCheckedNodes();
                  }
                });
              }
            });
        });
      });
    },

    //权限分配提交
    submitRoleDelivery() {
      let rightIds = [];
      this.$refs.tree.getCheckedNodes().forEach((item) => {
        rightIds.push(item.id);
      });
      Vue.axios({
        url: "/roleright",
        method: "post",
        params: {
          roleId: this.currentRoleId,
          rightId: rightIds.join(","),
        },
      }).then((res) => {
        if (res.data.status == 200) {
          this.$message.success("权限修改成功");
          this.dialogFormVisibleRole = false;
        }else{
          this.$message.error("权限修改失败");
        }
        this.getRoleformList()
      });
    },

    //设置选中
    setCheckedNodes() {
      Vue.axios
        .get("/roleright", { params: { roleId: this.currentRoleId } })
        .then((res) => {
          res.data.data.forEach((item) => {
            this.$refs.tree.setChecked(item.rightId, true);
          });
        });
    },
  },
};
</script>