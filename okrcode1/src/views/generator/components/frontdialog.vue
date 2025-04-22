<template>
  <el-dialog
    :modelValue="dialogVisible"
    :title="title"
    width="95%"
    class="frontbox"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :append-to-body="true"
    align-center
    center
  >
    <ul class="flist">
      <li>
        <label>模板风格：</label>
        <el-select
          v-model="temname"
          placeholder="请选择模板风格"
          clearable
          @change="tempChange"
          :filterable="true"
        >
          <el-option
            v-for="item in temData"
            :value="item.pid as number"
            :label="item.label"
          ></el-option>
        </el-select>
      </li>
      <li>
        <label>数据源名称：</label>
        <span>{{ dataSourceName }}</span>
      </li>
      <li>
        <label>配置表名称：</label>
        <span>{{ tableName }}</span>
      </li>
    </ul>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in tabsData"
        :key="item.pid"
        :label="item.label"
        :name="item.index"
      >
        <div class="funcbox">
          <el-button type="primary" @click="refreshConfig"
            >刷新配置项</el-button
          >
          <el-button type="primary" @click="exportField">导入字段</el-button>
          <el-checkbox-group v-model="checkList" @change="checkChange">
            <template #default>
              <ul class="clist">
                <li v-for="(item, index) in optionData" :key="item.pid">
                  <el-checkbox :label="item.pid as number">{{
                    item.label
                  }}</el-checkbox>
                  <span class="preview" @click="checkView(item.img as string)"
                    >(效果预览)</span
                  >
                </li>
              </ul>
            </template>
          </el-checkbox-group>
        </div>
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
            <template
              v-if="item.prop == 'columnshow'"
              #default="{ row, $index }"
            >
              <el-select
                v-model="row.columnshow"
                filterable
                clearable
                :placeholder="translate('请选择是否生成')"
                @change="showChange($event, row)"
              >
                <el-option value="是" label="是"></el-option>
                <el-option value="否" label="否"></el-option>
              </el-select>
            </template>
            <template
              v-else-if="item.prop == 'titlename'"
              #default="{ row, $index }"
            >
              <el-input
                type="text"
                v-model="row.titlename"
                :placeholder="translate('请输入列头')"
                autocomplete="off"
                clearable
                @change="showChange($event, row)"
              />
            </template>
            <template
              v-else-if="item.prop == 'text'"
              #default="{ row, $index }"
            >
              <el-input
                type="text"
                v-model="row.text"
                :placeholder="translate('请输入显示值')"
                autocomplete="off"
                clearable
                @change="showChange($event, row)"
              />
            </template>
            <template
              v-else-if="item.prop == 'issearch'"
              #default="{ row, $index }"
            >
              <el-select
                v-model="row.issearch"
                filterable
                clearable
                :placeholder="translate('请选择是否查询')"
                @change="showChange($event, row)"
              >
                <el-option value="是" label="是"></el-option>
                <el-option value="否" label="否"></el-option>
              </el-select>
            </template>
            <template
              v-else-if="item.prop == 'issort'"
              #default="{ row, $index }"
            >
              <el-select
                v-model="row.issort"
                filterable
                clearable
                :placeholder="translate('请选择是否排序')"
                @change="showChange($event, row)"
              >
                <el-option value="是" label="是"></el-option>
                <el-option value="否" label="否"></el-option>
              </el-select>
            </template>
            <template
              v-else-if="item.prop == 'searchtype'"
              #default="{ row, $index }"
            >
              <el-select
                v-model="row.searchtype"
                filterable
                clearable
                :placeholder="translate('请选择查询框类型')"
                @change="showChange($event, row)"
              >
                <el-option
                  v-for="item in searchData"
                  :key="item.pid as string"
                  :value="item.pid"
                  :label="item.label"
                ></el-option>
              </el-select>
            </template>
            <template
              v-else-if="item.prop == 'isrequired'"
              #default="{ row, $index }"
            >
              <el-select
                v-model="row.isrequired"
                filterable
                clearable
                :placeholder="translate('请选择是否必填')"
                @change="showChange($event, row)"
              >
                <el-option value="是" label="是"></el-option>
                <el-option value="否" label="否"></el-option>
              </el-select>
            </template>
            <template
              v-else-if="item.prop == 'dictionarypid'"
              #default="{ row, $index }"
            >
              <el-select
                v-model="row.dictionarypid"
                filterable
                clearable
                :placeholder="translate('请选择字典取值')"
                @change="showChange($event, row)"
              >
                <el-option
                  v-for="item in dictData"
                  :key="item.pid as number"
                  :value="item.pid"
                  :label="item.label"
                ></el-option>
              </el-select>
            </template>
            <template
              v-else-if="item.prop == 'timetype'"
              #default="{ row, $index }"
            >
              <el-select
                v-model="row.timetype"
                filterable
                clearable
                :placeholder="translate('请选择日期显示格式')"
                @change="showChange($event, row)"
              >
                <el-option
                  v-for="item in timeData"
                  :key="item.pid as string"
                  :value="item.pid"
                  :label="item.label"
                ></el-option>
              </el-select>
            </template>
            <template
              v-else-if="item.prop == 'fileformat'"
              #default="{ row, $index }"
            >
              <el-input
                type="text"
                v-model="row.fileformat"
                :placeholder="translate('请输入文件限制格式')"
                autocomplete="off"
                clearable
                @change="showChange($event, row)"
              />
            </template>
            <template
              v-else-if="item.prop == 'formtype'"
              #default="{ row, $index }"
            >
              <el-select
                v-model="row.formtype"
                filterable
                clearable
                :placeholder="translate('请选择Form类型')"
                @change="showChange($event, row)"
              >
                <el-option
                  v-for="item in typeData"
                  :key="item.pid as string"
                  :value="item.pid"
                  :label="item.label"
                ></el-option>
              </el-select>
            </template>
            <template
              v-else-if="item.prop == 'sort'"
              #default="{ row, $index }"
            >
              <el-input
                type="text"
                v-model="row.sort"
                :placeholder="translate('请输入排序')"
                autocomplete="off"
                clearable
                @change="showChange($event, row)"
              />
            </template>
            <template
              v-else-if="item.prop == 'rownum'"
              #default="{ row, $index }"
            >
              <el-input
                type="text"
                v-model="row.rownum"
                :placeholder="translate('请输入行号')"
                autocomplete="off"
                clearable
                @change="showChange($event, row)"
              />
            </template>
            <template
              v-else-if="item.prop == 'columnnum'"
              #default="{ row, $index }"
            >
              <el-input
                type="text"
                v-model="row.columnnum"
                :placeholder="translate('请输入列号')"
                autocomplete="off"
                clearable
                @change="showChange($event, row)"
              />
            </template>
            <template v-else #default="{ row, $index }">
              {{ row[item.prop] ? row[item.prop] : "暂无数据" }}
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
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" size="large" @click="generData"
          >生成文件</el-button
        >
        <el-button type="warning" size="large" @click="previewData"
          >代码预览</el-button
        >
        <el-button size="large" @click="handleClose">关闭</el-button>
      </span>
    </template>
    <codeDialog ref="codesRef" />
  </el-dialog>

  <!-- 效果预览 -->
  <el-dialog
    :modelValue="imageDialog"
    title="效果预览"
    width="60%"
    class="frontbox"
    :close-on-click-modal="false"
    :before-close="closeImage"
    :append-to-body="true"
    align-center
    center
  >
    <el-carousel height="700px" :loop="false">
      <el-carousel-item
        v-for="item in imageList"
        :key="item"
        style="text-align: center"
      >
        <el-image :src="baseUrl + item" />
      </el-carousel-item>
    </el-carousel>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  getTemSelect,
  getUidData,
  getTabsName,
  getCheckData,
  getDictData,
  getTimeData,
  getFormData,
  putField,
  putForm,
  getTableListData,
  getTableAddData,
  getSearchData,
  putListData,
  putAddData,
  putTail,
  editTail,
  getTailList,
} from "/@/views/generator/api/generatorapi.ts";
import { ArrayTypeProps } from "/@/views/login/ts/loginType.ts";
import { ElLoading, TabsPaneContext } from "element-plus";
import type { TableProps, TabPorps } from "/@/views/generator/ts/Types.ts";
import codeDialog from "./codeDialog.vue";
import { translate } from "/@/i18n";
const dialogVisible = ref<boolean>(false);
const title = ref<string>("");
const temname = ref<string | number>();
const temData = ref<ArrayTypeProps[] | []>([]);
const tabsData = ref<ArrayTypeProps[] | []>([]);
const dataSourceName = ref<string>("");
const tableName = ref<string>("");
const activeName = ref<any>();
const tableData = ref<TableProps[] | []>([]);
const tabloading = ref<boolean>(true);
const loadingText = ref<string>("正在加载...");
const tableRef = ref<any>();
const tableColumns = ref<TabPorps[] | []>([]);
const checkList = ref<string[]>([]);
const uid = ref<string>();
const optionData = ref<ArrayTypeProps[] | []>([]);
const total = ref<number>(0);
const pageSizes = ref<number[]>([10, 15, 20, 30]);
const pageSize = ref<number>(10);
const pageNum = ref<number>(1);
const searchData = ref<ArrayTypeProps[] | []>([]);
const dictData = ref<ArrayTypeProps[] | []>([]);
const timeData = ref<ArrayTypeProps[] | []>([]);
const typeData = ref<ArrayTypeProps[] | []>([]);
const codesRef = ref<any>();
const $baseMessage = inject<any>("$baseMessage");
const emit = defineEmits(["getData"]);

