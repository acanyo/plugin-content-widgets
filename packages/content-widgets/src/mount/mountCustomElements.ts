import Alert from "../components/Alert.svelte";
import ActionButton from "../components/ActionButton.svelte";
import Admonition from "../components/Admonition.svelte";
import Annotation from "../components/Annotation.svelte";
import Badge from "../components/Badge.svelte";
import Blur from "../components/Blur.svelte";
import Button from "../components/Button.svelte";
import CardList from "../components/CardList.svelte";
import Chat from "../components/Chat.svelte";
import CommandGroup from "../components/CommandGroup.svelte";
import Compare from "../components/Compare.svelte";
import Copy from "../components/Copy.svelte";
import EmojiClock from "../components/EmojiClock.svelte";
import Folding from "../components/Folding.svelte";
import Key from "../components/Key.svelte";
import LinkCard from "../components/LinkCard.svelte";
import Note from "../components/Note.svelte";
import Pdf from "../components/Pdf.svelte";
import Pic from "../components/Pic.svelte";
import Progress from "../components/Progress.svelte";
import Quote from "../components/Quote.svelte";
import ReadingTime from "../components/ReadingTime.svelte";
import Result from "../components/Result.svelte";
import Split from "../components/Split.svelte";
import Status from "../components/Status.svelte";
import Stepper from "../components/Stepper.svelte";
import Tab from "../components/Tab.svelte";
import TaskList from "../components/TaskList.svelte";
import Timeline from "../components/Timeline.svelte";
import Tip from "../components/Tip.svelte";
import { innerHtml, splitCsv, textContent } from "./html";
import { mountComponent } from "./mountSvelte";
import { asBoolean, asNumber, asString, parseProps } from "./parseProps";

