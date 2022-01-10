<template>
  <div>
    <el-table
      :data="tableData"
      height="390"
      border
      style="width: 96%;box-shadow: 0 0 10px #e2e2e2;"
    >
      <el-table-column prop="id" label="ID#" width="180"></el-table-column>
      <el-table-column prop="name" label="产品名称"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="count" label="数量"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag
            :type="
              scope.row.type == 1
                ? 'success'
                : scope.row.type == 0
                ? 'warning'
                : 'danger'
            "
            >{{
              scope.row.type == 1
                ? scope.row.status == 0
                  ? '上架'
                  : '下架'
                : scope.row.type == 0
                ? '审批中'
                : '审批失败'
            }}</el-tag
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      required: true
    }
  },
  filters: {
    statusText(val) {
      if (val === undefined) return
      if (val === 0) {
        return '已完成'
      } else if (val === 1) {
        return '进行中'
      } else {
        return '已取消'
      }
    },
    tagClass(val) {
      if (val === undefined) return
      if (val === 0) {
        return 'success'
      } else if (val === 1) {
        return 'warning'
      } else {
        return 'danger'
      }
    }
  }
}
</script>
