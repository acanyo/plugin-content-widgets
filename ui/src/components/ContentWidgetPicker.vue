<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { contentWidgetCategories, contentWidgetDefinitions } from '@/editor/content-widget-registry'
import { definitionToNodeAttrs } from '@/editor/content-widget-html'
import {
  isContentWidgetFavoritesStorageEvent,
  loadContentWidgetFavorites,
  saveContentWidgetFavorites,
  toggleContentWidgetFavorite,
} from '@/editor/content-widget-favorites'
import type { ContentWidgetDefinition } from '@/editor/content-widget-types'
import ContentWidgetRenderer from './ContentWidgetRenderer.vue'
import IconClose from '~icons/ri/close-line'
import IconHeartFill from '~icons/ri/heart-fill'
import IconHeartLine from '~icons/ri/heart-line'
import IconSearch from '~icons/ri/search-line'

const emit = defineEmits<{
  close: []
  select: [definition: ContentWidgetDefinition]
}>()

const keyword = ref('')
const activeCategory = ref('全部')
const favoriteIds = ref(loadContentWidgetFavorites())
const favoriteCategory = '我的收藏'
const knownWidgetIds = new Set(contentWidgetDefinitions.map((item) => item.id))
const favoriteIdSet = computed(
  () => new Set(favoriteIds.value.filter((id) => knownWidgetIds.has(id))),
)

const categories = computed(() => ['全部', favoriteCategory, ...contentWidgetCategories])
const categoryCount = (category: string) =>
  category === '全部'
    ? contentWidgetDefinitions.length
    : category === favoriteCategory
      ? favoriteIdSet.value.size
      : contentWidgetDefinitions.filter((item) => item.category === category).length

const filteredWidgets = computed(() => {
  const value = keyword.value.trim().toLowerCase()
  return contentWidgetDefinitions.filter((item) => {
    const matchesCategory =
      activeCategory.value === '全部' ||
      (activeCategory.value === favoriteCategory && favoriteIdSet.value.has(item.id)) ||
      item.category === activeCategory.value
    const matchesKeyword =
      !value ||
      [item.title, item.description, item.tagName, ...(item.keywords || [])]
        .join(' ')
        .toLowerCase()
        .includes(value)

    return matchesCategory && matchesKeyword
  })
})

const previewWidget = (widget: ContentWidgetDefinition) => definitionToNodeAttrs(widget)
const emptyMessage = computed(() =>
  activeCategory.value === favoriteCategory && !keyword.value.trim()
    ? '还没有收藏组件，点击组件卡片上的爱心即可收藏'
    : '没有找到匹配的组件',
)

function isFavorite(widgetId: string) {
  return favoriteIdSet.value.has(widgetId)
}

function toggleFavorite(widgetId: string) {
  favoriteIds.value = toggleContentWidgetFavorite([...favoriteIdSet.value], widgetId)
  saveContentWidgetFavorites(favoriteIds.value)
}

function handleStorage(event: StorageEvent) {
  if (isContentWidgetFavoritesStorageEvent(event)) {
    favoriteIds.value = loadContentWidgetFavorites()
  }
}

onMounted(() => window.addEventListener('storage', handleStorage))
onBeforeUnmount(() => window.removeEventListener('storage', handleStorage))
</script>

<template>
  <div class="content-widget-picker-overlay" @click.self="emit('close')">
    <section
      class="content-widget-picker-dialog"
      role="dialog"
      aria-modal="true"
      aria-label="文章组件"
    >
      <header class="content-widget-picker__header">
        <div class="content-widget-picker__title">
          <h2>文章组件</h2>
          <p>选择组件后会插入到当前光标位置</p>
        </div>
        <button
          class="content-widget-picker__close"
          type="button"
          aria-label="关闭"
          @click="emit('close')"
        >
          <IconClose />
        </button>
      </header>

      <div class="content-widget-picker__body">
        <aside class="content-widget-picker__sidebar" aria-label="组件分类">
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            :class="{ 'is-active': category === activeCategory }"
            @click="activeCategory = category"
          >
            <span>{{ category }}</span>
            <em>{{ categoryCount(category) }}</em>
          </button>
        </aside>

        <main class="content-widget-picker__main">
          <label class="content-widget-picker__search">
            <IconSearch />
            <input v-model="keyword" placeholder="搜索组件" type="search" autofocus />
          </label>

          <div class="content-widget-picker__grid">
            <article
              v-for="widget in filteredWidgets"
              :key="widget.id"
              class="content-widget-picker__item"
            >
              <span class="content-widget-picker__preview">
                <ContentWidgetRenderer
                  :widget="previewWidget(widget)"
                  :inline="widget.kind === 'inline'"
                  passive
                />
              </span>

              <span class="content-widget-picker__item-copy">
                <span class="content-widget-picker__item-head">
                  <strong :id="`content-widget-title-${widget.id}`">{{ widget.title }}</strong>
                  <span
                    class="content-widget-picker__kind"
                    :class="`content-widget-picker__kind--${widget.kind}`"
                  >
                    {{ widget.kind === 'inline' ? '行内' : '块级' }}
                  </span>
                </span>
                <span class="content-widget-picker__item-desc">{{ widget.description }}</span>
              </span>

              <button
                class="content-widget-picker__select"
                type="button"
                :aria-labelledby="`content-widget-title-${widget.id}`"
                @click="emit('select', widget)"
              />

              <button
                class="content-widget-picker__favorite"
                :class="{ 'is-favorite': isFavorite(widget.id) }"
                type="button"
                :aria-label="`${isFavorite(widget.id) ? '取消收藏' : '收藏'}${widget.title}`"
                :aria-pressed="isFavorite(widget.id)"
                :title="isFavorite(widget.id) ? '取消收藏' : '收藏'"
                @click.stop="toggleFavorite(widget.id)"
              >
                <IconHeartFill v-if="isFavorite(widget.id)" />
                <IconHeartLine v-else />
              </button>
            </article>

            <div v-if="!filteredWidgets.length" class="content-widget-picker__empty">
              {{ emptyMessage }}
            </div>
          </div>
        </main>
      </div>
    </section>
  </div>