const showFront = async (pid: string) => {
  title.value = "前端代码生成";
  uid.value = pid;
  await getTem();
  await getTopData();
  await getTabName();
  activeName.value = tabsData.value[0].pid;
  await getCheckList();
  await getTableColumn();
  await getDict();
  await getForm();
  await getTime();
  await getSearch();
  dialogVisible.value = true;
};

const getTem = async () => {
  let { data } = await getTemSelect();
  temData.value =
    data.length > 0
      ? data.map((item: any) => {
          return {
            pid: item.value,
            label: item.text,
          };
        })
      : [];
};

const getTopData = async () => {
  let { data } = await getUidData({ uuid: uid.value });
  dataSourceName.value = data.dataSourceName;
  tableName.value = data.tableName;
  temname.value = temData.value[0].pid;
};

const getDict = async () => {
  let { data } = await getDictData({ uuid: uid.value });
  dictData.value =
    data.length > 0
      ? data.map((item: any) => {
          return {
            pid: item.value,
            label: item.text,
          };
        })
      : [];
};

const getForm = async () => {
  let { data } = await getFormData();
  typeData.value =
    data.length > 0
      ? data.map((item: any) => {
          return {
            pid: item.value,
            label: item.text,
          };
        })
      : [];
};

const getSearch = async () => {
  let { data } = await getSearchData();
  searchData.value =
    data.length > 0
      ? data.map((item: any) => {
          return {
            pid: item.value,
            label: item.text,
          };
        })
      : [];
};

