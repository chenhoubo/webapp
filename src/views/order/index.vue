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
          label="订单编号"
          sortable
          width="240"
        ></el-table-column>
        <el-table-column prop="createDate" label="订购时间"> </el-table-column>
        <el-table-column prop="name" label="名称" sortable> </el-table-column>
        <el-table-column prop="totalPrice" label="支付金额"> </el-table-column>
        <el-table-column prop="status" label="订单状态">
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
              :disabled="scope.row.status === 0 ? true : false"
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
        <el-form-item label="订单编号">
          <el-input
            type="text"
            v-model="formData.id"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-for="(product, index) in formData.orderProducts"
          :label="'商品' + index"
          :key="product.id"
          :prop="'orderProducts.' + index + '.id'"
          :rules="{
            required: true,
            message: '商品信息不能为空',
            trigger: 'blur'
          }"
        >
          <el-select
            v-model="product.id"
            clearable
            placeholder="请选择"
            :disabled="editType == 'update'"
            @change="changeProduct(product)"
          >
            <el-option
              v-for="item in products"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-input-number
            v-model="product.count"
            :disabled="editType == 'update'"
            :min="1"
            :max="getProductCount(product)"
            label="数量"
          ></el-input-number>
          <el-button
            :disabled="editType == 'update'"
            style="margin-left:10px;"
            type="primary"
            icon="el-icon-circle-plus"
            circle
            @click="addFormDataProduct()"
          ></el-button>
          <el-button
            :disabled="editType == 'update'"
            type="danger"
            icon="el-icon-remove"
            circle
            v-if="formData.orderProducts.length > 1"
            @click.prevent="removeFormDataProduct(product)"
          ></el-button>
        </el-form-item>
        <el-form-item label="收件人" prop="receiveUser">
          <el-input
            type="text"
            :disabled="editType == 'update'"
            v-model="formData.receiveUser"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="tel">
          <el-input
            type="text"
            :disabled="editType == 'update'"
            v-model="formData.tel"
          ></el-input>
        </el-form-item>
        <el-form-item label="收件地址" prop="address">
          <el-input
            type="text"
            :disabled="editType == 'update'"
            v-model="formData.address"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="text"
            :disabled="editType == 'update'"
            v-model="formData.remark"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="订单状态"
          prop="status"
          v-show="editType == 'update'"
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
        <el-descriptions-item label="订单编号">
          {{ formData.id }}
        </el-descriptions-item>
        <el-descriptions-item label="订购时间">
          {{ formData.createDate }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ formData.updateDate }}
        </el-descriptions-item>
        <el-descriptions-item label="支付金额">
          {{ formData.totalPrice }}
        </el-descriptions-item>
        <el-descriptions-item label="收益">
          {{ formData.profit }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          {{ formData.status | statusText }}
        </el-descriptions-item>
        <el-descriptions-item label="收件人">
          {{ formData.receiveUser }}
        </el-descriptions-item>
        <el-descriptions-item label="联系方式">
          {{ formData.tel }}
        </el-descriptions-item>
        <el-descriptions-item label="收获地址">
          {{ formData.address }}
        </el-descriptions-item>
        <el-descriptions-item label="描述">
          {{ formData.remark }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="商品详情" :column="4" border></el-descriptions>
      <el-descriptions
        :column="4"
        border
        v-for="(item, index) in formData.orderProducts"
        contentStyle="width:200px;"
        labelStyle="width:100px;"
        :key="index"
      >
        <el-descriptions-item label="编号">
          {{ item.id }}
        </el-descriptions-item>
        <el-descriptions-item
          label="名称"
          label-class-name="my-label"
          content-class-name="my-content"
          >{{ item.name }}</el-descriptions-item
        >
        <el-descriptions-item label="价格">{{
          item.price
        }}</el-descriptions-item>
        <el-descriptions-item label="订购数量">{{
          item.count
        }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { getTableData } from '@/api/product'
import { save, update, page, del } from '@/api/order'
import { getUserByRole, getMsgList } from '@/api/user'
import { format } from '@/utils/component'
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
        { label: '未完成', value: 0 },
        { label: '已完成', value: 1 },
        { label: '已取消', value: 2 }
      ],
      users: [],
      msgList: [],
      products: [],
      rowIndex: 0,
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  // created() {
  //   this.getMsgLs()
  //   this.getUsers()
  //   this.getProducts()
  // },
  activated() {
    this.getMsgLs()
    this.getUsers()
    this.getProducts()
  },
  filters: {
    statusText(val) {
      if (val === undefined) return
      if (val === 0) {
        return '未完成'
      } else if (val === 1) {
        return '已完成'
      } else if (val === 2) {
        return '已取消'
      }
    },
    tagClass(val) {
      if (val === undefined) return
      if (val === 0) {
        return 'warning'
      } else if (val === 1) {
        return 'success'
      } else if (val === 1) {
        return 'danger'
      }
    }
  },
  methods: {
    getProducts() {
      let param = {
        status: 0,
        type: 1
      }
      getTableData(param)
        .then(res => {
          this.products = res.data.tableList
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
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
      page(param)
        .then(res => {
          let list = res.data.records.map(item => {
            return {
              ...item,
              createDate: format(item.createTime),
              updateDate: format(item.updateTime)
            }
          })
          // console.log('res:', list)
          this.tableData = list
          this.allList = list
          this.total = res.data.total
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    // add
    addTab() {
      // 初始化审核中
      this.formData = {
        orderProducts: [{ name: '', id: '', count: 0, price: 0 }]
      }
      this.diaIsShow = true
      this.editType = 'add'
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate()
      })
    },
    changeProduct(product) {
      for (let i = 0; i < this.products.length; i++) {
        if (product.id == this.products[i].id) {
          product.name = this.products[i].name
          product.price = this.products[i].price
          break
        }
      }
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
          delete this.formData.createDate
          delete this.formData.updateDate
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
                    message: '订单修改成功',
                    type: 'success'
                  })
                  this.getPageData()
                }
              })
              .catch(err => {
                this.$message.error(err)
              })
            this.diaIsShow = false
          } else {
            let totalPrice = 0
            let name = '订单:'
            for (let i = 0; i < this.formData.orderProducts.length; i++) {
              totalPrice +=
                this.formData.orderProducts[i].price *
                this.formData.orderProducts[i].count
              name += this.formData.orderProducts[i].name + ';'
            }
            this.formData.totalPrice = totalPrice
            this.formData.name = name
            console.log('新增:', this.formData)
            save(Object.assign({}, this.formData))
              .then(res => {
                if (res.code == 200) {
                  this.$notify({
                    title: '成功',
                    message: '订单创建成功',
                    type: 'success'
                  })
                  this.getPageData()
                }
              })
              .catch(error => {
                this.$message.error(error)
              })
            this.diaIsShow = false
          }
        } else {
          return
        }
      })
    },
    addFormDataProduct() {
      this.formData.orderProducts.push({
        name: '',
        id: '',
        count: 0
      })
    },
    removeFormDataProduct(item) {
      var index = this.formData.orderProducts.indexOf(item)
      if (index !== -1) {
        this.formData.orderProducts.splice(index, 1)
      }
    },
    getProductCount(item) {
      for (let i = 0; i < this.products.length; i++) {
        if (item.id == this.products[i].id) {
          return +this.products[i].count
        }
      }
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
.my-label {
  background: #e1f3d8;
}

.my-content {
  background: #fde2e2;
}
</style>
