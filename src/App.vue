<template>
  <div :class="['app-container', theme]">
    <el-table
      v-if="columns.length && records.length"
      :data="records"
      border
      :default-sort="{ prop: columns[orderBy]?.title, order: order }"
      :fit="true"
    >
      <el-table-column
        v-for="(col, index) in columns"
        :key="col.title"
        :prop="col.title"
        :label="col.title"
        :min-width="col.minWidth"
        :align="leftAlign.includes(index) ? 'left' : 'center'"
      >
        <template #default="scope">
          <span class="cell-content">{{ scope.row[col.title] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="total > pageSize"
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      style="margin: 8px 0 0 auto; text-align: right; width: fit-content;"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAxiosInstance } from './api/axios';

const columns = ref<any[]>([]);
const records = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const theme = ref<'dark' | 'light'>('light');
const orderBy = ref<number>(0);
const order = ref<'ascending' | 'descending'>('ascending');
const leftAlign = ref<number[]>([]);

function handleSizeChange(val: number) {
  pageSize.value = val;
  page.value = 1;
  getAxiosInstance().then(({ instance, config }) => {
    fetchRecords(instance, config);
  });
}

async function fetchMeta(instance: any, config: any) {
  // 获取表字段元数据
  const { data } = await instance.get(`/meta/tables/${config.tableId}`);
  columns.value = data.columns
  .filter((f:any) => (f.system == 0 || f.system == null) && f.column_name !== 'id')
  .map((f: any) => {
    let minWidth = 100;
    const titleLength = f.title.length;
    
    // 根据标题长度设置最小宽度
    if (titleLength <= 2) {
      minWidth = 80;
    } else if (titleLength <= 4) {
      minWidth = 120;
    } else if (titleLength <= 6) {
      minWidth = 160;
    } else {
      minWidth = 200;
    }
    
    return {
      title: f.title,
      minWidth
    };
  });
}

async function fetchRecords(instance: any, config: any) {
  // 获取表数据
  const { data } = await instance.get(`/tables/${config.tableId}/records`, {
    params: {
      offset: (page.value-1)*pageSize.value,
      limit: pageSize.value,
      viewId: config.viewId
    }
  });
  records.value = data.list;
  total.value = data.pageInfo.totalRows;
}

async function init() {
  const { instance, config } = await getAxiosInstance();
  pageSize.value = config.pageSize || 20;
  theme.value = config.theme || 'light';
  orderBy.value = config.orderBy || 0;
  order.value = config.order || 'ascending';
  leftAlign.value = config.leftAlign || [];
  await fetchMeta(instance, config);
  await fetchRecords(instance, config);
}

function handlePageChange(val: number) {
  page.value = val;
  getAxiosInstance().then(({ instance, config }) => {
    fetchRecords(instance, config);
  });
}

onMounted(init);
</script>

<style src="./style.css"></style>
<style scoped>
.el-table {
  width: 100%;
  height: fit-content;
  table-layout: fixed;

  line-height: 1.5;
  font-weight: 400;
}

:deep(.el-table__header) th {
  text-align: center !important;
}

.cell-content {
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.5;
}

.app-container.dark :deep(.el-table) {
  --el-table-header-bg-color: #1e3e5d;
  --el-table-header-text-color: #ffffff;
  --el-table-text-color: ;
  --el-table-row-hover-bg-color: #1e3e5d;
  background-color: #606266;
}

.app-container.dark :deep(.el-table__row) {
  color: #ffffff;
  background-color: #606266;
}

.app-container.dark :deep(.el-table__row:hover td) {
  color: #ffffff;
  background-color: #1e3e5d;
}

.app-container.dark :deep(.el-table__header-wrapper) {
  background-color: #1e3e5d;
}

.app-container.dark :deep(.el-table__header) {
  color: #ffffff;
  background-color: #1e3e5d;
}

.app-container.dark :deep(.el-table__body tr:hover > td) {
  background-color: #1e3e5d20 !important;
}

.app-container.dark :deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background-color: #1e3e5d20;
}
</style>