export function mountCustomElements(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("xhhao-com-alert").forEach((element) => {
    mountComponent(element, Alert, { ...parseProps(element), content: innerHtml(element) });
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-badge").forEach((element) => {
    mountComponent(element, Badge, { ...parseProps(element), content: innerHtml(element) }, true);
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-button").forEach((element) => {
    mountComponent(element, Button, { ...parseProps(element), content: innerHtml(element) }, true);
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-action-button").forEach((element) => {
    mountComponent(
      element,
      ActionButton,
      { ...parseProps(element), content: innerHtml(element) },
      true,
    );
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-admonition").forEach((element) => {
    mountComponent(element, Admonition, { ...parseProps(element), content: innerHtml(element) });
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-link-card").forEach((element) => {
    mountComponent(element, LinkCard, parseProps(element));
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-tab").forEach((element) => {
    const props = parseProps(element);
    const tabs = splitCsv(props.tabs);
    const panels = Array.from(element.querySelectorAll("xhhao-com-tab-panel")).map((panel) => ({
      content: innerHtml(panel),
    }));
    mountComponent(element, Tab, {
      tabs,
      panels,
      center: asBoolean(props.center),
      active: asNumber(props.active, 1),
    });
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-copy").forEach((element) => {
    const props = parseProps(element);
    mountComponent(element, Copy, {
      code: props.code ? asString(props.code) : textContent(element),
      prompt: typeof props.prompt === "boolean" ? props.prompt : asString(props.prompt, "$"),
    });
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-folding").forEach((element) => {
    mountComponent(element, Folding, { ...parseProps(element), content: innerHtml(element) });
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-tip").forEach((element) => {
    mountComponent(element, Tip, { ...parseProps(element), content: innerHtml(element) }, true);
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-blur").forEach((element) => {
    mountComponent(element, Blur, { content: innerHtml(element) }, true);
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-timeline").forEach((element) => {
    const items = Array.from(element.querySelectorAll("xhhao-com-timeline-item")).map((item) => ({
      time: item.getAttribute("time") || "",
      content: innerHtml(item),
    }));
    mountComponent(element, Timeline, { items });
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-quote").forEach((element) => {
    mountComponent(element, Quote, { ...parseProps(element), content: innerHtml(element) });
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-chat").forEach((element) => {
    const items = Array.from(element.querySelectorAll("xhhao-com-chat-item")).map((item) => ({
      name: item.getAttribute("name") || "",
      avatar: item.getAttribute("avatar") || undefined,
      badge: item.getAttribute("badge") || undefined,
      content: innerHtml(item),
      self: item.hasAttribute("self"),
      system: item.hasAttribute("system"),
    }));
    mountComponent(element, Chat, { items });
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-task-list").forEach((element) => {
    const items = Array.from(element.querySelectorAll("xhhao-com-task")).map((item) => ({
      checked: item.hasAttribute("checked"),
      content: innerHtml(item),
    }));
    mountComponent(element, TaskList, { items });
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-key").forEach((element) => {
    mountComponent(element, Key, parseProps(element), true);
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-card-list").forEach((element) => {
    mountComponent(element, CardList, { content: innerHtml(element) });
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-pdf").forEach((element) => {
    mountComponent(element, Pdf, parseProps(element));
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-pic").forEach((element) => {
    mountComponent(element, Pic, parseProps(element));
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-progress").forEach((element) => {
    const props = parseProps(element);
    mountComponent(element, Progress, {
      value: asNumber(props.value),
      max: asNumber(props.max, 100),
      color: asString(props.color, undefined),
      label: asString(props.label, undefined),
      showPercent: props.showPercent !== false,
    });
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-emoji-clock").forEach((element) => {
    mountComponent(element, EmojiClock, {}, true);
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-status").forEach((element) => {
    const props = parseProps(element);
    mountComponent(
      element,
      Status,
      {
        ...props,
        value: props.value ? asString(props.value) : textContent(element),
      },
      true,
    );
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-annotation").forEach((element) => {
    mountComponent(element, Annotation, { ...parseProps(element), content: innerHtml(element) }, true);
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-command-group").forEach((element) => {
    const props = parseProps(element);
    const commands = Array.from(element.querySelectorAll("xhhao-com-command")).map((item) => ({
      prompt: item.getAttribute("prompt") || "$",
      content: textContent(item).trim(),
    }));
    mountComponent(element, CommandGroup, { title: asString(props.title, ""), commands });
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-result").forEach((element) => {
    mountComponent(element, Result, { ...parseProps(element), content: innerHtml(element) });
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-reading-time").forEach((element) => {
    const props = parseProps(element);
    mountComponent(element, ReadingTime, {
      ...props,
      minutes: props.minutes ? asNumber(props.minutes) : undefined,
      words: props.words ? asNumber(props.words) : undefined,
      content: innerHtml(element),
    }, true);
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-compare").forEach((element) => {
    const props = parseProps(element);
    const children = Array.from(element.children);
    mountComponent(element, Compare, {
      leftTitle: asString(props.leftTitle, "之前"),
      rightTitle: asString(props.rightTitle, "之后"),
      left: props.left ? asString(props.left) : children[0] ? innerHtml(children[0]) : "",
      right: props.right ? asString(props.right) : children[1] ? innerHtml(children[1]) : "",
    });
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-split").forEach((element) => {
    const props = parseProps(element);
    const items = Array.from(element.children).map((child) => innerHtml(child));
    mountComponent(element, Split, {
      cols: typeof props.cols === "boolean" ? undefined : props.cols,
      gap: typeof props.gap === "string" ? props.gap : undefined,
      items,
    });
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-stepper").forEach((element) => {
    const items = Array.from(element.querySelectorAll("xhhao-com-step")).map((item) => ({
      title: item.getAttribute("title") || "",
      content: innerHtml(item),
    }));
    mountComponent(element, Stepper, { items });
  });

  root.querySelectorAll<HTMLElement>("xhhao-com-note").forEach((element) => {
    mountComponent(element, Note, { ...parseProps(element), content: innerHtml(element) });
  });
}
