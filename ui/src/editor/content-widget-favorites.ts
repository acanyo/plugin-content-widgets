const CONTENT_WIDGET_FAVORITES_STORAGE_KEY = 'xhhao-content-widgets:favorites:v1'

function normalizeFavoriteIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return [
    ...new Set(value.filter((item): item is string => typeof item === 'string' && item.length > 0)),
  ]
}

export function parseContentWidgetFavorites(rawValue: string | null): string[] {
  if (!rawValue) {
    return []
  }

  try {
    return normalizeFavoriteIds(JSON.parse(rawValue))
  } catch {
    return []
  }
}

export function loadContentWidgetFavorites(): string[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    return parseContentWidgetFavorites(
      window.localStorage.getItem(CONTENT_WIDGET_FAVORITES_STORAGE_KEY),
    )
  } catch {
    return []
  }
}

export function saveContentWidgetFavorites(ids: string[]) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(
      CONTENT_WIDGET_FAVORITES_STORAGE_KEY,
      JSON.stringify(normalizeFavoriteIds(ids)),
    )
  } catch {
    // The picker remains usable when storage is unavailable or full.
  }
}

export function toggleContentWidgetFavorite(ids: string[], widgetId: string): string[] {
  const nextIds = new Set(normalizeFavoriteIds(ids))
  if (nextIds.has(widgetId)) {
    nextIds.delete(widgetId)
  } else {
    nextIds.add(widgetId)
  }

  return [...nextIds]
}

export function isContentWidgetFavoritesStorageEvent(event: StorageEvent) {
  return event.key === CONTENT_WIDGET_FAVORITES_STORAGE_KEY
}
