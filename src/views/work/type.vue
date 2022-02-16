<template>
  <div class="className">
    <el-card class="anoCard">
      <div class="searchDiv">
        <el-input
          type="text"
          placeholder="请输入编号"
          class="width1"
          v-model="sch_id"
        ></el-input>
        <el-select
          v-model="sch_status"
          clearable
          class="width1"
          placeholde="请选择状态"
        >
          <el-option
            v-for="item in options"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="getPageData()"
          >搜索</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addTab"
          >添加</el-button
        >
      </div>
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        stripe
      >
        <el-table-column prop="name" label="类型名称"></el-table-column>
        <el-table-column prop="type" label="报修类型" width="90">
          <template slot-scope="scope">
            {{ scope.row.type | typeText }}
          </template>
        </el-table-column>
        <el-table-column prop="mode" label="派单方式" width="90">
          <template slot-scope="scope">
            {{ scope.row.mode | modeText }}
          </template>
        </el-table-column>
        <el-table-column prop="id" label="编号" width="180"></el-table-column>
        <el-table-column prop="publicArea" label="公共区域" width="90">
          <template slot-scope="scope">
            {{ scope.row.publicArea | publicAreaText }}
          </template>
        </el-table-column>
        <el-table-column prop="returnVisit" label="是否回访" width="90">
          <template slot-scope="scope">
            {{ scope.row.returnVisit | publicAreaText }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.createTime | createTimeaText }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | tagClass">{{
              scope.row.status | statusText
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="editTable(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button type="success" @click="toResetPas(scope.row)"
              >维修师傅</el-button
            >
            <el-button
              type="danger"
              @click="toDelete(scope.row)"
              :disabled="rolevalue === 'admin' ? false : true"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        class="fyDiv"
        @size-change="handleSize"
        @current-change="handlePage"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="修改" :visible.sync="diaIsShow" class="diaForm">
      <el-form
        ref="diaForm"
        :model="formData"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="编号">
          <el-input
            type="text"
            v-model="formData.id"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型名称" prop="name">
          <el-input
            type="text"
            v-model="formData.name"
            placeholder="必填，类型名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="保修设置类型" prop="type">
          <el-select v-model="formData.type" placeholder="必填，保修设置类型">
            <el-option
              v-for="item in types"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="派单方式">
          <el-select v-model="formData.mode" placeholder="必填，派单方式">
            <el-option
              v-for="item in modes"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公共区域">
          <el-select
            v-model="formData.publicArea"
            placeholder="必填，是否公共区域"
          >
            <el-option
              v-for="item in publics"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回访设置">
          <el-select
            v-model="formData.returnVisit"
            placeholder="必填，是否回访"
          >
            <el-option
              v-for="item in publics"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholde="请选择状态">
            <el-option
              v-for="item in options"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明">
          <el-input type="text" v-model="formData.introduce"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeTab('diaForm', editType)"
            >确认</el-button
          >
          <el-button @click="diaIsShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="报修师傅"
      :visible.sync="repairIsShow"
      class="diaForm"
      :fullscreen="true"
    >
      <div class="searchDiv" style="text-align: right;">
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="repairIsShow = false"
          >返回</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addRepair"
          >添加</el-button
        >
      </div>
      <el-card class="anoCard">
        <el-table :data="formData.repairData">
          <el-table-column
            property="repairName"
            label="师傅名称"
            width="150"
          ></el-table-column>
          <el-table-column
            property="repairType"
            label="报修类型"
          ></el-table-column>
          <el-table-column
            property="repairStatus"
            label="状态"
          ></el-table-column>
          <el-table-column
            property="repairIntroduce"
            label="说明"
          ></el-table-column>
          <el-table-column property="createTime" label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.createTime | createTimeaText }}
            </template>
          </el-table-column>
          <el-table-column
            property="repairTel"
            label="联系方式"
          ></el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button type="success" @click="toRepair(scope.row)"
                >变更</el-button
              >
              <el-button type="danger" @click="deleteRepair(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-dialog>
    <el-dialog title="选择员工" :visible.sync="repairSelect" class="diaForm">
      <el-card class="anoCard">
        <el-select
          v-model="repair"
          @change="changeRepair(repair)"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in repairs"
            :key="item.value"
            :label="item.name"
            :value="item.id"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </el-card>
      <el-button type="primary" @click="subRepair">确认</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { page, update, save, del } from '@/api/workType'
