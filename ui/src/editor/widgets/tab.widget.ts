import { attrField, defineWidget, listField, listItemAttrField, listItemContentField } from './kit'

export default defineWidget({
  id: 'tab',
  title: '标签页',
  description: '将内容切分到多个页签中。',
  category: '布局',
  kind: 'block',
  tagName: 'xhhao-com-tab',
  attributes: { tabs: '介绍,示例', active: '1' },
  innerHTML:
    '<xhhao-com-tab-panel>这里写第一个标签页内容。</xhhao-com-tab-panel><xhhao-com-tab-panel>这里写第二个标签页内容。</xhhao-com-tab-panel>',
  keywords: ['tab', 'tabs'],
  fields: [
    attrField('active', '激活序号', 'text', '1'),
    attrField('center', '居中', 'checkbox'),
    listField({
      name: 'panels',
      label: '标签页',
      childTagName: 'xhhao-com-tab-panel',
      addLabel: '添加标签页',
      itemLabel: '标签页',
      syncAttributeFromItems: {
        attributeName: 'tabs',
        itemName: 'title',
      },
      defaultItem: {
        title: '新标签',
        content: '这里写标签页内容。',
      },
      itemFields: [
        listItemAttrField('title', '标签名', 'text', '介绍'),
        listItemContentField('内容', '这里写标签页内容。'),
      ],
    }),
  ],
})
