<template>
  <component :is="dialogList?.parentEleTag" v-bind="dialogList?.parentOptions">
    <template v-if="dialogList?.modeType != 'look'">
      <el-form
              :model="detailsTitle"
              label-width="auto"
              :rules="rules"
              label-position="left"
              ref="formRef"
      >
        <el-form-item
                v-for="item in detailsTitle"
                :label="item.title"
                :prop="item.name"
        >
          <!-- 输入框 -->
          <template v-if="item.type == 'text'">
            <el-input v-model="item.value" :placeholder="item.placeholder" />
          </template>
          <!-- 数字 -->
          <template v-if="item.type == 'number'">
            <el-input v-model="item.value" type="number" />
          </template>
          <!-- 日期 -->
          <template v-if="item.type == 'date'">
            <el-date-picker
                    v-model="item.value"
                    :type="item.dataType"
                    :placeholder="item.placeholder"
                    style="width: 100%"
                    :format="item.format"
                    :value-format="item.format"
            />
          </template>
          <!-- 时间 -->
          <template v-if="item.type == 'time'">
            <el-date-picker
                    v-model="item.value"
                    :type="item.dataType"
                    :placeholder="item.placeholder"
                    :format="item.format"
                    :value-format="item.format"

            />
          </template>
          <!-- 时间段 -->
          <template v-if="item.type == 'quantum'">
            <el-date-picker
                    v-model="item.value"
                    :type="item.dataType"
                    range-separator="To"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :format="item.format"
                    :value-format="item.format"
                    :placeholder="item.placeholder"
            />
          </template>
          <!-- 下拉框 -->
          <template v-if="item.type == 'select'">
            <el-select v-model="item.value" :placeholder="item.placeholder"  size="large">
              <el-option
                      v-for="itemChild in item.options"
                      :key="itemChild.value"
                      :label="itemChild.label"
                      :value="itemChild.value"
              />
            </el-select>
          </template>
          <!-- 复选框 -->
          <template v-if="item.type == 'checkbox'">
            <el-checkbox-group v-model="item.value">
              <el-checkbox
                      v-for="itemChild in item.options"
                      :value="itemChild.value"
                      :label="itemChild.label"
              >
              </el-checkbox>
            </el-checkbox-group>
          </template>
          <!-- 单选框 -->
          <template v-if="item.type == 'radio'">
            <el-radio-group v-model="item.value">
              <el-radio
                      v-for="itemChild in item.options"
                      :value="itemChild.value"
                      :label="itemChild.label"
              ></el-radio>
            </el-radio-group>
          </template>
          <!-- 上传图片 -->
          <template v-if="item.type == 'img'">
            <el-upload
                    action="#"
                    list-type="picture-card"
                    class="imgUpload"
                    :accept="item.file"
                    v-model:file-list="item.fileList"
                    :http-request="(params) => UploadFiles(params, item)"
            >
              <i class="iconfont icon-jietutupian"></i>
              <div class="desc">上传图片</div>

              <template #file="{ file }">
                <div>
                  <i
                          class="iconfont icon-chahao"
                          @click="deleteImg(file, item)"
                  ></i>
                  <el-image
                          :src="baseUrl + file.pid"
                          :zoom-rate="1.2"
                          :max-scale="7"
                          :min-scale="0.2"
                          :initial-index="4"
                          :preview-src-list="item.fileList"
                          fit="cover"
                          class="imgOver"
                  />
                </div>
              </template>
            </el-upload>
          </template>
          <!-- 上传视频 -->
          <template v-if="item.type == 'video'">
            <el-upload
                    :accept="item.file"
                    class="videoUpload"
                    id="video_kp"
                    action=""
                    list-type="picture-card"
                    :name="item.name"
                    v-model:file-list="item.fileList"
                    :http-request="(params) => UploadFiles(params, item)"
            >
              <i class="iconfont icon-shipin"></i>
              <div class="desc">上传视频</div>
              <template #file="{ file }">
                <div>
                  <i
                          class="iconfont icon-chahao"
                          @click="deleteImg(file, item)"
                  ></i>
                  <video
                          ref="videoRef"
                          :src="baseUrl + file.pid"
                          :autoplay="false"
                          controls
                  ></video>
                </div>
              </template>
            </el-upload>
          </template>
          <!-- 文本域 -->
          <template v-if="item.type == 'textArea'">
            <el-input v-model="item.value" type="textarea" :placeholder="item.placeholder"  />
          </template>
          <!-- 上传文件 -->
          <template v-if="item.type == 'file'">
            <el-upload
                    :accept="item.file"
                    v-model:file-list="item.fileList"
                    class="fileUpload"
                    action="#"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :http-request="(params) => UploadFiles(params, item)"
            >
              <el-button type="primary">上传文件</el-button>
              <template #file="file">
                <div class="text">{{ file.file.name }}</div>
                <i
                        class="iconfont icon-shanchu"
                        @click="deleteImg(file.file, item)"
                ></i>
              </template>
            </el-upload>
          </template>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="save" @click="save">保存</el-button>
          <el-button type="primary" plain @click="handleClose">关闭</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template v-else>
      <div class="lookForm">
        <div class="item" v-for="item in detailsTitle">
          <div class="label">{{ item.title }}</div>
          <!-- 文本框 -->
          <!-- <template v-if="item.type == 'text' || item.type == 'textArea'">
            <div class="value" >{{item.value == '' ? '暂无' : item.value}}
            </div>
          </template> -->
          <!-- 图片 -->
          <template v-if="item.type == 'img'">
            {{ item.fileList.length == 0 ? "暂无" : "" }}
            <el-image
                    v-for="file in item.fileList"
                    :key="file.pid"
                    :src="baseUrl + file.pid"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :initial-index="4"
                    :preview-src-list="item.fileList"
                    fit="cover"
                    class="imgOver"
            />
          </template>
          <!-- 视频 -->
          <template v-else-if="item.type == 'video'">
            {{ item.fileList.length == 0 ? "暂无" : "" }}
            <video
                    v-for="file in item.fileList"
                    :key="file.pid"
                    :src="baseUrl + file.pid"
                    :autoplay="false"
                    controls
            ></video>
          </template>
          <!-- 文件 -->
          <template v-else-if="item.type == 'file'">
            {{ item.fileList.length == 0 ? "暂无" : "" }}
            <ul v-if="item.fileList.length != 0">
              <li v-for="file in item.fileList">
                <div class="text">{{ file.name }}</div>
                <i class="iconfont icon-xiazai" @click="downLoadFile(file)"></i>
              </li>
            </ul>
          </template>
          <!-- 下拉框 -->
          <template v-else-if="item.type == 'select' || item.type == 'radio'">
            <div class="value">
              {{
              item.value == ""
              ? "暂无"
              : item.options.filter(
              (val: any) => val.value == item.value
              )[0].label
              }}
            </div>
          </template>
          <template v-else>
            <div class="value">
              {{ item.value == "" ? "暂无" : item.value }}
            </div>
          </template>
        </div>
      </div>
    </template>
  </component>
  <!-- </el-dialog> -->
