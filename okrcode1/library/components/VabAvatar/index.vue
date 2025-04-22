<template>
  <el-dropdown @command="handleCommand" @visible-change="handleVisibleChange">
    <span class="avatar-dropdown">
      <el-avatar class="user-avatar" :src="avatar" />
      <div class="username">
        <span class="hidden-xs-only">{{ username }}</span>
        <vab-icon
          class="vab-dropdown"
          :class="{ 'vab-dropdown-active': active }"
          icon="arrow-down-s-line"
        />
      </div>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="editPassword">
          <Edit />
          <span>{{ translate(" 修改密码") }}</span>
        </el-dropdown-item>
        <el-dropdown-item command="logout">
          <vab-icon icon="logout-circle-r-line" />
          <span>{{ translate("退出登录") }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <!-- 修改密码 -->

  <el-dialog
    :modelValue="dialogVisible"
    title="修改密码"
    width="500"
    :before-close="handleClose"
    align-center
    center
    class="dialogbox"
  >
    <el-form
      :model="form"
      label-width="auto"
      :rules="rules"
      label-position="left"
      ref="ruleFormRef"
    >
      <el-form-item label="原密码" prop="oldPassword">
        <el-input
          type="password"
          v-model="form.oldPassword"
          show-password
          placeholder="请输入原密码"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          type="password"
          v-model="form.newPassword"
          show-password
          placeholder="新密码(不能少于6位)"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          type="password"
          v-model="form.confirmPassword"
          show-password
          placeholder="请输入要修改的密码"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item class="button">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="onSubmit(ruleFormRef)">
          确定修改
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus";
import { translate } from "/@/i18n";
import { useUserStore } from "/@/store/modules/user";
import { toLoginRoute } from "/@/utils/routes";
import { Edit } from "@element-plus/icons-vue";
import { changePassword } from "./indexapi";
import { isPassword } from "~/src/utils/validate";

const $baseMessage = inject<any>("$baseMessage");
let ruleFormRef = ref<FormInstance>();
defineOptions({
  name: "VabAvatar",
});

let dialogVisible = ref(false);

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { avatar, username } = storeToRefs(userStore);
const { logout,changeP} = userStore;
const active = ref<boolean>(false);
interface RuleForm {
  oldPassword: any;
  newPassword: any;
  confirmPassword: any;
}
const form = reactive<RuleForm>({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  console.log(99);

  await formEl.validate(async (valid: any, fields: any) => {
    console.log(valid);
    if (valid) {
      let res = (await changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      })) as any;

      if (res.code == 200) {
        ElMessage({ message: "修改成功", type: "success", plain: true });
        dialogVisible.value = false;
        setTimeout(() => {
          changeP()
          router.push({ path: "Login" });
        }, 1000);
      } else {
        $baseMessage("修改失败", "error");
      }
    } else {
      console.log("验证失败");
    }
  });
};
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  dialogVisible.value = false;
  form.oldPassword = "";
  form.newPassword = "";
  form.confirmPassword = "";
};
const validateNew = (ruleFormRef: any) => {
  return (rule: any, value: any, callback: any) => {
    if (value === "") {
      callback("请输入新密码");
    } else if (!isPassword(value)) {
      callback("新密码不得少于六位");
    } else if (form.confirmPassword != "") {
      callback();
      // 触发一次确认密码项的校验。
      callback(ruleFormRef.value.validateField("confirmPassword"));
    } else {
      callback();
    }
  };
};
const validateConfirm = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback("确认密码不可为空");
  } else if (form.newPassword !== value && form.confirmPassword !== "") {
    callback("新密码与确认密码不一致");
  } else {
    callback();
  }
};

const rules = reactive<FormRules<RuleForm>>({
  oldPassword: [
    {
      required: true,
      message: "请输入原始密码",
      trigger: "blur",
    },
    {
      min: 6,
      message: "原密码不少于六位",
      trigger: "blur",
    },
  ],
  newPassword: [
    {
      required: true,
      message: "请输入新密码，不少于6位。",
      trigger: "blur",
      validator: validateNew(ruleFormRef),
    },
    // {
    //   min: 6,
    //   message: "新密码不少于六位",
    //   trigger: "blur",
    // },
  ],
  confirmPassword: [
    {
      required: true,
      message: "请确认密码，要与新密码一致。",
      trigger: "blur",
      validator: validateConfirm,
    },
  ],
});

const handleVisibleChange = (value: boolean) => {
  active.value = value;
};
const handleCommand = async (command: any) => {
  switch (command) {
    case "logout":
      await logout();
      await router.push(toLoginRoute(route.fullPath));
      break;
    case "editPassword":
      dialogVisible.value = true;
  }
};
const handleClose = () => {
  ElMessageBox.confirm("你确定要关闭吗？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    dialogVisible.value = false;
  });
};
</script>

<style lang="scss" scoped>
.avatar-dropdown {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;

  .user-avatar {
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    padding: 8px;
    margin-left: 15px;
    cursor: pointer;
    border-radius: 50%;
  }

  .username {
    position: relative;
    display: flex;
    align-content: center;
    align-items: center;
    width: max-content;
    height: 40px;
    margin-left: 6px;
    line-height: 40px;
    cursor: pointer;

    [class*="ri-"] {
      margin-left: 0 !important;
    }
  }
}

:deep(.button ){
  .el-form-item__content {
    justify-content: center;
  }
}
</style>
