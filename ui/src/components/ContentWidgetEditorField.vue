<script lang="ts" setup>
import { ref } from 'vue'
import {
  createDefaultListItem,
  getContentWidgetFieldValue,
  setContentWidgetFieldValue,
} from '@/editor/content-widget-field-values'
import type {
  ContentWidgetEditorField,
  ContentWidgetEditorListItemField,
  ContentWidgetEditorListItemValue,
  ContentWidgetEditorFieldValue,
  ContentWidgetNodeAttrs,
} from '@/editor/content-widget-types'
import { type AttachmentLike } from '@halo-dev/ui-shared'

const props = defineProps<{
  widget: ContentWidgetNodeAttrs
  field: ContentWidgetEditorField
  inline?: boolean
}>()

const emit = defineEmits<{
  update: [widget: ContentWidgetNodeAttrs]
}>()

const attachmentSelectorVisible = ref(false)
const activeAttachmentField = ref<ContentWidgetEditorField | ContentWidgetEditorListItemField | null>(null)
const activeAttachmentItemIndex = ref<number | null>(null)

function emitFieldValue(value: ContentWidgetEditorFieldValue) {
  emit('update', setContentWidgetFieldValue(props.widget, props.field, value))
}

function primitiveValue() {
  const value = getContentWidgetFieldValue(props.widget, props.field)
  return Array.isArray(value) ? '' : value
}

function primitiveTextValue() {
  const value = primitiveValue()
  return typeof value === 'boolean' ? '' : value
}

function primitiveCheckedValue() {
  return Boolean(primitiveValue())
}

function primitiveColorValue() {
  const value = primitiveTextValue()
  return /^#[\da-f]{6}$/i.test(value) ? value : '#000000'
}

function selectPrimitiveValue(value: string) {
  emitFieldValue(value)
}

function listValue() {
  const value = getContentWidgetFieldValue(props.widget, props.field)
  return Array.isArray(value) ? value : []
}

function cloneItems() {
  return listValue().map((item) => ({
    attributes: { ...item.attributes },
    content: item.content,
  }))
}

function handlePrimitiveInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  emitFieldValue(
    props.field.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value,
  )
}

function openAttachmentSelector() {
  activeAttachmentField.value = props.field
  activeAttachmentItemIndex.value = null
  attachmentSelectorVisible.value = true
}

function onAttachmentSelect(attachments: AttachmentLike[]) {
  const attachment = attachments[0]
  if (!attachment) return

  let url = ''
  if (typeof attachment === 'string') {
    url = attachment
  } else {
    const attachmentValue = attachment as {
      status?: { permalink?: string }
      url?: string
    }
    url = attachmentValue.status?.permalink || attachmentValue.url || ''
  }

  if (activeAttachmentItemIndex.value !== null && activeAttachmentField.value) {
    const items = cloneItems()
    const item = items[activeAttachmentItemIndex.value]
    if (item) {
      if (activeAttachmentField.value.source === 'content') {
        item.content = url
      } else {
        item.attributes[activeAttachmentField.value.name] = url
      }
      emitFieldValue(items)
    }
  } else {
    emitFieldValue(url)
  }

  attachmentSelectorVisible.value = false
}

function openItemAttachmentSelector(index: number, field: ContentWidgetEditorListItemField) {
  activeAttachmentField.value = field
  activeAttachmentItemIndex.value = index
  attachmentSelectorVisible.value = true
}

function itemFieldValue(item: ContentWidgetEditorListItemValue, field: ContentWidgetEditorListItemField) {
  if (field.source === 'content') {
    return item.content
  }

  if (field.type === 'checkbox') {
    return Object.prototype.hasOwnProperty.call(item.attributes, field.name)
  }

  return item.attributes[field.name] || ''
}

function itemFieldTextValue(
  item: ContentWidgetEditorListItemValue,
  field: ContentWidgetEditorListItemField,
) {
  const value = itemFieldValue(item, field)
  return typeof value === 'boolean' ? '' : value
}

function itemFieldCheckedValue(
  item: ContentWidgetEditorListItemValue,
  field: ContentWidgetEditorListItemField,
) {
  return Boolean(itemFieldValue(item, field))
}

function updateItemField(index: number, field: ContentWidgetEditorListItemField, event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  const items = cloneItems()
  const item = items[index]

  if (!item) {
    return
  }

  if (field.source === 'content') {
    item.content = target.value
    emitFieldValue(items)
    return
  }

  if (field.type === 'checkbox') {
    if ((target as HTMLInputElement).checked) {
      item.attributes[field.name] = ''
    } else {
      delete item.attributes[field.name]
    }
    emitFieldValue(items)
    return
  }

  if (target.value) {
    item.attributes[field.name] = target.value
  } else {
    delete item.attributes[field.name]
  }

  emitFieldValue(items)
}

function addItem() {
  emitFieldValue([...listValue(), createDefaultListItem(props.field)])
}

