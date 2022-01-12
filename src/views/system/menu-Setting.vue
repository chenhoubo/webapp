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
        <el-button type="primary" icon="el-icon-search" @click="searchTab()"
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
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          prop="id"
          label="编号"
          sortable
          width="280"
        ></el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          sortable
          width="200"
        >
        </el-table-column>
        <el-table-column prop="name" label="名称" sortable width="180">
        </el-table-column>
        <el-table-column prop="pageUrl" label="路径"> </el-table-column>
        <el-table-column prop="component" label="组件"> </el-table-column>
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
        <el-form-item label="编号">
          <el-input
            type="text"
            v-model="formData.id"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input type="text" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单" prop="pid">
          <el-select v-model="formData.pid" placeholde="请选择父级菜单">
            <el-option
              v-for="item in pids"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="meta">
          <el-input
            type="textarea"
            v-model="formData.meta"
            @input="changeMeta($event)"
            placeholder="非必填"
          ></el-input>
        </el-form-item>
        <el-form-item label="redirect">
          <el-input
            type="text"
            v-model="formData.redirect"
            placeholder="非必填"
          ></el-input>
        </el-form-item>
        <el-form-item label="component">
          <el-input
            type="text"
            v-model="formData.component"
            placeholder="非必填"
          ></el-input>
        </el-form-item>
        <el-form-item label="pageUrl" prop="pageUrl">
          <el-input type="text" v-model="formData.pageUrl"></el-input>
        </el-form-item>
        <el-form-item label="是否隐藏" prop="hidden">
          <el-select v-model="formData.hidden" placeholde="请选择是否隐藏">
            <el-option
              v-for="(item, index) in hiddens"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholde="请选择状态">
            <el-option
              v-for="(item, index) in options"
              :label="item.label"
              :value="item.value"
              :key="index"
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
  </div>
</template>

<script>
import { getAll, update, save, del } from '@/api/menu'
export default {
  data() {
    return {
      tableData: [],
      allList: [],
      schArr: [],
      sch_id: '',
      sch_status: null,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40],
      diaIsShow: false,
      formData: {},
      editType: '',
      options: [
        { label: '启用', value: 0 },
        { label: '关闭', value: 1 }
      ],
      pids: [{ name: '一级目录', id: '0' }],
      hiddens: [
        { label: '否', value: false },
        { label: '是', value: true }
      ],
      rowIndex: 0,
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        pageUrl: [{ required: true, message: '请输入路径', trigger: 'blur' }],
        hidden: [
          { required: true, message: '请选择隐藏状态', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择订单状态', trigger: 'change' }
        ]
      }
    }
  },
  // created() {
  //   this._getPageTab2()
  // },
  activated() {
    this._getPageTab2()
  },
  filters: {
    statusText(val) {
      if (val === undefined) return
      if (val === 0) {
        return '启用'
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
    _getPageTab2() {
      getAll()
        .then(res => {
          this.allList = res.data
          this.schArr = res.data
          this.pids = this.pids.concat(res.data)
          this.getPageData()
          this.total = res.data.length
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    getPageData() {
      let start = (this.currentPage - 1) * this.pageSize
      let end = start + this.pageSize
      this.tableData = this.schArr.slice(start, end)
    },
    // 查找
    searchTab() {
      let arrList = []
      for (let item of this.allList) {
        if (
          this.sch_id.trim() === '' &&
          (this.sch_status === null || this.sch_status === '')
        ) {
          arrList = this.allList
          break
        } else if (
          item.id.startsWith(this.sch_id) &&
          (this.sch_status === null || this.sch_status === ''
            ? true
            : item.status === this.sch_status)
        ) {
          let obj = Object.assign({}, item)
          arrList.push(obj)
        }
      }
      this.schArr = arrList
      this.total = arrList.length
      this.currentPage = 1
      this.pageSize = 10
      this.getPageData()
    },
    // add
    addTab() {
      this.formData = {}
      this.diaIsShow = true
      this.editType = 'add'
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate()
      })
    },
    // 删除
    toDelete(row) {
      const param = { id: row.id }
      del(param)
        .then(res => {
          if (res.code == 200) {
            this.$notify({
              title: '成功',
              message: '已删除该菜单',
              type: 'success'
            })
            this._getPageTab2()
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 编辑
    editTable(index, row) {
      this.formData = Object.assign({}, row)
      this.formData.meta = JSON.stringify(this.formData.meta)
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
            this.allList[start + this.rowIndex] = Object.assign(
              {},
              this.formData
            )
            delete this.allList[start + this.rowIndex].updateTime
            delete this.allList[start + this.rowIndex].children
            this.allList[start + this.rowIndex].meta = JSON.parse(
              this.formData.meta
            )
            update(this.allList[start + this.rowIndex])
              .then(res => {
                if (res.code == 200) {
                  this.$notify({
                    title: '成功',
                    message: '菜单修改成功',
                    type: 'success'
                  })
                  this._getPageTab2()
                }
              })
              .catch(err => {
                this.$message.error(err)
              })
          } else {
            save(Object.assign({}, this.formData))
              .then(res => {
                if (res.code == 200) {
                  this.tableData.unshift(Object.assign({}, this.formData))
                  this.allList.push(Object.assign({}, this.formData))
                  this.$notify({
                    title: '成功',
                    message: '权限添加成功',
                    type: 'success'
                  })
                }
              })
              .catch(error => {
                this.$message.error(error)
              })
          }
          // location.reload()
          this.diaIsShow = false
        } else {
          return
        }
      })
    },
    changeMeta() {
      //强制刷新
      this.$forceUpdate()
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
