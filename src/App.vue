<template>
  <div :class="['app-container', theme]">
    <el-table
      v-if="columns.length && records.length"
      :data="records"
      border
      :default-sort="{ prop: columns[orderBy]?.fieldName, order: order }"
      :fit="true"
    >
      <el-table-column
        v-for="col in columns"
        :key="col.fieldName"
        :prop="col.fieldName"
        :label="col.title"
        :min-width="120"
        show-overflow-tooltip
      />
    </el-table>
    <el-pagination
      v-if="total > pageSize"
      background
      :current-page="page"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
      @current-change="handlePageChange"
      style="margin: 8px auto 0 auto; text-align: center;"
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

async function fetchMeta(instance: any, config: any) {
  // 获取表字段元数据
  const { data } = await instance.get(`/meta/tables/${config.tableId}`);
  columns.value = data.columns
  .filter((f:any) => (f.system == 0 || f.system == null) && f.column_name !== 'id')
  .map((f: any) => ({
    fieldName: f.column_name,
    title: f.title || f.column_name
  }));
}

async function fetchRecords(instance: any, config: any) {
  // 获取表数据
  const { data } = await instance.get(`/tables/${config.tableId}/records`, {
    params: {
      offset: (page.value-1)*pageSize.value,
      limit: pageSize.value
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
  
  font-size: 14px;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft Yahei', Arial, sans-serif;

  line-height: 1.5;
  font-weight: 400;

  text-align: center;
}
</style>
