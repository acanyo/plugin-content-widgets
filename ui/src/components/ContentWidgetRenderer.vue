<script lang="ts" setup>
import { mountCustomElements } from '@xhhao/content-widgets'
import '@xhhao/content-widgets/content-widgets.css'
import { nextTick, onMounted, ref, watch } from 'vue'
import { createWidgetHTML } from '@/editor/content-widget-html'
import type { ContentWidgetNodeAttrs } from '@/editor/content-widget-types'

const props = withDefaults(
  defineProps<{
    widget: ContentWidgetNodeAttrs
    inline?: boolean
    passive?: boolean
  }>(),
  {
    inline: false,
    passive: false,
  },
)

const rootRef = ref<HTMLElement>()

const renderWidget = async () => {
  if (!rootRef.value) {
    return
  }

  rootRef.value.innerHTML = createWidgetHTML(props.widget)
  await nextTick()
  mountCustomElements(rootRef.value)
}

watch(
  () => props.widget,
  () => {
    renderWidget()
  },
  { deep: true, flush: 'post' },
)

onMounted(() => {
  renderWidget()
})
</script>

<template>
  <component
    :is="inline ? 'span' : 'div'"
    ref="rootRef"
    class="content-widget-renderer"
    :inert="passive || undefined"
    :aria-hidden="passive ? 'true' : undefined"
    :class="{
      'content-widget-renderer--inline': inline,
      'content-widget-renderer--passive': passive,
    }"
  />
</template>

<style scoped>
.content-widget-renderer {
  display: block;
  min-width: 0;
}

.content-widget-renderer--inline {
  display: inline;
}

.content-widget-renderer--passive {
  pointer-events: none;
}
</style>