const getTime = async () => {
  let { data } = await getTimeData();
  timeData.value =
    data.length > 0
      ? data.map((item: any) => {
          return {
            pid: item.value,
            label: item.text,
          };
        })
      : [];
};

// 选项卡切换渲染
const getTabName = async () => {
  let res: any = await getTabsName({ templatestylepid: temname.value });
  if (res.code == 200) {
    tabsData.value =
      res.data.length > 0
        ? res.data.map((item: any) => {
            return {
              pid: item.pid,
              label: item.typename,
              index: item.index,
            };
          })
        : [];
  }
};
// 多选渲染
const getCheckList = async () => {
  let res: any = await getCheckData({
    templatestylepid: temname.value,
    typepid: activeName.value,
  });
  if (res.code == 200) {
    optionData.value =
      res.data.length > 0
        ? res.data.map((item: any) => {
            return {
              pid: item.pid,
              label: item.name,
              img: item.img,
            };
          })
        : [];
  }
};

const tempChange = async (val: number) => {
  temname.value = val;
  await getTabName();
  activeName.value = tabsData.value[0].pid;
  await getCheckList();
  await getTableColumn();
};

const getTableColumn = async () => {
  let arr = <TabPorps[]>[
    { prop: "columnname", label: "字段名称" },
    { prop: "columntype", label: "字段类型" },
    { prop: "columnshow", label: "是否生成" },
  ];
  let obj = {
    1: [
      { prop: "titlename", label: "列头" },
      { prop: "issearch", label: "是否查询" },
      { prop: "searchtype", label: "查询框类型" },
      { prop: "dictionarypid", label: "字典取值" },
      { prop: "timetype", label: "日期显示格式" },
      { prop: "issort", label: "是否排序" },
      { prop: "sort", label: "排序" },
    ],
    2: [
      { prop: "text", label: "显示值" },
      { prop: "isrequired", label: "是否必填" },
      { prop: "formtype", label: "Form类型" },
      { prop: "dictionarypid", label: "字典取值" },
      { prop: "timetype", label: "日期显示格式" },
      { prop: "fileformat", label: "文件限制格式" },
      { prop: "rownum", label: "行号" },
      { prop: "columnnum", label: "列号" },
    ],
    3: [
      { prop: "text", label: "显示值" },
      { prop: "formtype", label: "Form类型" },
      { prop: "dictionarypid", label: "字典取值" },
      { prop: "timetype", label: "日期显示格式" },
      { prop: "rownum", label: "行号" },
      { prop: "columnnum", label: "列号" },
    ],
  } as any;
  tableColumns.value = arr.concat(obj[activeName.value]);
  await getTableList();
};