function duplicateItem(index: number) {
  const item = listValue()[index]

  if (!item) {
    return
  }

  const clonedItem = {
    attributes: { ...item.attributes },
    content: item.content,
  }
  const items = cloneItems()
  items.splice(index + 1, 0, clonedItem)
  emitFieldValue(items)
}

function removeItem(index: number) {
  const items = cloneItems()
  items.splice(index, 1)
  emitFieldValue(items)
}

function moveItem(index: number, offset: number) {
  const items = cloneItems()
  const nextIndex = index + offset

  if (nextIndex < 0 || nextIndex >= items.length) {
    return
  }

  const [item] = items.splice(index, 1)
  items.splice(nextIndex, 0, item)
  emitFieldValue(items)
}
</script>

<template>
  <component
    :is="inline ? 'span' : 'div'"
    class="content-widget-editor-field"
    :class="{ 'content-widget-editor-field--inline': inline }"
  >
    <component
      :is="field.type === 'icon' ? 'div' : 'label'"
      v-if="field.type !== 'list'"
      class="content-widget-editor-field__label"
      :class="{ 'content-widget-editor-field__label--check': field.type === 'checkbox' }"
    >
      <span>{{ field.label }}</span>

      <select
        v-if="field.type === 'select'"
        :value="primitiveTextValue()"
        @change="handlePrimitiveInput"
      >
        <option v-for="option in field.options || []" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <span v-else-if="field.type === 'color'" class="content-widget-editor-field__color">
        <input
          type="color"
          :value="primitiveColorValue()"
          :aria-label="field.label"
          @input="handlePrimitiveInput"
        />
        <input
          type="text"
          :value="primitiveTextValue()"
          :placeholder="field.placeholder"
          @input="handlePrimitiveInput"
        />
      </span>

      <span
        v-else-if="field.type === 'icon'"
        class="content-widget-editor-field__icons"
        role="listbox"
        :aria-label="field.label"
      >
        <button
          v-for="option in field.options || []"
          :key="option.value"
          type="button"
          :class="{ 'is-active': primitiveTextValue() === option.value }"
          :title="option.label"
          :aria-label="option.label"
          :aria-selected="primitiveTextValue() === option.value"
          @click="selectPrimitiveValue(option.value)"
        >
          <svg
            v-if="option.icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            v-html="option.icon"
          />
          <span v-else>{{ option.label }}</span>
        </button>
      </span>

      <textarea
        v-else-if="field.type === 'textarea'"
        :value="primitiveTextValue()"
        :placeholder="field.placeholder"
        rows="3"
        @input="handlePrimitiveInput"
      />

      <input
        v-else-if="field.type === 'checkbox'"
        class="content-widget-editor-field__check"
        type="checkbox"
        :checked="primitiveCheckedValue()"
        @change="handlePrimitiveInput"
      />

      <component
        :is="inline ? 'span' : 'div'"
        v-else-if="field.type === 'attachment'"
        class="content-widget-editor-field__attachment"
      >
        <input
          type="text"
          :value="primitiveTextValue()"
          :placeholder="field.placeholder"
          @input="handlePrimitiveInput"
        />
        <button type="button" class="content-widget-editor-field__attachment-btn" @click="openAttachmentSelector">
          选择
        </button>
      </component>

      <input
        v-else
        type="text"
        :value="primitiveTextValue()"
        :placeholder="field.placeholder"
        @input="handlePrimitiveInput"
      />
    </component>

    <component :is="inline ? 'span' : 'div'" v-else class="content-widget-editor-list">
      <component :is="inline ? 'span' : 'div'" class="content-widget-editor-list__head">
        <span>{{ field.label }}</span>
        <button type="button" @click="addItem">
          {{ field.addLabel || '添加' }}
        </button>
      </component>

      <component
        :is="inline ? 'span' : 'div'"
        v-for="(item, index) in listValue()"
        :key="`${field.name}-${index}`"
        class="content-widget-editor-list__item"
      >
        <component :is="inline ? 'span' : 'div'" class="content-widget-editor-list__item-head">
          <strong>{{ field.itemLabel || field.label }} {{ index + 1 }}</strong>
          <span>
            <button
              type="button"
              :disabled="index === 0"
              title="上移"
              aria-label="上移"
              @click="moveItem(index, -1)"
            >
              ↑
            </button>
            <button
              type="button"
              :disabled="index === listValue().length - 1"
              title="下移"
              aria-label="下移"
              @click="moveItem(index, 1)"
            >
              ↓
            </button>
            <button type="button" title="复制" aria-label="复制" @click="duplicateItem(index)">
              +
            </button>
            <button type="button" title="删除" aria-label="删除" @click="removeItem(index)">×</button>
          </span>
        </component>

        <label
          v-for="itemField in field.itemFields || []"
          :key="itemField.name"
          class="content-widget-editor-field__label"
          :class="{ 'content-widget-editor-field__label--check': itemField.type === 'checkbox' }"
        >
          <span>{{ itemField.label }}</span>

          <select
            v-if="itemField.type === 'select'"
            :value="itemFieldTextValue(item, itemField)"
            @change="updateItemField(index, itemField, $event)"
          >
            <option
              v-for="option in itemField.options || []"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <textarea
            v-else-if="itemField.type === 'textarea'"
            :value="itemFieldTextValue(item, itemField)"
            :placeholder="itemField.placeholder"
            rows="3"
            @input="updateItemField(index, itemField, $event)"
          />

          <input
            v-else-if="itemField.type === 'checkbox'"
            class="content-widget-editor-field__check"
            type="checkbox"
            :checked="itemFieldCheckedValue(item, itemField)"
            @change="updateItemField(index, itemField, $event)"
          />

          <component
            :is="inline ? 'span' : 'div'"
            v-else-if="itemField.type === 'attachment'"
            class="content-widget-editor-field__attachment"
          >
            <input
              type="text"
              :value="itemFieldTextValue(item, itemField)"
              :placeholder="itemField.placeholder"
              @input="updateItemField(index, itemField, $event)"
            />
            <button
              type="button"
              class="content-widget-editor-field__attachment-btn"
              @click="openItemAttachmentSelector(index, itemField)"
            >
              选择
            </button>
          </component>

          <input
            v-else
            type="text"
            :value="itemFieldTextValue(item, itemField)"
            :placeholder="itemField.placeholder"
            @input="updateItemField(index, itemField, $event)"
          />
        </label>
      </component>
    </component>

    <AttachmentSelectorModal
      v-model:visible="attachmentSelectorVisible"
      :accepts="activeAttachmentField?.accepts"
      :min="1"
      :max="1"
      @select="onAttachmentSelect"
    />
  </component>
