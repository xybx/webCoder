<template>
  <el-dialog
    :modelValue="dialogVisible"
    :title="title"
    width="32%"
    class="dialogbox"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :append-to-body="true"
    align-center
    center
  >
    <el-form
      ref="userRef"
      :model="userform"
      :rules="userRules"
      label-width="90px"
      status-icon
      label-position="left"
    >
      <el-form-item :label="translate('用户姓名')" prop="name">
        <el-input
          type="text"
          v-model="userform.name"
          :placeholder="translate('请输入用户姓名')"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item :label="translate('用户密码')" prop="password" v-if="keys==1">
        <el-input
          type="password"
          v-model="userform.password"
          show-password
          :placeholder="translate('请输入用户密码')"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item :label="translate('用户简写')" prop="username">
        <el-input
          type="text"
          v-model="userform.username"
          :placeholder="translate('请输入用户姓名')"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item :label="translate('角色')" prop="rule">
        <el-select v-model="userform.rule" placeholder="请选择角色">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
import { isPassword } from "/@/utils/validate.ts";
import {
  editUsers,
  getUsers,
  putUsers,
} from "/@/views/generator/api/userapi.ts";
import { ElLoading } from "element-plus";
const dialogVisible = ref<boolean>(false);
const title = ref<string>("");
const createFormData = () => ({
  name: "",
  password: "",
  username: "",
  rule: "普通用户",
});
const options = ref([
  {
    value: "系统管理员",
    label: "系统管理员",
  },
  {
    value: "普通用户",
    label: "普通用户",
  },
]);
let userform = ref<queryPorps>(createFormData());
const userRef = ref<any>();
const keys = ref<any>(null);
const $baseMessage = inject<any>("$baseMessage");
const emit = defineEmits(["getData", "getValue"]);

const validateName = (rule: any, value: any, callback: any) => {
  if ("" === value) callback(new Error(translate("用户姓名不能为空")));
  else callback();
};
const validatePassword = (rule: any, value: any, callback: any) => {
  if (!isPassword(value)) callback(new Error(translate("密码不能少于6位")));
  else callback();
};
const validateUsername = (rule: any, value: any, callback: any) => {
  if ("" === value) callback(new Error(translate("用户简写不能为空")));
  else callback();
};
const validateUserrule = (rule: any, value: any, callback: any) => {
  if ("" === value) callback(new Error(translate("角色不能为空")));
  else callback();
};
const userRules = reactive<any>({
  name: [{ required: true, trigger: "blur", validator: validateName }],
  password: [{ required: true, trigger: "blur", validator: validatePassword }],
  username: [{ required: true, trigger: "blur", validator: validateUsername }],
  rule: [{ required: true, trigger: "blur", validator: validateUserrule }],
});

const showUser = async (pid: string | number, index: number) => {
  keys.value = index;
  title.value = index == 1 ? "用户信息添加" : "用户信息编辑";
  if (pid) await getUserInfo(pid);
  dialogVisible.value = true;
};

const getUserInfo = async (pid: string | number) => {
  let { data } = await getUsers({ pid: pid });
  console.log(data);

  userform.value = data;
};

const saveData = () => {
  if (userRef.value) {
    userRef.value.validate(async (valid: any) => {
      if (valid) {
        const loading = ElLoading.service({
          lock: true,
          text: "保存中...",
          background: "rgba(0, 0, 0, 0.5)",
        });
        try {
          let data:any = Object.assign({}, userform.value);
          if(keys.value!=1){
            data.password=null
          }

          let res: any =
            keys.value == 1 ? await putUsers(data) : await editUsers(data);

          if (res.code == 200) {
            $baseMessage("保存成功", "success");
            getData();
            getValue();
            handleClose();
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

const getData = () => {
  emit("getData");
};
const getValue = () => {
  emit("getValue");
};

const handleClose = () => {
  title.value = "";
  keys.value = null;
  userRef.value.resetFields();
  Object.assign(userform.value, createFormData());
  dialogVisible.value = false;
};

defineExpose({
  showUser,
});
</script>

<style scoped lang="scss">
@use "../style/manage.scss";
</style>