</template>


<script setup lang="ts">
import { UploadProps, ElMessage, ElMessageBox, FormRules } from "element-plus";
import type { DialogProps } from "/@/types/listTypes.ts";
import {
  selectById,
  add,
  update
  ,getselectformSelectDataApi
} from "../../api/Datasource22DialogApi";
import {
  UploadFile,
  selectListByUuid,
  deleteFile,
  delByUuids,
} from "../../api/fileApi";

const emits = defineEmits(["getData"]);
defineComponent({
  name: "Datasource22Dialog",
});
const baseUrl = `${import.meta.env.VITE_APP_BASE_URL}/globalfile/download?pid=`;
// 删除加载的图片
const deleteImg = (file: any, item: any) => {
  console.log(file, item);

  ElMessageBox.confirm(`确定要删除这个文件嘛?`).then(
    async () => {
      let res = (await deleteFile({ pid: file.pid })) as any;
      console.log(res);
      if (res.code == 200) {
        // 获得文件列表
        getFileList(item);
        ElMessage.success("删除成功");
      } else {
        ElMessage.error(res.msg);
      }
    },
    () => {
      ElMessage.info("取消删除");
    }
  );
};
// 文件上传
async function UploadFiles(option: any, item: any) {
  console.log(item, option, item.value);
  var data = new FormData(); //自定义 参数类型必须为 FormData格式 此为强制要求
  data.append("file", option.file);
  data.append("uuid", item.value);
  const res = (await UploadFile(data)) as any;
  console.log(res);
  if (res.code === 200) {
    //上传成功后保存uuid字段信息
    if (item.value == "") {
      item.value = res.data.uuid;
    }
    getFileList(item);
  }
}
// 获取文件列表
async function getFileList(item: any) {
  // 获得文件列表
  let result = (await selectListByUuid({ uuid: item.value })) as any;
  if (result.code == 200) {
    console.log(result);
    item.fileList = result.data;
    console.log(item.fileList);
  }
}