const getTableList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    uuid: uid.value,
  };
  let res: any =
    activeName.value == 1
      ? await getTableListData(params)
      : activeName.value == 2
      ? await getTableAddData(params)
      : await getTailList(params);
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

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  getTableList();
};

const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getTableList();
};

const handleClick = (tab: TabsPaneContext, event: Event) => {
  tableColumns.value = [];
  checkList.value = [];
  const loading = ElLoading.service({
    lock: true,
    text: "数据加载中...",
    background: "rgba(255, 255, 255, 0.5)",
  });
  setTimeout(async () => {
    activeName.value = tab.props.name;
    await getCheckList();
    await getTableColumn();
    loading.close();
  }, 600);
};

const showChange = (e: any, row: any) => {
  saveTableData(row);
};

const saveTableData = async (row: object) => {
  const loading = ElLoading.service({
    lock: true,
    text: "保存中...",
    background: "rgba(0, 0, 0, 0.5)",
  });
  let data = Object.assign({}, row);
  let res: any =
    activeName.value == 1
      ? await putListData(data)
      : activeName.value == 2
      ? await putAddData(data)
      : await editTail(data);
  if (res.code == 200) {
    setTimeout(async () => {
      loading.close();
      $baseMessage("保存成功", "success");
      // await getTableList()
    }, 200);
  } else {
    $baseMessage("保存失败", "error");
  }
};

// 刷新列表
const refreshConfig = async () => {
  await getTableList();
};

const generData = () => {
  if (tableData.value.length == 0) {
    $baseMessage("请导入字段列表", "error");
    return;
  }
  if (checkList.value.length == 0) {
    $baseMessage("请勾选要预览的模板", "error");
    return;
  }
  const loading = ElLoading.service({
    lock: true,
    text: "下载中...",
    background: "rgba(0, 0, 0, 0.5)",
  });
  try {
    let a = document.createElement("a");
    let event = new MouseEvent("click");
    a.download = "文件下载.zip";
    a.href =
      activeName.value == 1
        ? `${
            import.meta.env.VITE_APP_BASE_URL
          }/tableconfig/generatorfile?pids=${checkList.value.join(",")}&uuid=${
            uid.value
          }`
        : activeName.value == 2
        ? `${
            import.meta.env.VITE_APP_BASE_URL
          }/formconfig/generatorfile?pids=${checkList.value.join(",")}&uuid=${
            uid.value
          }`
        : `${
            import.meta.env.VITE_APP_BASE_URL
          }/detailconfig/generatorfile?pids=${checkList.value.join(",")}&uuid=${
            uid.value
          }`;
    a.dispatchEvent(event);
    setTimeout(() => {
      loading.close();
      $baseMessage("操作成功，稍后请在下载列表查看", "success");
      // handleClose()
    }, 1000);
  } catch (e) {
    $baseMessage(e, "error");
  } finally {
    setTimeout(() => {
      loading.close();
    }, 1000);
  }
};

const previewData = () => {
  if (tableData.value.length == 0) {
    $baseMessage("请导入字段列表", "error");
    return;
  }
  if (checkList.value.length == 0) {
    $baseMessage("请勾选要预览的模板", "error");
    return;
  }
  codesRef.value.showCode(uid.value, checkList.value, activeName.value);
};

const checkChange = (val: any) => {
  checkList.value = val;
};

const exportField = async () => {
  let params = { uuid: uid.value };
  let res: any =
    activeName.value == 1
      ? await putField(params)
      : activeName.value == 2
      ? await putForm(params)
      : await putTail(params);
  if (res.code == 200) {
    $baseMessage("导入成功", "success");
    await getTableList();
  } else {
    $baseMessage("导入失败", "error");
  }
};

// 效果预览
let imageDialog = ref(false);
let imageList = ref<any>([]);
const baseUrl = "/codeui/effect_images/";
const checkView = (imgs: string) => {
  imageDialog.value = true;
  imageList.value = imgs.split(",");
};
const closeImage = () => {
  imageDialog.value = false;
  imageList.value = [];
};

const handleClose = () => {
  title.value = "";
  uid.value = "";
  checkList.value = [];
  optionData.value = [];
  tableColumns.value = [];
  tableData.value = [];
  dialogVisible.value = false;
};

const getData = () => {
  emit("getData");
};

defineExpose({
  showFront,
});
</script>

<style scoped lang="scss"></style>
