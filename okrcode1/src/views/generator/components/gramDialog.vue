<template>
  <el-dialog
    :modelValue="dialogVisible"
    :title="title"
    :width="props.exportBtn ? '62%' : '32%'"
    class="dialogbox"
    :close-on-click-modal="false"
    :before-close="props.exportBtn ? exportClose : handleClose"
    :append-to-body="true"
    align-center
    center
  >
    <template v-if="props.exportBtn">
      <div>
        <queryForm ref="queryRef" :imports="true" @queryData="queryClick" />
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
            <template #default="{ row, $index }">
              {{ row[item.prop] ? row[item.prop] : "暂无数据" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="{ row, $index }">
              <el-button type="primary" @click="proportClick(row.pid)"
                >导入</el-button
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
      </div>
    </template>
    <template v-else>
      <el-form
        ref="gramsRef"
        :model="gramform"
        :rules="gramRules"
        label-width="90px"
        status-icon
      >
        <el-form-item :label="translate('项目名称')" prop="name">
          <el-input
            type="text"
            v-model="gramform.name"
            :placeholder="translate('请输入项目名称')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item :label="translate('项目类型')" prop="type">
          <el-select
            v-model="gramform.type"
            placeholder="请选择项目类型"
            clearable
          >
            <el-option value="公开" label="公开"></el-option>
            <el-option value="私有" label="私有"></el-option>
          </el-select>
          <span class="remark"
            >(注：公开类型可以被他人关联，私有类型不能被他人关联)</span
          >
        </el-form-item>
        <el-form-item :label="translate('项目描述')">
          <el-input
            type="textarea"
            :rows="5"
            v-model="gramform.des"
            :placeholder="translate('请输入项目描述')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="!props.exportBtn" type="primary" @click="saveData"
          >保存</el-button
        >
        <el-button v-if="!props.exportBtn" @click="handleClose">关闭</el-button>
        <el-button v-else @click="exportClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { queryPorps, TableProps, TabPorps } from "../ts/Types.ts";
import queryForm from "./queryForm.vue";
import { translate } from "/@/i18n";
import { ElLoading } from "element-plus";
import {
  editGram,
  getGram,
  getImportList,
  putGram,
  putImport,
} from "/@/views/generator/api/gramapi.ts";
const dialogVisible = ref<boolean>(false);
const title = ref<string>("");
const createFormData = () => ({
  name: "",
  type: "",
  des: "",
});
let gramform = ref<queryPorps>(createFormData());
const tableData = ref<TableProps[] | []>([]);
const tabloading = ref<boolean>(true);
const loadingText = ref<string>("正在加载...");
const queryRef = ref<any>();
const tableColumns = ref<TabPorps[] | []>([]);
const total = ref<number>(0);
const pageSizes = ref<number[]>([10, 15, 20, 30]);
const pageSize = ref<number>(10);
const pageNum = ref<number>(1);
const tableRef = ref<any>();
const gramsRef = ref<any>();
const keys = ref<any>(null);
const $baseMessage = inject<any>("$baseMessage");
const $baseConfirm = inject<any>("$baseConfirm");
const props = defineProps<{ exportBtn?: boolean }>();
const formdata = ref<queryPorps>({});
const emit = defineEmits(["getData"]);

const validateGram = (rule: any, value: any, callback: any) => {
  if ("" === value) callback(new Error(translate("项目名称不能为空")));
  else callback();
};
const validateType = (rule: any, value: any, callback: any) => {
  if ("" === value) callback(new Error(translate("项目类型不能为空")));
  else callback();
};

const gramRules = reactive<any>({
  name: [{ required: true, trigger: "blur", validator: validateGram }],
  type: [{ required: true, trigger: "change", validator: validateType }],
});

const showGram = async (pid: string | number, index: number) => {
  keys.value = index;
  title.value = index == 1 ? "项目信息添加" : "项目信息编辑";
  if (pid) await getGramInfo(pid);
  dialogVisible.value = true;
};
const showProam = async () => {
  title.value = "项目导入";
  getTableColumns();
  await getProList();
  dialogVisible.value = true;
};
const getTableColumns = () => {
  tableColumns.value = [
    { prop: "name", label: "项目名称" },
    { prop: "des", label: "项目描述" },
  ];
};

const getProList = async () => {
  let params = { pageNum: pageNum.value, pageSize: pageSize.value };
  let obj = formdata.value;
  let arr = Object.keys(obj);
  for (let i in obj) {
    if (arr.includes(i)) {
      Object.assign(params, obj);
    }
  }
  let res: any = await getImportList(params);
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
  getProList();
};

const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getProList();
};

const getGramInfo = async (pid: string | number) => {
  let { data } = await getGram({ pid: pid });
  gramform.value = data;
};

const saveData = () => {
  if (gramsRef.value) {
    gramsRef.value.validate(async (valid: any) => {
      if (valid) {
        const loading = ElLoading.service({
          lock: true,
          text: "保存中...",
          background: "rgba(0, 0, 0, 0.5)",
        });
        try {
          let data = Object.assign({}, gramform.value);
          let res: any =
            keys.value == 1 ? await putGram(data) : await editGram(data);
          if (res.code == 200) {
            setTimeout(() => {
              loading.close();
              $baseMessage("保存成功", "success");
              getData();
              handleClose();
            }, 1000);
          } else {
            $baseMessage("保存失败", "error");
          }
        } finally {
          setTimeout(() => {
            loading.close();
          }, 1000);
        }
      } else {
        return false;
      }
    });
  } else {
    return;
  }
};

const handleClose = () => {
  title.value = "";
  keys.value = null;
  gramsRef.value.resetFields();
  Object.assign(gramform.value, createFormData());
  getData();
  dialogVisible.value = false;
};

const exportClose = () => {
  title.value = "";
  tableColumns.value = [];
  tableData.value = [];
  tabloading.value = true;
  getData();
  dialogVisible.value = false;
};

const getData = () => {
  emit("getData");
};

const proportClick = (pid: number) => {
  $baseConfirm("你确定要导入吗？", "导入提示", async () => {
    let res: any = await putImport({ projectinfopid: pid });
    if (res.code == 200) {
      $baseMessage("导入成功", "success");
      await getProList();
      // setTimeout(() => {
      //   exportClose();
      //   getData();
      // }, 2000);
    } else {
      $baseMessage("导入失败", "error");
    }
  });
};

// 查询
const queryClick = async (queryForm: any) => {
  tabloading.value = true;
  let res: any = await getImportList(queryForm);
  if (res.code == 200) {
    tableData.value = res.data.list;
    total.value = res.data.total;
    tabloading.value = false;
  } else {
    tableData.value = [];
    total.value = 0;
    tabloading.value = false;
  }
};

defineExpose({
  showGram,
  showProam,
});
</script>

<style scoped lang="scss">
@use "../style/manage.scss";
</style>