const dialogVisible = defineModel<boolean>("dialogVisible");
const dialogList = defineModel<DialogProps | any>("dialogList");

// 监听获得弹出框内容
let type = ref("look");
watch(dialogVisible, async (newValue, b) => {
  if (newValue) {
    getDialog();
    type.value = dialogList.value.modeType;
    console.log(type.value);
    detailsTitle.value.map(async (key: any) => {
      // key.value = selectData.data[key.name];
      if (key.type == "checkbox" || key.type == "radio" || key.type == "select") {
        // 获得下拉框数据
        //判断key.name
            let arr=[]
            if(key.name=="selectform"){
              let res: any = await getselectformSelectDataApi()
              if (res.code == 200) {
                let tempSelectData=res.data
                for(let i=0;i<tempSelectData.length;i++){
                  arr.push({
                    label:tempSelectData[i].label,
                    value:tempSelectData[i].value
                  })
                }
              }
            }
        key.options = arr;
      }
    });

    if (type.value != "add") {
      let res = (await selectById({ pid: dialogList.value?.pid })) as any;
      console.log(res);
      if (res.code == 200) {
        detailsTitle.value.map((key: any) => {
          key.value = res.data[key.name];
          if (key.type == "file" || key.type == "img" || key.type == "video") {
            getFileList(key);
          }
        });
      } else {
        ElMessage.error(res.msg);
      }
    }
    console.log(detailsTitle.value);
  }
});
const getDialog = () => {
  // 标签名
  dialogList.value.parentEleTag = "el-dialog";
  // 属性
  dialogList.value.parentOptions = {
    modelValue: dialogVisible,
    title: dialogList.value?.title,
    width: "37%",
    class: "dialogbox",
    "close-on-click-modal": false,
    appendToBody: true,
    "align-Center": true,
    center: true,
    "before-close": handleClose,
  };
  // 方法
  // dialogList.value.parentEvent = {};
};

const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  ElMessage.success("删除成功");
};

const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(`确定要删除这个文件嘛?`).then(
    () => true,
    () => false
  );
};

