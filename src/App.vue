<template>
  <div :class="['app-container', theme]">
    <el-table
      v-if="columns.length && records.length"
      :data="records"
      style="width: 100%; height: 100vh"
      :header-cell-style="{ background: theme === 'dark' ? '#222' : '#fff' }"
      :cell-style="{ color: theme === 'dark' ? '#eee' : '#222' }"
      border
      :default-sort="{ prop: columns[0]?.fieldName, order: 'ascending' }"
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
      style="margin: 16px auto; text-align: center;"
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

async function fetchMeta(instance: any, config: any) {
  // 获取表字段元数据
  const { data } = await instance.get(`/meta/tables/${config.tableId}`);
  columns.value = data.columns.filter((f:any) => f.system == 0).map((f: any) => ({
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
