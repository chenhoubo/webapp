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
          label="产品编号"
          sortable
          width="240"
        ></el-table-column>
        <el-table-column prop="name" label="名称" sortable width="180">
        </el-table-column>
        <el-table-column prop="price" label="价格"> </el-table-column>
        <el-table-column prop="count" label="剩余数量"> </el-table-column>
        <el-table-column prop="manufacturer" label="厂家"> </el-table-column>
        <el-table-column prop="type" label="审核结果" width="90">
          <template slot-scope="scope">
            <el-tag :type="scope.row.type | typeClass">{{
              scope.row.type | typeText
            }}</el-tag>
          </template>
        </el-table-column>
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
            <el-button type="warning" @click="toDetail(scope.row)"
              >详情</el-button
            >
            <el-button
              type="danger"
              @click="toDelete(scope.row)"
              :disabled="scope.row.status !== 3 ? false : true"
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
        <el-form-item label="系统编号">
          <el-input
            type="text"
            v-model="formData.id"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input type="text" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="审核者" prop="examine">
          <el-select v-model="formData.examine" placeholde="请选择管理员">
            <el-option
              v-for="item in users"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input type="text" v-model="formData.price"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input type="text" v-model="formData.count"></el-input>
        </el-form-item>
        <el-form-item label="型号" prop="model">
          <el-input type="text" v-model="formData.model"></el-input>
        </el-form-item>
        <el-form-item label="厂商" prop="manufacturer">
          <el-input type="text" v-model="formData.manufacturer"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="introduce">
          <el-input type="text" v-model="formData.introduce"></el-input>
        </el-form-item>
        <el-form-item
          label="产品状态"
          prop="status"
          v-show="editType == 'update' && formData.type == 1"
        >
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
    <el-dialog
      title="详情"
      :visible.sync="detailIsShow"
      class="diaForm"
      @closed="closeDetail()"
    >
      <el-descriptions :title="formData.name">
        <el-descriptions-item label="产品编号">
          {{ formData.id }}
        </el-descriptions-item>
        <el-descriptions-item label="价格">
          {{ formData.price }}
        </el-descriptions-item>
        <el-descriptions-item label="库存">
          {{ formData.count }}
        </el-descriptions-item>
        <el-descriptions-item label="型号">
          {{ formData.model }}
        </el-descriptions-item>
        <el-descriptions-item label="厂商">
          {{ formData.manufacturer }}
        </el-descriptions-item>
        <el-descriptions-item label="描述">
          {{ formData.introduce }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          {{ formData.status | statusText }}
        </el-descriptions-item>
        <el-descriptions-item label="审核状态">
          {{ formData.type | typeText }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import {
  pageProduct,
  updateProduct,
  addProduct,
  delProduct
} from '@/api/product'
import { getUserByRole, getMsgList } from '@/api/user'
export default {
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
        { label: '上架', value: 0 },
        { label: '下架', value: 1 }
      ],
      users: [],
      msgList: [],
      rowIndex: 0,
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        examine: [{ required: true, message: '请选择审核者', trigger: 'blur' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        count: [{ required: true, message: '请输入数量', trigger: 'blur' }],
        model: [{ required: true, message: '请输入型号', trigger: 'blur' }],
        manufacturer: [
          { required: true, message: '请输入厂商信息', trigger: 'blur' }
        ],
        introduce: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getMsgLs()
    this.getUsers()
  },
  filters: {
    statusText(val) {
      if (val === undefined) return
      if (val === 0) {
        return '已上架'
      } else if (val === 1) {
        return '已下架'
      }
    },
    tagClass(val) {
      if (val === undefined) return
      if (val === 0) {
        return 'success'
      } else if (val === 1) {
        return 'danger'
      }
    },
    typeText(val) {
      if (val === undefined) return
      if (val === 0) {
        return '审核中'
      } else if (val === 1) {
        return '通过'
      } else if (val === 2) {
        return '未通过'
      }
    },
    typeClass(val) {
      if (val === undefined) return
      if (val === 0) {
        return 'warning'
      } else if (val === 1) {
        return 'success'
      } else if (val === 2) {
        return 'danger'
      }
    }
  },
  methods: {
    getUsers() {
      // 获取角色为管理员的用户
      let param = { id: '1479296185101172737' }
      getUserByRole(param)
        .then(res => {
          this.users = res.data
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getMsgLs() {
      getMsgList()
        .then(res => {
          this.msgList = res.data.map(item => {
            return item.id
          })
          this.getPageData()
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
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
      pageProduct(param)
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
      // 初始化审核中
      this.formData = { type: 0, status: 1 }
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
          delProduct(param)
            .then(res => {
              if (res.code == 200) {
                this.$notify({
                  title: '成功',
                  message: '已删除该产品',
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
    toDetail(row) {
      this.formData = Object.assign({}, row)
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
    closeDetail() {
      // console.log('关闭回调')
      this.detailIsShow = false
      this.formData = {}
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
            updateProduct(this.tableData[start + this.rowIndex])
              .then(res => {
                if (res.code == 200) {
                  this.$notify({
                    title: '成功',
                    message: '产品修改成功',
                    type: 'success'
                  })
                  this.getPageData()
                }
              })
              .catch(err => {
                this.$message.error(err)
              })
          } else {
            addProduct(Object.assign({}, this.formData))
              .then(res => {
                if (res.code == 200) {
                  this.$notify({
                    title: '成功',
                    message: '产品添加成功',
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
    },
    examined(type) {
      let item = Object.assign({}, this.formData)
      item.type = type
      // console.log('item', item, type)
      this.$confirm('是否确定此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          updateProduct(item)
            .then(res => {
              if (res.code == 200) {
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success'
                })
                this.getMsgLs()
              }
            })
            .catch(err => {
              this.$message.error(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消此操作'
          })
        })
      this.detailIsShow = false
      this.formData = {}
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