</template>

<style scoped>
.content-widget-picker-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgb(15 23 42 / 0.4);
  backdrop-filter: blur(8px);
}

.content-widget-picker-dialog {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  width: min(980px, calc(100vw - 32px));
  max-height: min(82vh, 760px);
  overflow: hidden;
  border: 1px solid rgb(229 231 235 / 0.9);
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 28px 90px rgb(15 23 42 / 0.3);
}

.content-widget-picker__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 18px 14px;
  border-bottom: 1px solid #eef2f7;
}

.content-widget-picker__header h2 {
  margin: 0;
  color: #111827;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
}

.content-widget-picker__title {
  display: grid;
  gap: 2px;
}

.content-widget-picker__header p {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.4;
}

.content-widget-picker__close {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #6b7280;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

.content-widget-picker__close svg {
  width: 18px;
  height: 18px;
}

.content-widget-picker__close:hover {
  background: #f3f4f6;
  color: #111827;
}

.content-widget-picker__body {
  display: grid;
  grid-template-columns: 168px minmax(0, 1fr);
  min-height: 0;
}

.content-widget-picker__sidebar {
  display: grid;
  align-content: start;
  gap: 4px;
  min-height: 0;
  padding: 14px 10px;
  border-right: 1px solid #eef2f7;
  background: #f8fafc;
}

.content-widget-picker__sidebar button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  height: 34px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: #4b5563;
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
  text-align: left;
}

.content-widget-picker__sidebar button:hover {
  background: #fff;
  color: #111827;
}

.content-widget-picker__sidebar button.is-active {
  border-color: #bfdbfe;
  background: #fff;
  color: #1d4ed8;
  font-weight: 700;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.06);
}

.content-widget-picker__sidebar em {
  color: #9ca3af;
  font-style: normal;
  font-size: 12px;
}

.content-widget-picker__main {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 12px;
  min-width: 0;
  min-height: 0;
  padding: 14px;
}

.content-widget-picker__search {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 11px;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #fff;
  color: #6b7280;
}

.content-widget-picker__search:focus-within {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.content-widget-picker__search svg {
  width: 16px;
  height: 16px;
}

.content-widget-picker__search input {
  width: 100%;
  min-width: 0;
  border: none;
  outline: none;
  color: #111827;
  font: inherit;
}

.content-widget-picker__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(246px, 1fr));
  align-content: start;
  gap: 12px;
  min-height: 0;
  overflow: auto;
  padding: 2px 4px 2px 2px;
}

.content-widget-picker__item {
  position: relative;
  display: grid;
  grid-template-rows: minmax(86px, auto) auto;
  gap: 12px;
  min-height: 176px;
  padding: 10px;
  border: 1px solid #e6edf5;
  border-radius: 8px;
  background: #fff;
  color: #111827;
  text-align: left;
}

.content-widget-picker__item:hover {
  border-color: #93c5fd;
  background: #fbfdff;
  box-shadow: 0 8px 22px rgb(15 23 42 / 0.08);
  transform: translateY(-1px);
}

.content-widget-picker__select {
  position: absolute;
  z-index: 1;
  inset: 0;
  border: none;
  border-radius: inherit;
  background: transparent;
  cursor: pointer;
}

.content-widget-picker__select:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

.content-widget-picker__favorite {
  z-index: 2;
  grid-row: 2;
  grid-column: 1;
  align-self: start;
  justify-self: end;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  margin-top: -3px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
}

.content-widget-picker__favorite:hover,
.content-widget-picker__favorite:focus-visible {
  border-color: #fecdd3;
  outline: none;
  background: #fff1f2;
  color: #e11d48;
}

.content-widget-picker__favorite.is-favorite {
  color: #e11d48;
}

.content-widget-picker__favorite svg {
  width: 16px;
  height: 16px;
}

.content-widget-picker__item-copy {
  grid-row: 2;
  grid-column: 1;
  display: grid;
  gap: 5px;
  min-width: 0;
  padding-right: 34px;
}

.content-widget-picker__item-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.content-widget-picker__kind {
  flex: 0 0 auto;
  padding: 2px 7px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.4;
}

.content-widget-picker__kind--inline {
  background: #eff6ff;
  color: #2563eb;
}

.content-widget-picker__kind--block {
  background: #f3f4f6;
  color: #4b5563;
}

.content-widget-picker__item-desc {
  color: #6b7280;
  font-size: 13px;
  line-height: 1.4;
}

.content-widget-picker__preview {
  display: block;
  min-height: 86px;
  max-height: 128px;
  overflow: hidden;
  padding: 10px;
  border: 1px solid #eef3f8;
  border-radius: 6px;
  background: linear-gradient(180deg, #fff, #f8fafc);
}

.content-widget-picker__empty {
  display: grid;
  place-items: center;
  min-height: 220px;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  color: #6b7280;
  font-size: 13px;
}

@media (max-width: 720px) {
  .content-widget-picker-dialog {
    width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
  }

  .content-widget-picker__body {
    grid-template-columns: 1fr;
  }

  .content-widget-picker__sidebar {
    display: flex;
    overflow-x: auto;
    padding: 10px 14px;
    border-right: none;
    border-bottom: 1px solid #eef2f7;
  }

  .content-widget-picker__sidebar button {
    flex: 0 0 auto;
  }
}
</style>
