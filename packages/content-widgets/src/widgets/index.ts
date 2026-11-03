import * as alert from "./alert";
import * as annotation from "./annotation";
import * as badge from "./badge";
import * as bilibili from "./bilibili";
import * as blur from "./blur";
import * as button from "./button";
import * as cardList from "./card-list";
import * as chat from "./chat";
import * as commandGroup from "./command-group";
import * as compare from "./compare";
import * as copy from "./copy";
import * as emojiClock from "./emoji-clock";
import * as folding from "./folding";
import * as key from "./key";
import * as note from "./note";
import * as pdf from "./pdf";
import * as pic from "./pic";
import * as progress from "./progress";
import * as quote from "./quote";
import * as readingTime from "./reading-time";
import * as result from "./result";
import * as split from "./split";
import * as status from "./status";
import * as stepper from "./stepper";
import * as tab from "./tab";
import * as taskList from "./task-list";
import * as timeline from "./timeline";
import * as tip from "./tip";
import type { WidgetModule } from "./types";

// 顺序沿用历史挂载顺序，保证嵌套组件的捕获行为不变
export const widgets: WidgetModule[] = [
  alert,
  badge,
  button,
  tab,
  copy,
  folding,
  tip,
  blur,
  timeline,
  quote,
  chat,
  taskList,
  key,
  cardList,
  pdf,
  bilibili,
  pic,
  progress,
  emojiClock,
  status,
  annotation,
  commandGroup,
  result,
  readingTime,
  compare,
  split,
  stepper,
  note,
];
