<template>
  <el-dialog
    :modelValue="dialogVisible"
    :title="title"
    width="36%"
    class="dialogbox"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :append-to-body="true"
    align-center
    center
  >
    <el-form
      ref="dictsRef"
      :model="dictform"
      :rules="dictRules"
      label-width="120px"
      status-icon
    >
      <el-form-item
        :label="translate('项目名称')"
        prop="projectinfopid"
        :filterable="true"
      >
        <el-select
          v-model="dictform.projectinfopid"
          placeholder="请选择项目名称"
          clearable
          filterable
        >
          <el-option
            v-for="item in gramsData"
            :key="item.pid"
            :value="item.pid as string"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="translate('字典名称')" prop="name">
        <el-input
          type="text"
          v-model="dictform.name"
          :placeholder="translate('请输入字典名称')"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item :label="translate('字典类型')" prop="type">
        <el-select
          v-model="dictform.type"
          placeholder="请选择字典类型"
          clearable
          filterable
        >
          <el-option :value="1" label="url"></el-option>
          <el-option :value="2" label="json"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="translate('数据源')" prop="datasource">
        <el-input
          type="text"
          v-model="dictform.datasource"
          :placeholder="translate('请输入数据源')"
          autocomplete="off"
          clearable
        />
        <span class="remark"
          >(注：json数据源格式：[{XXX:XXX,XXX:XXX},{XXX:XXX,XXX:XXX}];url数据格式：项目所需的请求路径)</span
        >
      </el-form-item>
      <el-form-item :label="translate('取值')" prop="value">
        <el-input
          type="text"
          v-model="dictform.value"
          :placeholder="translate('请输入取值')"
          autocomplete="off"
          clearable
        />
        <span class="remark">(注：取值格式：text属性名称:value属性名称)</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="saveData">保存</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { queryPorps } from "../ts/Types.ts";
import { translate } from "/@/i18n";
import { ElLoading } from "element-plus";
import type { ArrayTypeProps } from "/@/views/login/ts/loginType.ts";
import {
  editSource,
  getSourceSelect,
  putSource,
} from "/@/views/generator/api/sourceapi.ts";
import { editDict, getDict, putDict } from "/@/views/generator/api/dictapi.ts";
const dialogVisible = ref<boolean>(false);
const title = ref<string>("");
const createFormData = () => ({
  projectinfopid: "",
  name: "",
  datasource: "",
  type: "",
  value: "",
});
let dictform = ref<queryPorps>(createFormData());
const gramsData = ref<ArrayTypeProps[] | []>([]);
const dictsRef = ref<any>();
const keys = ref<any>(null);
const $baseMessage = inject<any>("$baseMessage");
const emit = defineEmits(["getData"]);

const dictRules = reactive<any>({
  projectinfopid: [
    { required: true, trigger: "change", message: "请选择项目名称" },
  ],
  name: [{ required: true, trigger: "blur", message: "请输入字典名称" }],
  type: [{ required: true, trigger: "change", message: "请选择字典类型" }],
  datasource: [{ required: true, trigger: "blur", message: "请输入数据源" }],
  value: [{ required: true, trigger: "blur", message: "请输入取值" }],
});

const showDict = async (pid: string | number, index: number) => {
  keys.value = index;
  title.value = index == 1 ? "数据字典添加" : "数据字典编辑";
  await getGrams();
  if (pid) await getDictInfo(pid);
  dialogVisible.value = true;
};

const getDictInfo = async (pid: string | number) => {
  let { data } = await getDict({ pid: pid });
  dictform.value = data;
};

const getGrams = async () => {
  let { data } = await getSourceSelect();
  gramsData.value =
    data.length > 0
      ? data.map((item: any) => {
          return {
            pid: item.value,
            label: item.text,
          };
        })
      : [];
};

const saveData = () => {
  if (dictsRef.value) {
    dictsRef.value.validate(async (valid: any) => {
      if (valid) {
        const loading = ElLoading.service({
          lock: true,
          text: "保存中...",
          background: "rgba(0, 0, 0, 0.5)",
        });
        try {
          let data = Object.assign({}, dictform.value);
          let res: any =
            keys.value == 1 ? await putDict(data) : await editDict(data);
          if (res.code == 200) {
            setTimeout(() => {
              $baseMessage("保存成功", "success");
              getData();
              handleClose();
              loading.close();
            }, 1000);
          } else {
            $baseMessage("保存失败", "error");
            loading.close();
          }
        } finally {
          // setTimeout(() => {
          //   loading.close()
          // }, 1000)
        }
      } else {
        return;
      }
    });
  } else {
    return;
  }
};

const handleClose = () => {
  title.value = "";
  keys.value = null;
  dictsRef.value.resetFields();
  Object.assign(dictform.value, createFormData());
  dialogVisible.value = false;
};

const getData = () => {
  emit("getData");
};

defineExpose({
  showDict,
});
</script>

<style scoped lang="scss"></style>
