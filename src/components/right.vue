<template>
  <div>
    <div style="height: 30px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-button
      type="primary"
      @click="
        dialogFormVisible = true;
        getParentDate();
        platform = {};
      "
      >添加</el-button
    >
    <el-button type="danger" @click="deleteByids">批量删除</el-button>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="rightName" label="权限名字" >
      </el-table-column>
      <el-table-column prop="parentName" label="父级名称" >
      </el-table-column>
      <el-table-column prop="parentId" label="父Id" width="310">
      </el-table-column>
      <el-table-column prop="rightCode" label="权限代码" >
      </el-table-column>
      <el-table-column prop="rightUrl" label="权限地址">
      </el-table-column>
    </el-table>
    <div class="block"></div>
    <!-- 表单 -->
    <!-- parentId: "",
        parentName: "",
        rightName: "",
        rightCode:"",
        rightUrl:"" -->
    <el-dialog title="添加权限" :visible.sync="dialogFormVisible">
      <!-- :rules="roleformRules" -->
      <el-form
        label-position="right"
        ref="ruleForm"
        label-width="80px"
        :model="rightform"
      >
        <el-form-item prop="rightName" label="权限名字">
          <el-input v-model="rightform.rightName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="parentName" label="父级名字">
          <el-select v-model="rightform.parentName" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="rightCode" label="权限代码">
          <el-input v-model="rightform.rightCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="rightUrl" label="权限地址">
          <el-input v-model="rightform.rightUrl" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="resetForm('ruleForm')">重 置</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')"
        >确 定</el-button
      >
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
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
      rightform: {
        parentId: "",
        parentName: "",
        rightName: "",
        rightCode: "",
        rightUrl: "",
      },
      dialogFormVisible: false,
      options: [
        {
          value: "",
          label: "请选择",
        },
      ],
    };
  },
  created() {
    this.getRightformList();
  },
  methods: {
    getRightformList() {
      Vue.axios.get("/right").then((res) => {
        console.log(res);
        this.tableData = res.data.data;
        this.total = res.data.data.total;
      });
    },

    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields();
    },

    submitForm(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        let arr = this.rightform.parentName.split("@")
        this.rightform.parentName = arr[0]
        this.rightform.parentId = arr[1]
        if (valid) {
          Vue.axios.post("/right", this.rightform).then((res) => {
            if (res.data.status == 200) {
              this.dialogFormVisible = false;
              this.resetForm("ruleForm");
              this.getRightformList();
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
      
      Vue.axios
        .delete("/deletemanyright", {
          params: {
            ids: ids.join(","),
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.status == 200) {
            this.getRightformList();
          }
        });
    },

    //加载父级选项
    getParentDate() {
      Vue.axios.get("/right").then((res) => {
        this.options = [];
        res.data.data.forEach((item) => {
          if (item.parentId == null || item.parentId == "") {
            console.log(item);
            this.options.push({
              value: item.rightName + "@" + item.id,
              label: item.rightName,
            });
          }
        });
      });
    },
  },
};
</script>