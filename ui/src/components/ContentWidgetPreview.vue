<script lang="ts" setup>
import { NodeSelection, NodeViewWrapper, nodeViewProps } from '@halo-dev/richtext-editor'
import { computed } from 'vue'
import {
  getContentWidgetDefinitionByTagName,
  getContentWidgetEditorFields,
} from '@/editor/content-widget-registry'
import type { ContentWidgetNodeAttrs } from '@/editor/content-widget-types'
import ContentWidgetEditorField from './ContentWidgetEditorField.vue'
import ContentWidgetRenderer from './ContentWidgetRenderer.vue'

const props = defineProps(nodeViewProps)
const isInline = computed(() => props.node.type.name.includes('Inline'))
const widget = computed(() => ({
  tagName: props.node.attrs.tagName,
  attributes: props.node.attrs.attributes || {},
  innerHTML: props.node.attrs.innerHTML || '',
  title: props.node.attrs.title,
}))
const fields = computed(() => getContentWidgetEditorFields(widget.value.tagName))
const hasEditableFields = computed(() => fields.value.length > 0)
const definition = computed(() => getContentWidgetDefinitionByTagName(widget.value.tagName))
const title = computed(() => definition.value?.title || widget.value.title || '文章组件')

function updateWidget(nextWidget: ContentWidgetNodeAttrs) {
  const position = props.getPos()
  const nextAttrs = {
    tagName: nextWidget.tagName,
    attributes: nextWidget.attributes || {},
    innerHTML: nextWidget.innerHTML || '',
    title: nextWidget.title || props.node.attrs.title,
  }

  if (typeof position !== 'number') {
    props.updateAttributes(nextAttrs)
    return
  }

  props.editor.commands.command(({ tr }) => {
    const node = tr.doc.nodeAt(position)

    if (!node || node.type.name !== props.node.type.name) {
      return false
    }

    tr.setNodeMarkup(position, undefined, {
      ...props.node.attrs,
      ...nextAttrs,
    })
    tr.setSelection(NodeSelection.create(tr.doc, position))

    return true
  })
}
</script>

<template>
  <NodeViewWrapper
    :as="isInline ? 'span' : 'div'"
    class="content-widget-node"
    :class="{
      'content-widget-node--inline': isInline,
      'content-widget-node--selected': selected,
    }"
  >
    <ContentWidgetRenderer
      class="content-widget-node__preview"
      :widget="widget"
      :inline="isInline"
    />

    <component
      :is="isInline ? 'span' : 'div'"
      v-if="selected"
      class="content-widget-node__editor"
      :class="{ 'content-widget-node__editor--inline': isInline }"
      contenteditable="false"
      @mousedown.stop
      @click.stop
      @input.stop
      @focusin.stop
      @focusout.stop
      @keydown.stop
      @keyup.stop
    >
      <span class="content-widget-node__editor-head">
        <strong>{{ title }}</strong>
        <em>{{ isInline ? '行内组件' : '块级组件' }}</em>
      </span>

      <template v-if="hasEditableFields">
        <ContentWidgetEditorField
          v-for="field in fields"
          :key="field.name"
          :widget="widget"
          :field="field"
          :inline="isInline"
          @update="updateWidget"
        />
      </template>
      <span v-else class="content-widget-node__editor-empty">这个组件无需配置。</span>
    </component>
  </NodeViewWrapper>
</template>

<style scoped>
.content-widget-node {
  display: block;
  position: relative;
  margin: 0.5em 0;
  border-radius: 8px;
  min-width: 0;
  line-height: normal;
}

.content-widget-node--inline {
  display: inline;
  align-items: center;
  margin: 0 0.15em;
  vertical-align: baseline;
}

.content-widget-node--selected {
  outline: 2px solid rgba(37, 99, 235, 0.34);
  outline-offset: 3px;
}

.content-widget-node__preview {
  display: block;
  min-width: 0;
  pointer-events: none;
}

.content-widget-node--inline .content-widget-node__preview {
  display: inline;
}

.content-widget-node__editor {
  display: grid;
  gap: 10px;
  margin-top: 10px;
  padding: 12px;
  border: 1px solid #dbe7f5;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 10px 28px rgb(15 23 42 / 0.1);
}

.content-widget-node__editor--inline {
  position: absolute;
  z-index: 20;
  top: calc(100% + 8px);
  left: 0;
  width: min(380px, calc(100vw - 48px));
  margin-top: 0;
}

.content-widget-node__editor-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #eef2f7;
}

.content-widget-node__editor-head strong {
  color: #111827;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.4;
}

.content-widget-node__editor-head em {
  flex: 0 0 auto;
  padding: 2px 7px;
  border-radius: 5px;
  background: #f1f5f9;
  color: #64748b;
  font-style: normal;
  font-weight: 700;
  font-size: 11px;
  line-height: 1.4;
}

.content-widget-node__editor-empty {
  color: #6b7280;
  font-size: 12px;
  line-height: 1.5;
}
</style>
