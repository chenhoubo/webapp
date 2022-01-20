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
        <el-button type="primary" icon="el-icon-upload" @click="upload"
          >上传</el-button
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
          prop="createDate"
          label="创建时间"
          sortable
          width="180"
        >
        </el-table-column>
        <el-table-column prop="name" label="文件名称" sortable width="180">
        </el-table-column>
        <el-table-column prop="fileType" label="文件类型" sortable width="180">
        </el-table-column>
        <el-table-column prop="size" label="文件大小"> </el-table-column>
        <el-table-column prop="fileFolder" label="文件目录"> </el-table-column>
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
            >
              编辑
            </el-button>
            <el-button type="warning" @click="toDetail(scope.row)">
              详情
            </el-button>
            <el-button type="primary" @click="toDownload(scope.row)">
              下载
            </el-button>
            <el-button
              type="danger"
              @click="toDelete(scope.row)"
              :disabled="rolevalue === 'admin' ? false : true"
              >删除</el-button
            >
            <!-- <el-link
              type="primary"
              :href="
                downloadUrl +
                  scope.row.fileFolder +
                  '&filename=' +
                  scope.row.name
              "
              :download="scope.row.name"
              style="margin-left: 10px;"
              icon="el-icon-download"
              >下载</el-link
            > -->
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
    <el-dialog title="上传" :visible.sync="upIsShow" class="diaForm">
      <el-form
        ref="uploadForm"
        :model="formData"
        :rules="uploadRules"
        label-width="140px"
      >
        <el-form-item label="文件目录" prop="fileFolder">
          <el-input type="text" v-model="formData.fileFolder"></el-input>
        </el-form-item>
        <el-form-item label="文件大小">
          <el-upload
            ref="upload"
            class="upload-demo"
            action="no"
            :on-change="handleChange"
            :file-list="fileList"
            :limit="1"
            :multiple="false"
            :auto-upload="false"
            name="uploadFile"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item label="文件描述" prop="desc">
          <el-input type="text" v-model="formData.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="upIsShow = false">取消</el-button>
          <el-button @click="submitUpload">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="diaIsShow" class="diaForm">
      <el-form
        ref="diaForm"
        :model="formData"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="编号">
          <el-input type="text" v-model="formData.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="文件名" prop="name">
          <el-input type="text" v-model="formData.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="文件类型" prop="fileType">
          <el-input type="text" v-model="formData.fileType" disabled></el-input>
        </el-form-item>
        <el-form-item label="文件大小" prop="size">
          <el-input type="text" v-model="formData.size" disabled></el-input>
        </el-form-item>
        <el-form-item label="文件目录" prop="fileFolder">
          <el-input
            type="text"
            v-model="formData.fileFolder"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="文件路径" prop="filePath">
          <el-input type="text" v-model="formData.filePath" disabled></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="text" v-model="formData.desc"></el-input>
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
        <el-descriptions-item label="编号">
          {{ formData.id }}
        </el-descriptions-item>
        <el-descriptions-item label="名称">
          {{ formData.name }}
        </el-descriptions-item>
        <el-descriptions-item label="大小">
          {{ formData.size }}
        </el-descriptions-item>
        <el-descriptions-item label="类型">
          {{ formData.fileType }}
        </el-descriptions-item>
        <el-descriptions-item label="目录">
          {{ formData.fileFolder }}
        </el-descriptions-item>
        <el-descriptions-item label="路径">
          {{ formData.filePath }}
        </el-descriptions-item>
        <el-descriptions-item label="描述">
          {{ formData.desc }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          {{ formData.status | statusText }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { upload, download, update, del, page } from '@/api/file'
import { mapGetters } from 'vuex'
import { format, createAndDownloadFile } from '@/utils/component'
import store from '@/store'
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
      upIsShow: false,
      detailIsShow: false,
      formData: {},
      editType: '',
      options: [
        { label: '可用', value: 0 },
        { label: '禁用', value: 1 }
      ],
      hiddens: [
        { label: '否', value: false },
        { label: '是', value: true }
      ],
      rowIndex: 0,
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        fileType: [{ required: true, message: '请输入类型', trigger: 'blur' }],
        size: [{ required: true, message: '请输入大小', trigger: 'blur' }],
        fileFolder: [
          { required: true, message: '请输入文件目录', trigger: 'blur' }
        ],
        filePath: [
          { required: true, message: '请输入文件路径', trigger: 'change' }
        ]
      },
      uploadRules: {
        fileFolder: [
          { required: true, message: '请输入文件目录', trigger: 'blur' }
        ],
        desc: [{ required: true, message: '请输入描述信息', trigger: 'blur' }]
      },
      fileList: [],
      uploadUrl: '',
      headers: {}
    }
  },
  // created() {
  //   this.getPageData()
  // },
  activated() {
    this.getPageData()
    this.headers.auth = store.getters.token
    this.downloadUrl = process.env.VUE_APP_BASE_API + '/file/download?folder='
  },
  filters: {
    statusText(val) {
      if (val === undefined) return
      if (val === 0) {
        return '可用'
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
          let list = res.data.records.map(item => {
            return {
              ...item,
              createDate: format(item.createTime)
            }
          })
          this.tableData = list
          this.allList = list
          this.total = res.data.total
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    upload() {
      this.formData = {}
      this.upIsShow = true
      this.editType = 'upload'
      this.$nextTick(() => {
        this.$refs.uploadForm.clearValidate()
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
                  message: '已删除该文件',
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
    toDownload(row) {
      this.$confirm('确定下载?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let param = {
            folder: row.fileFolder,
            filename: row.name
          }
          // download(param)
          //   .then(res => {
          //     createAndDownloadFile(row.name, res)
          //     this.$notify({
          //       title: '成功',
          //       message: '文件下载成功',
          //       type: 'success'
          //     })
          //   })
          //   .catch(err => {
          //     this.$message.error(err)
          //   })
          let link = document.createElement('a')
          link.href =
            this.downloadUrl + param.folder + '&filename=' + param.filename
          link.download = param.filename
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
          this.$notify({
            title: '成功',
            message: '文件下载成功',
            type: 'success'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消下载'
          })
        })
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
            delete this.formData.createDate
            this.tableData[start + this.rowIndex] = Object.assign(
              {},
              this.formData
            )
            update(this.tableData[start + this.rowIndex])
              .then(res => {
                if (res.code == 200) {
                  this.$notify({
                    title: '成功',
                    message: '文件修改成功',
                    type: 'success'
                  })
                  this.getPageData()
                }
              })
              .catch(err => {
                this.$message.error(err)
              })
          }
          this.diaIsShow = false
        } else {
          return
        }
      })
    },
    handleChange(file, fileList) {
      // console.log('file:', file, fileList)
      this.fileList = fileList
    },
    submitUpload() {
      this.$refs['uploadForm'].validate(valid => {
        if (valid && this.fileList.length > 0) {
          let param = new FormData()
          param.append('uploadFile', this.fileList[0].raw)
          param.append('desc', this.formData.desc)
          upload(this.formData.fileFolder, param)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '文件上传成功',
                type: 'success'
              })
              this.getPageData()
              this.fileList = []
            })
            .catch(err => {
              this.$message.error(err)
            })
          this.upIsShow = false
        } else {
          this.$message.error('未选择文件')
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