const detailsTitle = ref<any>([
    {
      title: "输入框:",
      name: "textform",
       type: "text",
       value: "",
       placeholder:"请输入输入框",

    },
    {
      title: "数字框:",
      name: "numberform",
        type: "number",
        value: 0,

    },
    {
      title: "密码框:",
      name: "passwordform",
        type: "text",

    },
    {
      title: "文本域:",
      name: "textareaform",
        type: "textArea",
        value: "",
        placeholder:"请输入文本域",

    },
    {
      title: "日期框:",
      name: "dateform",
        type: "date",
        dataType: "date",
        date: "",
        time: "",
        format: "YYYY-MM-DD",
        placeholder:"请选择日期框",

    },
    {
      title: "时间框:",
      name: "timeform",
        type: "time",
        dataType: "datetime",
        date: "",
        time: "",
        format: "YYYY-MM-DD HH:mm:ss",
        placeholder:"请选择时间框",

    },
    {
      title: "下拉框:",
      name: "selectform",
        type: "select",
        options: [],
        value: "",
        placeholder:"请选择下拉框",

    },
    {
      title: "图片上传:",
      name: "imageform",
        type: "img",
        value: "",
        fileList: [],
        file: "否",

    },
    {
      title: "视频上传:",
      name: "videoform",
        type: "video",
        value: "",
        fileList: [],
        file: "否",

    },
    {
      title: "文件上传:",
      name: "fileform",
        type: "file",
        value: "",
        fileList: [],
        file: "file",

    },
]);
const form: any = reactive({});
const rules = reactive<FormRules>({
        textform:[  {required: true, message: '请输入输入框', trigger: 'blur'}],
        numberform:[  {required: true, message: '请输入数字框', trigger: 'blur'}],
});
// 保存
const save = async () => {
  for (let i = 0; i < detailsTitle.value.length; i++) {
    const item = detailsTitle.value[i];

    // detailsTitle.value.map((item: any) => {
    if (item.type == "text" && item.value == "") {
      ElMessage.warning("请输入" + item.title);
      return false;
    }
    form[item.name] = item.value;
  }

  // 编辑
  if (type.value == "edit") {
    form.pid = dialogList.value.pid;
    console.log(detailsTitle.value, form);
    let res = (await update(form)) as any;
    if (res.code == 200) {
      ElMessage.success("编辑成功");
      dialogVisible.value = false;
      emits("getData");
    } else {
      ElMessage.error(res.msg);
    }
  } else if (type.value == "add") {
    form.drivermsgpid = 1;
    console.log(detailsTitle.value, form);
    let res = (await add(form)) as any;
    if (res.code == 200) {
      ElMessage.success("上传成功");
      dialogVisible.value = false;
      emits("getData");
    } else {
      ElMessage.error(res.msg);
    }
  }

  // 清空表单
  for (let i = 0; i < detailsTitle.value.length; i++) {
    const item = detailsTitle.value[i];

    item.value = "";
    item.fileList = [];
  }
};
// 关闭
const handleClose = () => {
  if (dialogList.value.modeType == "look") {
    for (let i = 0; i < detailsTitle.value.length; i++) {
      const item = detailsTitle.value[i];

      item.value = "";
      item.fileList = [];
    }
    dialogVisible.value = false;
    return false;
  }
  ElMessageBox.confirm("编辑的内容未保存，确定要关闭页面吗？").then(
    async () => {
      if (dialogList.value.modeType == "add") {
        let deleteStr = "";
        for (let i = 0; i < detailsTitle.value.length; i++) {
          const item = detailsTitle.value[i];
          if (
            (item.type == "img" ||
              item.type == "video" ||
              item.type == "file") &&
            item.value != ""
          ) {
            deleteStr += item.value + ",";
          }
          item.value = "";
          item.fileList = [];
        }
        if (deleteStr != "") {
          let res = (await delByUuids({ uuids: deleteStr })) as any;
          if (res.code == 200) {
            dialogVisible.value = false;
          }
        } else {
          dialogVisible.value = false;
        }
      } else {
        for (let i = 0; i < detailsTitle.value.length; i++) {
          const item = detailsTitle.value[i];

          item.value = "";
          item.fileList = [];
        }
        dialogVisible.value = false;
      }
    },
    () => {
      ElMessage.info("取消删除");
    }
  );
};
// 下载文件
const downLoadFile = (file: any) => {
  let a = document.createElement("a") as any;
  a.style = "display: none"; // 创建一个隐藏的a标签
  a.download = file.name;
  a.href = baseUrl + file.pid;
  document.body.appendChild(a);
  a.click(); // 触发a标签的click事件
  document.body.removeChild(a);
};
</script>

<style scoped lang="scss">
@import "/@/styles/dialog/dialog.scss";
</style>
../../api/fileApi