<template>
  <div>
    <div style="height: 30px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>员工管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      状态：
      <el-select v-model="status" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button type="success" @click="getClientList()">查询</el-button>
      <el-button
        type="success"
        @click="
          dialogFormVisibleUpdate = true;
          form = {};
        "
        >新增</el-button
      >
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column label="编号" type="index" width="50"> </el-table-column>
      <el-table-column prop="name" label="名字"> </el-table-column>
      <el-table-column prop="age" label="年龄 "> </el-table-column>
      <el-table-column prop="gender" label="性别"> </el-table-column>
      <el-table-column prop="phone" label="电话" width="150"> </el-table-column>
      <el-table-column prop="wechat" label="微信"> </el-table-column>
      <el-table-column prop="source" label="来源"> </el-table-column>
      <el-table-column prop="job" label="职业"> </el-table-column>
      <el-table-column prop="seller" label="销售人员"> </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
      </el-table-column>
      <el-table-column label="操作" width="350">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="
              dialogFormVisibleUpdate = true;
              form = scope.row;
            "
            >编 辑</el-button
          >
          <el-button
            size="mini"
            type="info"
            @click="showTraceForm(scope.row)"
            >跟 进</el-button
          >
          <el-button size="mini" type="warning" @click="showMoveForm(scope.row)"
            >移 交</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="showStatusForm(scope.row)"
            >修改状态</el-button
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
    <!-- 修改 -->
    <el-dialog
      title="新增/编辑客户信息"
      :visible.sync="dialogFormVisibleUpdate"
    >
      <el-form
        label-position="right"
        ref="cilentFormUpdate"
        label-width="80px"
        :model="form"
      >
        <el-form-item prop="name" label="姓名">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="age" label="年龄">
          <el-input v-model="form.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="gender" label="性别">
          <el-select v-model="form.gender" placeholder="请选择">
            <el-option
              v-for="item in optionsGender"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="phone" label="电话">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="qq" label="QQ">
          <el-input v-model="form.qq" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="wechat" label="微信号">
          <el-input v-model="form.wechat" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="source" label="来源">
          <el-select v-model="form.source" placeholder="请选择">
            <el-option
              v-for="item in optionsFrom"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="job" label="职业">
          <el-select v-model="form.job" placeholder="请选择">
            <el-option
              v-for="item in optionsJob"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button @click="resetForm('cilentFormUpdate')">重 置</el-button>
      <el-button type="primary" @click="submitFormUpdate('cilentFormUpdate')"
        >确 定</el-button
      >
    </el-dialog>
    <!-- 跟进填写 -->
    <el-dialog title="跟进信息" :visible.sync="dialogFormVisibleTrace">
      <el-form
        label-position="right"
        ref="traceForm"
        label-width="80px"
        :model="traceForm"
      >
        <el-form-item prop="name" label="姓名">
          <el-input
            disabled
            v-model="traceForm.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="traceTime" label="跟进时间">
          <el-input v-model="traceForm.traceTime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="traceDetails" label="跟进内容">
          <el-input
            v-model="traceForm.traceDetails"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="traceType" label="跟进方式">
          <el-input v-model="traceForm.traceType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="traceResult" label="跟进结果">
          <el-select v-model="traceForm.traceResult" placeholder="请选择">
            <el-option
              v-for="item in optionsResult"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="type" label="跟进类型">
          <el-select v-model="traceForm.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button @click="resetForm('traceForm')">重 置</el-button>
      <el-button type="primary" @click="submitTraceFormUpdate('traceForm')"
        >确 定</el-button
      >
    </el-dialog>
    <!-- 移交填写 -->
    <el-dialog title="移交信息" :visible.sync="dialogFormVisibleMove">
      <el-form
        label-position="right"
        ref="moveForm"
        label-width="80px"
        :model="moveForm"
      >
        <el-form-item prop="customer" label="姓名">
          <el-input
            disabled
            v-model="moveForm.customer"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="oldSeller" label="旧营销人员">
          <el-input
            disabled
            v-model="moveForm.oldSeller"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="newSeller" label="新营销人员">
          <el-select v-model="moveForm.newSeller" placeholder="请选择">
            <el-option
              v-for="item in optionsUser"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <!-- <el-input v-model="traceForm.newSeller" autocomplete="off"></el-input> -->
        </el-form-item>
        <el-form-item prop="transReason" label="移交原因">
          <el-input
            v-model="moveForm.transReason"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="resetForm('moveForm')">重 置</el-button>
      <el-button type="primary" @click="submitMoveFormFormUpdate('moveForm')"
        >确 定</el-button
      >
    </el-dialog>
    <!-- 修改状态 -->
    <el-dialog title="移交信息" :visible.sync="dialogFormVisibleStatus">
      <el-form
        label-position="right"
        ref="statusForm"
        label-width="80px"
        :model="statusForm"
      >
        <el-form-item prop="name" label="姓名">
          <el-input
            disabled
            v-model="statusForm.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="oldSeller" label="状态">
          <el-select v-model="statusForm.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        @click="submitMoveStatusFormUpdate('statusForm')"
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
      tableData: [],
      optionsGender: [
        {
          value: 1,
          label: "男",
        },
        {
          value: 0,
          label: "女",
        },
      ],
      optionsResult: [
        {
          value: "优",
          label: "优",
        },
        {
          value: "中",
          label: "中",
        },
        {
          value: "差",
          label: "差",
        },
      ],
      optionsFrom: [],
      optionsJob: [],
      optionsUser: [],
      form: {
        id: "",
        name: "",
        age: "",
        qq: "",
        phone: "",
        wechat: "",
        gender: "",
        descr: "",
        source: "",
        seller: "",
        job: "",
        status: "",
        inputUser: "",
      },
      traceForm: {
        name: "",
        clientId: 0,
        inputUser: "",
        traceDetails: "",
        traceResult: "",
        traceTime: new Date().getTime(),
        traceType: "",
        type: "",
      },
      moveForm: {
        customer: "",
        newSeller: "",
        oldSeller: "",
        transReason: "",
        transTime: "",
        transuser: "",
      },
      statusForm: {
        name: "",
        status: "",
        id: "",
      },
      options: [
        {
          value: "",
          label: "全部",
        },
      ],
      clientId: "",
      status: "",
      currentPage: 1,
      page: 1,
      size: 10,
      total: 0,
      dialogFormVisibleUpdate: false,
      dialogFormVisibleTrace: false,
      dialogFormVisibleMove: false,
      dialogFormVisibleStatus: false,
    };
  },
  created() {
    this.getClientList();
    this.getStatusList();
    this.getJobList();
    this.getFromList();
    this.getUserList();
  },
  methods: {
    getClientList() {
      if (this.status == 1) {
        this.status = "";
      }
      Vue.axios
        .get(
          "/client?page=" +
            this.page +
            "&limit=" +
            this.size +
            "&status=" +
            this.status
        )
        .then((res) => {
          this.tableData = res.data.data.records;
          this.tableData.forEach((item) => {
            item.gender = item.gender == 1 ? "男" : "女";
            this.options.forEach((element) => {
              if (element.value == item.status) {
                item.status = element.label;
              }
            });
          });
          this.total = res.data.data.total;
        });
    },
    handleSizeChange(val) {
      this.size = val;
      this.getClientList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getClientList();
    },
    //获取状态
    getStatusList() {
      Vue.axios.get("/statuslist").then((res) => {
        res.data.data.forEach((item) => {
          this.options.push({
            value: item.status,
            label: item.status,
          });
        });
      });
    },
    //获取状态
    getFromList() {
      Vue.axios.get("/fromlist").then((res) => {
        res.data.data.forEach((item) => {
          this.optionsFrom.push({
            value: item.fromName,
            label: item.fromName,
          });
        });
      });
    },
    //获取状态
    getJobList() {
      Vue.axios.get("/joblist").then((res) => {
        res.data.data.forEach((item) => {
          this.optionsJob.push({
            value: item.jobName,
            label: item.jobName,
          });
        });
      });
    },
    //获取状态
    getUserList() {
      Vue.axios.get("/adminall").then((res) => {
        res.data.data.forEach((item) => {
          this.optionsUser.push({
            value: item.realName,
            label: item.realName,
          });
        });
      });
    },
    //重置表单
    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields();
    },
    //提交新增或者编辑
    submitFormUpdate() {
      this.form.inputuser = JSON.parse(
        window.sessionStorage.getItem("user")
      ).adminCode;
      if (!this.form.id) {
        //添加
        this.form.seller = JSON.parse(
          window.sessionStorage.getItem("user")
        ).adminCode;
        Vue.axios.post("/client", this.form).then((res) => {
          if (res.data.status == 200) {
            this.dialogFormVisibleUpdate = false;
            this.resetForm("cilentFormUpdate");
            this.getClientList();
          }
        });
      } else {
        //修改
        Vue.axios.put("/client", this.form).then((res) => {
          if (res.data.status == 200) {
            this.dialogFormVisibleUpdate = false;
            this.resetForm("ruleForm");
            this.getClientList();
          }
        });
      }
    },
    showTraceForm(row) {
      this.dialogFormVisibleTrace = true;
      this.traceForm.name = row.name;
      this.traceForm.clientId = row.id;
      this.traceForm.inputUser = JSON.parse(
        window.sessionStorage.getItem("user")
      ).adminCode;
    },
    submitTraceFormUpdate() {
      Vue.axios.post("/trace", this.traceForm).then((res) => {
        if (res.data.status == 200) {
          this.dialogFormVisibleTrace = false;
          this.resetForm("traceForm");
          this.getClientList();
        }
      });
    },
    //移交
    showMoveForm(row) {
      this.dialogFormVisibleMove = true;
      this.moveForm.customer = row.name;
      this.moveForm.oldSeller = row.seller;
      this.moveForm.clientId = row.id;
      this.moveForm.transTime = new Date().getTime();
      this.moveForm.transuser = JSON.parse(
        window.sessionStorage.getItem("user")
      ).adminCode;
    },
    submitMoveFormFormUpdate() {
      Vue.axios.post("/operator", this.moveForm).then((res) => {
        if (res.data.status == 200) {
          this.dialogFormVisibleMove = false;
          Vue.axios
            .get("/clientseller", {
              params: {
                id: this.moveForm.clientId,
                seller: this.moveForm.newSeller,
              },
            })
            .then((res) => {
              this.resetForm("moveForm");
              this.getClientList();
            });
        }
      });
    },
    //状态
    showStatusForm(row) {
      this.dialogFormVisibleStatus = true;
      this.statusForm.name = row.name;
      this.statusForm.id = row.id;
    },
    submitMoveStatusFormUpdate() {
      Vue.axios.put("/client", this.statusForm).then((res) => {
        if (res.data.status == 200) {
          this.dialogFormVisibleStatus = false;
          this.getClientList();
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