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
        <el-table-column
          prop="id"
          label="编号"
          sortable
          width="240"
        ></el-table-column>
        <el-table-column
          prop="role"
          label="角色编号"
          sortable
          width="240"
        ></el-table-column>
        <el-table-column prop="username" label="账号" sortable width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" sortable width="180">
        </el-table-column>
        <el-table-column prop="count" label="访问次数"> </el-table-column>
        <el-table-column prop="tel" label="电话"> </el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | tagClass">{{
              scope.row.status | statusText
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="editTable(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              type="success"
              @click="toResetPas(scope.row)"
              :disabled="scope.row.username === 'admin' ? true : false"
              >重置用户密码</el-button
            >
            <el-button type="warning" @click="toDetail(scope.row)"
              >详情</el-button
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
        <el-form-item label="姓名" prop="name">
          <el-input type="text" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="role">
          <el-select v-model="formData.role" placeholde="请选择用户角色">
            <el-option
              v-for="item in roles"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户性别">
          <el-select v-model="formData.gender" placeholde="请选择用户性别">
            <el-option
              v-for="item in genders"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input
            type="number"
            maxlength="11"
            v-model="formData.tel"
          ></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input
            type="number"
            maxlength="3"
            v-model="formData.age"
          ></el-input>
        </el-form-item>
        <el-form-item label="风格">
          <el-input type="text" v-model="formData.style"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="text" v-model="formData.introduce"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="text" v-model="formData.address"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="username">
          <el-input type="text" v-model="formData.username" disabled></el-input>
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
        <el-form-item>
          <el-button type="primary" @click="changeTab('diaForm', editType)"
            >确认</el-button
          >
          <el-button @click="diaIsShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="详情" :visible.sync="detailIsShow" class="diaForm">
      <el-descriptions :title="formData.name">
        <el-descriptions-item label="用户编号">
          {{ formData.id }}
        </el-descriptions-item>
        <el-descriptions-item label="用户角色">
          {{ formData.roleName }}
        </el-descriptions-item>
        <el-descriptions-item label="用户性别">
          {{ formData.gender }}
        </el-descriptions-item>
        <el-descriptions-item label="电话">
          {{ formData.tel }}
        </el-descriptions-item>
        <el-descriptions-item label="年龄">
          {{ formData.age }}
        </el-descriptions-item>
        <el-descriptions-item label="风格">
          {{ formData.style }}
        </el-descriptions-item>
        <el-descriptions-item label="描述">
          {{ formData.introduce }}
        </el-descriptions-item>
        <el-descriptions-item label="地址">
          {{ formData.address }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          {{ formData.status | statusText }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { page, update, save, del, resetPas } from '@/api/user'
import { getAllRolse } from '@/api/roles'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['rolevalue'])
  },
  data() {
    return {
      tableData: [],
      allList: [],
      sch_id: '',
      sch_status: null,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40],
      diaIsShow: false,
      detailIsShow: false,
      formData: {},
      editType: '',
      options: [
        { label: '启用', value: 0 },
        { label: '禁用', value: 1 }
      ],
      roles: [],
      hiddens: [
        { label: '否', value: false },
        { label: '是', value: true }
      ],
      genders: [
        { label: '男', value: '男' },
        { label: '女', value: '女' }
      ],
      rowIndex: 0,
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        tel: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        role: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        username: [{ required: true, message: '请选择角色', trigger: 'blur' }],
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
    this.getRoles()
  },
  filters: {
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
    getRoles() {
      getAllRolse()
        .then(res => {
          this.roles = res.data.map(item => {
            return {
              id: item.id,
              name: item.name
            }
          })
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // add
    addTab() {
      this.formData = { count: 0 }
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
                  message: '已删除该用户',
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
      this.$confirm('此操作将重置用户密码为默认密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const param = { id: row.id }
          resetPas(param)
            .then(res => {
              if (res.code == 200) {
                this.$notify({
                  title: '成功',
                  message: '密码重置成功',
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
            message: '已取消重置'
          })
        })
    },
    toDetail(row) {
      this.formData = Object.assign({}, row)
      let role = this.roles.filter(item => {
        return item.id == row.role
      })
      if (role.length == 1) {
        this.formData.roleName = role[0].name
      } else {
        this.formData.roleName = '不详'
      }
      this.detailIsShow = true
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
                    message: '用户修改成功',
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
                    message: '用户添加成功',
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
