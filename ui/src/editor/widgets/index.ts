import type { ContentWidgetModule } from '../content-widget-types'
import alert from './alert.widget'
import annotation from './annotation.widget'
import badge from './badge.widget'
import bilibili from './bilibili.widget'
import blur from './blur.widget'
import button from './button.widget'
import cardList from './card-list.widget'
import chat from './chat.widget'
import commandGroup from './command-group.widget'
import compare from './compare.widget'
import copy from './copy.widget'
import emojiClock from './emoji-clock.widget'
import folding from './folding.widget'
import key from './key.widget'
import note from './note.widget'
import pdf from './pdf.widget'
import pic from './pic.widget'
import progress from './progress.widget'
import quote from './quote.widget'
import readingTime from './reading-time.widget'
import result from './result.widget'
import split from './split.widget'
import status from './status.widget'
import stepper from './stepper.widget'
import tab from './tab.widget'
import taskList from './task-list.widget'
import timeline from './timeline.widget'
import tip from './tip.widget'

// 新增组件：创建 xxx.widget.ts 并在此登记即可。
export const widgetModules: ContentWidgetModule[] = [
  alert,
  tip,
  quote,
  note,
  result,
  tab,
  folding,
  split,
  stepper,
  timeline,
  cardList,
  compare,
  copy,
  commandGroup,
  key,
  chat,
  pic,
  pdf,
  bilibili,
  progress,
  status,
  badge,
  button,
  taskList,
  emojiClock,
  blur,
  annotation,
  readingTime,
]
