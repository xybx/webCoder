<template>
  <vab-query-form>
    <vab-query-form-top-panel>
      <el-form inline label-width="90px" :model="queryForm" @submit.prevent>
        <el-form-item label="用户姓名" v-if="props.users">
          <el-input
            type="text"
            v-model="queryForm.name"
            :placeholder="translate('请输入用户名')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item label="项目名称" v-if="props.grams || props.imports">
          <el-input
            type="text"
            v-model="queryForm.name"
            :placeholder="translate('请输入项目名称')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <template v-if="props.source">
          <el-form-item label="项目名称">
            <el-input
              type="text"
              v-model="queryForm.projectInfoName"
              :placeholder="translate('请输入项目名称')"
              autocomplete="off"
              clearable
            />
          </el-form-item>
          <el-form-item label="数据源名称">
            <el-input
              type="text"
              v-model="queryForm.name"
              :placeholder="translate('请输入数据源名称')"
              autocomplete="off"
              clearable
            />
          </el-form-item>
        </template>
        <template v-if="props.dict">
          <el-form-item label="项目名称">
            <el-input
              type="text"
              v-model="queryForm.projectname"
              :placeholder="translate('请输入项目名称')"
              autocomplete="off"
              clearable
            />
          </el-form-item>
          <el-form-item label="字典名称">
            <el-input
              type="text"
              v-model="queryForm.name"
              :placeholder="translate('请输入字典名称')"
              autocomplete="off"
              clearable
            />
          </el-form-item>
        </template>
        <template v-if="props.temps">
          <el-form-item label="风格名称">
            <el-input
              type="text"
              v-model="queryForm.name"
              :placeholder="translate('请输入风格名称')"
              autocomplete="off"
              clearable
            />
          </el-form-item>
        </template>
        <template v-if="props.comcode">
          <el-form-item label="模板名称">
            <el-input
              type="text"
              v-model="queryForm.name"
              :placeholder="translate('请输入风格名称')"
              autocomplete="off"
              clearable
            />
          </el-form-item>
          <el-form-item label="模板类型">
            <el-select
              v-model="queryForm.typepid"
              placeholder="请选择模板类型"
              clearable
              :filterable="true"
            >
              <el-option
                v-for="item in codeData"
                :key="item.pid"
                :value="item.pid as number"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-if="props.codegentor">
          <el-form-item label="表名称">
            <el-input
              type="text"
              v-model="queryForm.tableName"
              :placeholder="translate('请输入表名称')"
              autocomplete="off"
              clearable
            />
          </el-form-item>
        </template>
        <template v-if="props.usualAddress">
          <el-form-item label="网址名称">
            <el-input
              type="text"
              v-model="queryForm.name"
              :placeholder="translate('请输入网址名称')"
              autocomplete="off"
              clearable
            />
          </el-form-item>
        </template>
        <el-form-item>
          <el-button
            :icon="Search"
            :loading="listLoading"
            native-type="submit"
            type="primary"
            @click="queryData"
            >查询</el-button
          >
          <el-button
            v-if="!props.imports && !props.codegentor && !props.users"
            :icon="Plus"
            type="success"
            @click="handleAdd"
            >新增</el-button
          >
          <el-button
            v-if="props.users && rule"
            :icon="Plus"
            type="success"
            @click="handleAdd"
            >新增</el-button
          >
          <el-button
            :icon="Upload"
            v-if="props.grams"
            type="warning"
            @click="exportGram"
            >导入项目</el-button
          >
        </el-form-item>
      </el-form>
    </vab-query-form-top-panel>
  </vab-query-form>
</template>

<script setup lang="ts">
import { Plus, Search, Upload } from "@element-plus/icons-vue";
import { translate } from "/@/i18n";
import type { ArrayTypeProps } from "/@/views/login/ts/loginType.ts";
import { getTemsStyle } from "/@/views/generator/api/comcodeapi.ts";
// let rule = JSON.parse(sessionStorage.getItem('userinfo') as string).rule
const queryForm = reactive<any>({});
const listLoading = ref<boolean>(false);
const props = defineProps<{
  users?: boolean;
  grams?: boolean;
  source?: boolean;
  imports?: boolean;
  dict?: boolean;
  temps?: boolean;
  comcode?: boolean;
  codegentor?: boolean;
  usualAddress?: boolean;
  rule?: boolean;
}>();
const codeData = ref<ArrayTypeProps[] | []>([]);
const emit = defineEmits(["queryData", "handleAdd", "exportGram"]);

const queryData = () => {
  emit("queryData", queryForm);
};

const handleAdd = () => {
  emit("handleAdd");
};

const exportGram = () => {
  emit("exportGram");
};

const getTems = async () => {
  let { data } = await getTemsStyle();
  codeData.value =
    data.length > 0
      ? data.map((item: any) => {
          return {
            pid: item.value,
            label: item.text,
          };
        })
      : [];
};
const clearComcode = () => {
  queryForm.name = "";
  queryForm.typepid = "";
};

defineExpose({ clearComcode });

tryOnMounted(async () => {
  if (props.comcode) {
    await getTems();
  }
});
</script>

<style scoped lang="scss">
@use "../style/queryform.scss";
</style>
