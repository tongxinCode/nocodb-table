# nocodb-table

本项目是一个基于vue3+vite+element-plus+axios的简单网页项目，用于将nocodb特定表/视图转换为独立网页，主要用于特定样式的iframe嵌入。

## 特点

1. apiUrl、viewId、xcToken可基于配置文件配置
2. dark、light两种主题可基于配置文件配置
3. 分页大小可基于配置文件配置
4. table字段基于meta数据动态构建 
    [meta api](https://nocodb.com/apis/v2/meta#tag/Tables/operation/db-table-read)
    [record api](https://nocodb.com/apis/v2/data#tag/Table-Records/operation/db-data-table-row-list)
5. 表格样式默认全屏，字段宽度自适应
    [element-plus guide](https://element-plus.org/zh-CN/component/table.html)

## 目录结构

配置文件config.json位于public
接口定义axios.ts位于src/api
主要代码App.vue位于src

## 注意

1. 本项目为单页面应用
2. 本项目并未考虑token安全性