import { getUserByRole } from '@/api/user'
import { format } from '@/utils/component'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['rolevalue'])
  },
  data() {
    return {
      tableData: [],
      allList: [],
      repairs: [],
      sch_id: '',
      sch_status: null,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40],
      diaIsShow: false,
      detailIsShow: false,
      repairIsShow: false,
      repairSelect: false,
      repairSelected: null,
      editRepairSelect: '',
      repair: null,
      formData: {},
      editType: '',
      options: [{ label: '启用', value: 0 }, { label: '禁用', value: 1 }],
      types: [{ id: 0, name: '维修单' }, { id: 1, name: '保洁单' }],
      hiddens: [{ label: '否', value: false }, { label: '是', value: true }],
      modes: [
        { label: '抢派', value: 0 },
        { label: '指派', value: 1 },
        { label: '轮训', value: 2 }
      ],
      publics: [{ label: '否', value: false }, { label: '是', value: true }],
      rowIndex: 0,
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [
          { required: true, message: '请选择保修设置类型', trigger: 'blur' }
        ],
        mode: [{ required: true, message: '请选择派单方式', trigger: 'blur' }],
        publicArea: [
          { required: true, message: '请选择是否公共区域', trigger: 'blur' }
        ],
        returnVisit: [
          { required: true, message: '请选择是否回访', trigger: 'blur' }
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      }
    }
  },
  // created() {
  //   this.getPageData()
  //   this.getRoles()
  // },
  activated() {
    this.getPageData()
  },
  filters: {
    typeText(val) {
      if (val === undefined) return
      if (val === 0) {
        return '维修单'
      } else if (val === 1) {
        return '保洁单'
      }
    },
    modeText(val) {
      if (val === undefined) return
      if (val === 0) {
        return '抢派'
      } else if (val === 1) {
        return '指派'
      } else if (val === 2) {
        return '轮训'
      }
    },
    publicAreaText(val) {
      if (val === undefined) return
      if (val) {
        return '是'
      } else {
        return '否'
      }
    },
    createTimeaText(val) {
      if (val === undefined) return
      return format(val)
    },
    statusText(val) {
      if (val === undefined) return
      if (val === 0) {
        return '激活'
      } else if (val === 1) {
        return '禁用'
      }
    },
    tagClass(val) {
      if (val === undefined) return
      if (val === 0) {
        return 'success'
      } else if (val === 1) {
        return 'danger'
        // } else if (val === 2) {
        //   return 'warning'
        // } else {
        //   return 'info'
      }
    }
  },
  methods: {
    handleSize(val) {
      this.pageSize = val
      this.getPageData()
    },
    handlePage(val) {
      this.currentPage = val
      this.getPageData()
    },
    getPageData() {
      let param = {
        current: this.currentPage,
        size: this.pageSize,
        id: this.sch_id,
        status: this.sch_status
      }
      page(param)
        .then(res => {
          this.tableData = res.data.records
          this.allList = res.data.records
          this.total = res.data.total
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    // add
    addTab() {
      this.formData = { repairData: [] }
      this.diaIsShow = true
      this.editType = 'add'
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate()
      })
    },
    // 删除
    toDelete(row) {
      this.$confirm('此操作将永久删除相关数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const param = { id: row.id }
          del(param)
            .then(res => {
              if (res.code == 200) {
                this.$notify({
                  title: '成功',
                  message: '已删除该工单类型',
                  type: 'success'
                })
                this.getPageData()
              }
            })
            .catch(err => {
              this.$message.error(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    toResetPas(row) {
      this.formData = Object.assign({}, row)
      this.repairIsShow = true
    },
    addRepair() {
      this.repairSelect = true
      let param = { id: '1475377848902205441' }
      getUserByRole(param)
        .then(res => {
          let ls = this.formData.repairData
          this.repairs = res.data.map(item => {
            let rs = ls.filter(r => {
              return r.id == item.id
            })
            return {
              disabled: rs.length > 0,
              ...item
            }
          })
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    toRepair(value) {
      this.addRepair()
      this.repairSelected = value
      this.editRepairSelect = 'update'
    },
    deleteRepair(value) {
      this.formData.repairData = this.formData.repairData.filter(item => {
        return value.id != item.id
      })
      update(this.formData)
        .then(res => {
          if (res.code == 200) {
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success'
            })
            this.getPageData()
          }
        })
        .catch(err => {
          this.$message.error(err)
          this.getPageData()
          this.repairIsShow = false
        })
      this.repairSelect = false
    },
    changeRepair(value) {
      if (this.editRepairSelect == 'update') {
        this.formData.repairData = this.formData.repairData.filter(item => {
          return this.repairSelected.id != item.id
        })
      }
      let re = null
      re = this.repairs.filter(item => {
        return item.id == value
      })
      this.formData.repairData.push({
        id: re[0].id,
        repairName: re[0].name,
        repairType: '付费报修',
        repairStatus: '在线',
        repairIntroduce: '',
        repairTel: re[0].tel,
        createTime: new Date().getTime()
      })
    },
    subRepair() {
      update(this.formData)
        .then(res => {
          if (res.code == 200) {
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success'
            })
            this.getPageData()
          }
        })
        .catch(err => {
          this.$message.error(err)
          this.getPageData()
          this.repairIsShow = false
        })
      this.repairSelect = false
    },
    // 编辑
    editTable(index, row) {
      this.formData = Object.assign({}, row)
      this.editType = 'update'
      this.diaIsShow = true
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate()
      })
      this.rowIndex = index
    },
    changeTab(form, type) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (type === 'update') {
            // 改变整个表格数据
            let start = (this.currentPage - 1) * this.pageSize
            this.tableData[start + this.rowIndex] = Object.assign(
              {},
              this.formData
            )
            update(this.tableData[start + this.rowIndex])
              .then(res => {
                if (res.code == 200) {
                  this.$notify({
                    title: '成功',
                    message: '工单类型修改成功',
                    type: 'success'
                  })
                  this.getPageData()
                }
              })
              .catch(err => {
                this.$message.error(err)
              })
          } else {
            save(Object.assign({}, this.formData))
              .then(res => {
                if (res.code == 200) {
                  this.$notify({
                    title: '成功',
                    message: '工单类型添加成功',
                    type: 'success'
                  })
                  this.getPageData()
                }
              })
              .catch(error => {
                this.$message.error(error)
              })
          }
          this.diaIsShow = false
        } else {
          return
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.fyDiv {
  float: right;
  margin-top: 30px;
  padding-bottom: 20px;
}
.anoCard .el-table .el-button {
  padding: 8px 18px;
  font-size: 12px;
}
.searchDiv {
  margin-bottom: 20px;
  .el-button {
    padding: 11px 20px;
  }
}
.width1 {
  width: 180px;
  margin-right: 10px;
}
.diaForm {
  .el-input {
    width: 350px;
  }
}
</style>
<style lang="scss">
.anoCard {
  .el-card__body:after {
    content: '';
    clear: both;
    width: 0;
    height: 0;
    visibility: hidden;
    display: block;
  }
}
.diaForm .el-form-item__label {
  padding-right: 20px;
}
.searchDiv [class^='el-icon'] {
  color: #fff;
}
</style>