</template>

<style scoped>
.content-widget-editor-field,
.content-widget-editor-list,
.content-widget-editor-list__item {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.content-widget-editor-field--inline {
  display: inline-grid;
  width: min(340px, calc(100vw - 48px));
}

.content-widget-editor-field__label {
  display: grid;
  gap: 5px;
  color: #374151;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
}

.content-widget-editor-field__label--check {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
}

.content-widget-editor-field__attachment {
  display: flex;
  gap: 6px;
  align-items: center;
}

.content-widget-editor-field__color {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 7px;
  align-items: center;
}

.content-widget-editor-field__color input[type='color'] {
  width: 42px;
  height: 32px;
  padding: 3px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}

.content-widget-editor-field__icons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(34px, 1fr));
  gap: 5px;
}

.content-widget-editor-field__icons button {
  height: 34px;
  padding: 0;
  background: #f8fafc;
}

.content-widget-editor-field__icons button.is-active {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.content-widget-editor-field__icons svg {
  width: 18px;
  height: 18px;
}

.content-widget-editor-field__attachment input {
  flex: 1;
  min-width: 0;
  height: 32px;
  padding: 0 9px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #111827;
  font: inherit;
  font-weight: 400;
  outline: none;
}

.content-widget-editor-field__attachment input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.content-widget-editor-field__attachment-btn {
  flex-shrink: 0;
  height: 32px;
  padding: 0 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.content-widget-editor-field__attachment-btn:hover {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
}

.content-widget-editor-field__check {
  position: relative;
  appearance: none;
  width: 36px;
  height: 20px;
  border: none;
  border-radius: 999px;
  background: #cbd5e1;
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    box-shadow 0.16s ease;
}

.content-widget-editor-field__check::before {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.2);
  content: '';
  transition: transform 0.16s ease;
}

.content-widget-editor-field__check:checked {
  background: #2563eb;
}

.content-widget-editor-field__check:checked::before {
  transform: translateX(16px);
}

.content-widget-editor-field input[type='text'],
.content-widget-editor-field textarea,
.content-widget-editor-field select {
  width: 100%;
  min-width: 0;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #111827;
  font: inherit;
  font-weight: 400;
  outline: none;
}

.content-widget-editor-field input[type='text'],
.content-widget-editor-field select {
  height: 32px;
  padding: 0 9px;
}

.content-widget-editor-field textarea {
  resize: vertical;
  min-height: 72px;
  padding: 8px 9px;
}

.content-widget-editor-field input:focus,
.content-widget-editor-field textarea:focus,
.content-widget-editor-field select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.content-widget-editor-field__check:focus {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

.content-widget-editor-list__head,
.content-widget-editor-list__item-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
}

.content-widget-editor-list__head {
  color: #111827;
  font-size: 12px;
  font-weight: 700;
}

.content-widget-editor-list__item {
  gap: 9px;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 7px;
  background: #fff;
}

.content-widget-editor-list__item-head strong {
  color: #111827;
  font-size: 12px;
  line-height: 1.4;
}

.content-widget-editor-list__item-head span {
  display: inline-flex;
  gap: 4px;
}

.content-widget-editor-field button {
  display: inline-grid;
  place-items: center;
  min-width: 26px;
  height: 26px;
  padding: 0 7px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  line-height: 1;
}

.content-widget-editor-field button:hover:not(:disabled) {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
}

.content-widget-editor-field button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
</style>
