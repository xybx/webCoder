<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
      </div>
    </template>
    <div class="text item codebox">
      <el-row :gutter="15">
        <el-col :span="4">
          <el-tree
            :props="layerProps"
            :data="layerData"
            class="layer-tree"
            empty-text="暂无数据"
            ref="layerTree"
            :expand-on-click-node="false"
            :current-node-key="cnodekey"
            :highlight-current="highcurrent"
            :render-after-expand="false"
            node-key="pid"
            default-expand-all
            @node-click="menuClick"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                {{ data.label }}
              </span>
            </template>
          </el-tree>
        </el-col>
        <el-col :span="20">
          <queryForm
            ref="queryRef"
            :comcode="true"
            @queryData="queryClick"
            @handleAdd="handleAdd"
          />
          <el-table
            ref="tableRef"
            :data="tableData"
            border
            v-loading="tabloading"
            :element-loading-text="loadingText"
          >
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="60px"
            ></el-table-column>
            <el-table-column
              v-for="item in tableColumns"
              align="center"
              :key="item.prop"
              :label="item.label"
            >
              <template v-if="item.prop == 'type'" #default="{ row, $index }">
                {{ row[item.prop] == 1 ? "url" : "json" }}
              </template>
              <template v-else #default="{ row, $index }">
                {{ row[item.prop] ? row[item.prop] : "暂无数据" }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template #default="{ row, $index }">
                <el-button type="primary" @click="editClick(row.pid)"
                  >编辑</el-button
                >
                <el-button type="danger" @click="delClick(row.pid)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-model:current-page="pageNum"
            v-model:page-size="pageSize"
            :page-sizes="pageSizes"
            background
            layout="total, sizes , prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>
    </div>
    <comdialog ref="comRef" :tempid="cnodekey" @getData="getTableList" />
  </el-card>
</template>

<script setup lang="ts">
import type { queryPorps, TableProps, TabPorps } from "./ts/Types.ts";
import queryForm from "./components/queryForm.vue";
import comdialog from "./components/comdialog.vue";
import { delCode, getCodeList, getCodeTree } from "./api/comcodeapi.ts";
import { ElAside, ElMessage } from "element-plus";

defineOptions({
  name: "commonCode",
});
const route = useRoute();
let title: any = route.meta.title;
const tableData = ref<TableProps[] | []>([]);
const tabloading = ref<boolean>(true);
const loadingText = ref<string>("正在加载...");
const queryRef = ref<any>();
const tableRef = ref<any>();
const comRef = ref<any>();
const tableColumns = ref<TabPorps[] | []>([]);
const total = ref<number>(0);
const pageSizes = ref<number[]>([10, 15, 20, 30]);
const pageSize = ref<number>(10);
const pageNum = ref<number>(1);
const formdata = ref<queryPorps>({});
const layerTree = ref<any>();
const layerData = ref<any>([]);
const cnodekey = ref<number>(0);
const layerProps = {
  children: "children",
  label: "label",
};
const highcurrent = ref<boolean>(true);
const $baseMessage = inject<any>("$baseMessage");
const $baseConfirm = inject<any>("$baseConfirm");

const getTableColumns = () => {
  tableColumns.value = [
    { prop: "name", label: "模板名称" },
    { prop: "typename", label: "模板类型" },
    { prop: "img", label: "预览图" },
    { prop: "des", label: "模板描述" },
  ];
};

const menuClick = (data: any) => {
  highcurrent.value = true;
  cnodekey.value = data.pid;
  queryRef.value.clearComcode();
  getTableList();
};

const getTreeData = async () => {
  let { data } = await getCodeTree();
  console.log(data);

  getLayerData(data);

  if (data.length > 0) {
    cnodekey.value = data[0].id;
    await getTableList();
  } else {
    tableData.value = [];
    tabloading.value = false;
    ElMessage.warning("暂无可用模板风格");
  }
};

const getLayerData = (arr: any) => {
  layerData.value = arr.map((item: any) => {
    return {
      pid: item.id,
      label: item.title,
      children:
        item.children && item.children.length > 0
          ? getLayerData(item.children)
          : null,
    };
  });
  console.log(layerData.value);

  return layerData.value;
};

const getTableList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    templatestylepid: cnodekey.value,
  };
  layerTree.value.setCurrentKey(cnodekey.value);
  let obj = formdata.value;
  let arr = Object.keys(obj);
  for (let i in obj) {
    if (arr.includes(i)) {
      Object.assign(params, obj);
    }
  }
  let res: any = await getCodeList(params);
  console.log(res);

  if (res.code == 200) {
    tableData.value = res.data.list;
    total.value = res.data.total;
  } else {
    tableData.value = [];
    total.value = 0;
  }
  setTimeout(() => {
    tabloading.value = false;
  }, 200);
};

const queryClick = (obj: queryPorps) => {
  formdata.value = obj;
  getTableList();
};

const handleAdd = () => {
  comRef.value.showCode(null, 1);
};

const editClick = (pid: number) => {
  comRef.value.showCode(pid, 2);
};

const delClick = async (pid: number) => {
  $baseConfirm("你确定要删除吗？", "删除提示", async () => {
    let res: any = await delCode({ pid: pid });
    if (res.code == 200) {
      $baseMessage("已删除成功", "success");
      getTableList();
    } else {
      $baseMessage("删除失败", "error");
    }
  });
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  getTableList();
};

const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getTableList();
};
watch(
  () => route.path,
  async (newValue, oldValue) => {
    await getTableList();
    getTableColumns();
  }
);
tryOnMounted(async () => {
  await getTreeData();
  getTableColumns();
});
</script>

<style scoped lang="scss">
@use "./style/manage.scss";
</style>
