export interface LinkMetadata {
  url: string
  host: string
  platform: string
  siteName: string
  title: string
  description: string
  iconUrl: string
  imageUrl: string
  source: 'api' | 'page' | 'fallback'
}

const metadataPresetMap: Record<string, string> = {
  github: 'github',
  bilibili: 'bilibili',
  behance: 'behance',
  xiaohongshu: 'xiaohongshu',
  xinpianchang: 'xinpianchang',
  dribbble: 'dribbble',
  artstation: 'artstation',
  pinterest: 'pinterest',
}

const metadataIconMap: Record<string, string> = {
  github: 'code',
  bilibili: 'video',
  behance: 'image',
  xiaohongshu: 'image',
  xinpianchang: 'video',
  dribbble: 'image',
  artstation: 'image',
  pinterest: 'image',
}

function setMetadataAttribute(attributes: Record<string, string>, name: string, value: string | undefined) {
  const normalized = value?.trim() || ''
  if (normalized) attributes[name] = normalized
}

export function applyLinkMetadata(
  attributes: Record<string, string>,
  metadata: LinkMetadata,
  fallbackHref: string,
  autoField = 'auto-metadata',
) {
  const followsAutomaticPreset = attributes[autoField] === '' || attributes[autoField] === 'true'
  const next = followsAutomaticPreset
    ? clearAutomaticPresetAttributes(attributes)
    : { ...attributes }
  const platform = metadata.platform.toLowerCase()

  setMetadataAttribute(next, 'preset', metadataPresetMap[platform] || 'website')
  setMetadataAttribute(next, 'label', metadata.siteName)
  setMetadataAttribute(next, 'title', metadata.title)
  setMetadataAttribute(next, 'description', metadata.description)
  setMetadataAttribute(next, 'href', metadata.url || fallbackHref)
  setMetadataAttribute(next, 'icon-name', metadataIconMap[platform])

  if (metadata.iconUrl?.trim()) {
    setMetadataAttribute(next, 'icon', metadata.iconUrl)
  } else {
    delete next.icon
  }

  if (metadata.imageUrl?.trim()) {
    setMetadataAttribute(next, 'image', metadata.imageUrl)
    setMetadataAttribute(next, 'show-image', 'true')
  } else {
    delete next.image
    delete next['show-image']
  }

  setMetadataAttribute(next, autoField, 'true')
  return next
}

function clearAutomaticPresetAttributes(attributes: Record<string, string>) {
  const next = { ...attributes }

  for (const name of [
    'label',
    'title',
    'description',
    'accent-color',
    'background-color',
    'text-color',
    'icon-name',
    'icon',
    'image',
    'show-image',
  ]) {
    delete next[name]
  }

  return next
}

const LINK_METADATA_ENDPOINT =
  '/apis/console.api.content-widgets.xhhao.com/v1alpha1/link-metadata'

export async function readLinkMetadata(url: string): Promise<LinkMetadata> {
  const response = await fetch(`${LINK_METADATA_ENDPOINT}?url=${encodeURIComponent(url)}`, {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  })

  const contentType = response.headers.get('content-type') || ''
  if (!response.ok || !contentType.toLowerCase().includes('application/json')) {
    const payload = (await response.json().catch(() => undefined)) as
      | { message?: string }
      | undefined
    throw new Error(
      payload?.message
      || (response.status === 200 ? '请先登录 Halo 管理后台。' : `读取失败（HTTP ${response.status}）`),
    )
  }

  return response.json() as Promise<LinkMetadata>
}
