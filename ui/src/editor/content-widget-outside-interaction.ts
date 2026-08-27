export interface ContentWidgetOutsideInteraction {
  root: () => HTMLElement | null
  close: () => void
  shouldIgnore?: (event: PointerEvent) => boolean
}

const interactions = new Set<ContentWidgetOutsideInteraction>()
let listening = false

function handleDocumentPointerDown(event: PointerEvent) {
  const entries = [...interactions]
  if (entries.some((entry) => entry.shouldIgnore?.(event))) return

  const target = event.target
  const path = event.composedPath()

  for (const entry of entries) {
    const root = entry.root()
    if (!root) continue
    if (target instanceof Node && (root.contains(target) || path.includes(root))) continue
    entry.close()
  }
}

function syncListener() {
  if (typeof document === 'undefined') return

  if (interactions.size > 0 && !listening) {
    document.addEventListener('pointerdown', handleDocumentPointerDown, true)
    listening = true
  } else if (interactions.size === 0 && listening) {
    document.removeEventListener('pointerdown', handleDocumentPointerDown, true)
    listening = false
  }
}

export function registerContentWidgetOutsideInteraction(
  interaction: ContentWidgetOutsideInteraction,
) {
  interactions.add(interaction)
  syncListener()

  return () => {
    interactions.delete(interaction)
    syncListener()
  }
}
