<template>
  <el-dialog
    :modelValue="dialogVisible"
    :title="title"
    width="38%"
    class="dialogbox"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :append-to-body="true"
    align-center
    center
  >
    <el-form
      ref="sourcesRef"
      :model="sourceform"
      :rules="sourceRules"
      label-width="120px"
      status-icon
    >
      <el-form-item :label="translate('项目名称')" prop="projectinfopid">
        <el-select
          v-model="sourceform.projectinfopid"
          placeholder="请选择项目名称"
          clearable
          :filterable="true"
        >
          <el-option
            v-for="item in gramsData"
            :key="item.pid"
            :value="item.pid as string"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="translate('数据源名称')" prop="name">
        <el-input
          type="text"
          v-model="sourceform.name"
          :placeholder="translate('请输入数据源名称')"
          autocomplete="off"
          clearable
        />
        <span class="remark">(注：命名规则：数据库名称_模式名称/空间名称)</span>
      </el-form-item>
      <el-form-item :label="translate('数据源连接地址')" prop="url">
        <el-input
          type="text"
          v-model="sourceform.url"
          :placeholder="translate('请输入数据源连接地址')"
          autocomplete="off"
          clearable
        />
        <span class="remark">(注：连接地址填写配置文件完整的连接地址)</span>
      </el-form-item>
      <el-form-item :label="translate('账号')" prop="username">
        <el-input
          type="text"
          v-model="sourceform.username"
          :placeholder="translate('请输入账号')"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item :label="translate('密码')" prop="password">
        <el-input
          v-model="sourceform.password"
          :placeholder="translate('请输入密码')"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item :label="translate('驱动')" prop="drivermsgpid">
        <el-select
          v-model="sourceform.drivermsgpid"
          placeholder="请选择驱动类型"
          clearable
          :filterable="true"
        >
          <el-option
            v-for="item in driveData"
            :key="item.pid"
            :value="item.pid as string"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="translate('模式/空间名称')" prop="schemaname">
        <el-input
          type="text"
          v-model="sourceform.schemaname"
          :placeholder="translate('请输入模式/空间名称')"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item :label="translate('多数据源标识')">
        <el-input
          type="text"
          v-model="sourceform.dsname"
          :placeholder="translate('请输入多数据源标识')"
          autocomplete="off"
          clearable
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="success" @click="handletest">测试连接</el-button>
        <el-button type="primary" @click="saveData">保存</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { queryPorps } from "../ts/Types.ts";
import { translate } from "/@/i18n";
import { ElLoading, ElMessage } from "element-plus";
import {
  editSource,
  getSource,
  getSourceMsg,
  getSourceSelect,
  getSourceTest,
  putSource,
} from "/@/views/generator/api/sourceapi.ts";
import type { ArrayTypeProps } from "/@/views/login/ts/loginType.ts";
const dialogVisible = ref<boolean>(false);
const title = ref<string>("");
const createFormData = () => ({
  projectinfopid: "",
  name: "",
  url: "",
  username: "",
  password: "",
  drivermsgpid: "",
  schemaname: "",
  dsname: "",
});
let sourceform = ref<any>(createFormData());
const sourcesRef = ref<any>();
const keys = ref<any>(null);
const driveData = ref<ArrayTypeProps[] | []>([]);
const gramsData = ref<ArrayTypeProps[] | []>([]);
const $baseMessage = inject<any>("$baseMessage");
const emit = defineEmits(["getData"]);

const sourceRules = reactive<any>({
  projectinfopid: [
    { required: true, trigger: "blur", message: "请输入项目名称" },
  ],
  name: [{ required: true, trigger: "blur", message: "请输入数据源名称" }],
  url: [{ required: true, trigger: "blur", message: "请输入数据源连接地址" }],
  username: [{ required: true, trigger: "blur", message: "请输入账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入密码" }],
  drivermsgpid: [{ required: true, trigger: "change", message: "请选择驱动" }],
  schemaname: [
    { required: true, trigger: "blur", message: "请输入模式/空间名称" },
  ],
});

const showSource = async (pid: string | number, index: number) => {
  testFlag = false;
  keys.value = index;
  title.value = index == 1 ? "数据源添加" : "数据源编辑";
  await getDrive();
  await getGrams();
  if (pid) await getSourceInfo(pid);
  dialogVisible.value = true;
};

const getSourceInfo = async (pid: string | number) => {
  let { data } = await getSource({ pid: pid });
  sourceform.value = data;
};

const getDrive = async () => {
  let { data } = await getSourceMsg();
  driveData.value =
    data.length > 0
      ? data.map((item: any) => {
          return {
            pid: item.value,
            label: item.text,
          };
        })
      : [];
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

let testFlag = false;

const handletest = async () => {
  let obj: any = sourceform.value;
  if (
    obj.url == "" ||
    obj.username == "" ||
    obj.password == "" ||
    obj.drivermsgpid == ""
  ) {
    ElMessage({
      message: "请输入必要的数据进行测试，数据源地址，账号，密码，驱动",
      type: "error",
      duration: 4000,
    });
  } else {
    let params = Object.assign(
      {},
      {
        url: obj.url,
        username: obj.username,
        password: obj.password,
        drivermsgpid: obj.drivermsgpid,
      }
    );
    let res: any = await getSourceTest(params);
    if (res.code == 200) {
      ElMessage({ message: '测试成功',
    type: 'success',
    plain: true});
      testFlag = true;
    } else {
      $baseMessage("测试失败，请重新测试", "error");
    }
  }
};

const saveData = () => {
  if (!testFlag) return ElMessage.error("请测试链接成功后保存");
  if (sourcesRef.value) {
    sourcesRef.value.validate(async (valid: any) => {
      if (valid) {
        const loading = ElLoading.service({
          lock: true,
          text: "保存中...",
          background: "rgba(0, 0, 0, 0.5)",
        });
        try {
          let data = Object.assign({}, sourceform.value);
          let res: any =
            keys.value == 1 ? await putSource(data) : await editSource(data);
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
  sourcesRef.value.resetFields();
  Object.assign(sourceform.value, createFormData());
  dialogVisible.value = false;
};

const getData = () => {
  emit("getData");
};

defineExpose({
  showSource,
});
</script>

<style scoped lang="scss"></style>
