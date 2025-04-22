<template>
  <div class="code" ref="coderef"></div>
</template>

<script setup lang="ts">
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { ViewPlugin } from '@codemirror/view';
import { javascript } from "@codemirror/lang-javascript";
import { html } from '@codemirror/lang-html'
import { oneDark } from "@codemirror/theme-one-dark";
import { vue } from '@codemirror/lang-vue'
import {onMounted} from "vue";
const coderef = ref<any>(null)
const props = defineProps<{modleValue:string|undefined}>()
const emits = defineEmits(['update:modelValue'])

const updateValue = (e:any,cm:any)=>{
  const code = cm.state.doc.toString()
  emits('update:modelValue', code)
}
const events = ['blur', 'keyup', 'paste', 'cut', 'delete', 'mouseup']
const eventHandler = ViewPlugin.define(cm => null as any, {
  eventHandlers: Object.fromEntries(events.map(e => [e, updateValue]))
})
const state = EditorState.create({
  doc:`${props.modleValue}`,
  extensions:[basicSetup,vue(),html(),javascript(),oneDark,eventHandler]
})

const getCodeor = ()=>{
  const cm = new EditorView({
    state:state,
    parent:coderef.value
  })
}

onMounted(()=>{
  getCodeor()
})

</script>

<style scoped lang="scss">
.code {
  width: 100%;
  height:600px;
  overflow-y: auto;
}
.ͼ1 .cm-merge-b .cm-changedLine {
  background: #ddfbe6;
}
.ͼ1 .cm-merge-b .cm-changedText {
  background: #c6efd0;
}
.cm-merge-revert {
  display: none;
}
.cm-merge-a .cm-changedText,
.cm-deletedChunk .cm-deletedText {
  background: #eac3cc;
}
.cm-changeGutter {
  width: 100%;
}
.cm-changeGutter {
  position: absolute;
  left: 0;
  z-index: -1;
}
.cm-merge-b .cm-changedLineGutter {
  background: #ddfbe6;
}
.cm-merge-a .cm-changedLineGutter,
.cm-deletedLineGutter {
  background: #f9d7dc;
}
.cm-merge-a .cm-changedLine,
.cm-deletedChunk {
  background: #fbe9eb;
}
.cm-merge-b .cm-changedLine {
  background: #ecfdf0;
}
.cm-line {
  padding: 2px 2px 0 6px;
  padding-left: 40px;
  position: relative;
  font-size: 12px;
}
.cm-merge-a .cm-changedLine::before {
  content: "-";
  display: inline-block;
  position: absolute;
  left: 10px;
  color: #9bb0a1;
}

.cm-merge-b .cm-changedLine::before {
  content: "+";
  display: inline-block;
  position: absolute;
  left: 10px;
  color: #9bb0a1;
}
.cm-lineNumbers .cm-gutterElement {
  /* padding: 2px 3px 0 5px; */
  color: rgba(0, 0, 0, 0.3);
}
.cm-merge-revert {
  display: none;
}
.cm-gutters {
  padding-left: 30px;
}
.cm-content {
  padding: 0;
}
</style>
