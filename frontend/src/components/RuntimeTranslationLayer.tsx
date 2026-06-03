import { useEffect } from "react";
import type { Language } from "@/context/LanguageContext";
import { hasRuntimeChinese, translateRuntimeText } from "@/locales/runtime";

const ATTRIBUTE_NAMES = ["aria-label", "title", "placeholder", "alt"] as const;
const TEXT_SKIP_SELECTOR = [
  "script",
  "style",
  "code",
  "pre",
  "kbd",
  "samp",
  "textarea",
  "input",
  "[contenteditable='true']",
  ".monaco-editor",
  ".cm-editor",
  ".xterm",
].join(",");

const ATTRIBUTE_SKIP_SELECTOR = [
  "script",
  "style",
  "code",
  "pre",
  "kbd",
  "samp",
  "[contenteditable='true']",
  ".monaco-editor",
  ".cm-editor",
  ".xterm",
].join(",");

const textOriginals = new WeakMap<Text, string>();
const attrOriginals = new WeakMap<Element, Map<string, string>>();
let internalMutationDepth = 0;

function commitInternalMutation(action: () => void) {
  internalMutationDepth += 1;
  try {
    action();
  } finally {
    queueMicrotask(() => {
      internalMutationDepth = Math.max(0, internalMutationDepth - 1);
    });
  }
}

function shouldSkipText(element: Element | null): boolean {
  return Boolean(element?.closest(TEXT_SKIP_SELECTOR));
}

function shouldSkipAttributes(element: Element | null): boolean {
  return Boolean(element?.closest(ATTRIBUTE_SKIP_SELECTOR));
}

function translateTextNode(node: Text, language: Language) {
  const parent = node.parentElement;
  if (!parent || shouldSkipText(parent)) return;

  const current = node.nodeValue ?? "";
  const saved = textOriginals.get(node);
  const expected = saved ? translateRuntimeText(saved, language) : "";
  let original = saved && (!hasRuntimeChinese(current) || current === expected) ? saved : current;
  if (!saved && !hasRuntimeChinese(original)) return;
  if (saved && hasRuntimeChinese(current) && current !== expected) {
    textOriginals.set(node, current);
    original = current;
  } else {
    textOriginals.set(node, original);
  }

  const next = translateRuntimeText(original, language);
  if (current !== next) {
    commitInternalMutation(() => {
      node.nodeValue = next;
    });
  }
}

function getAttrOriginal(element: Element, name: string, current: string, language: Language): string | null {
  let originals = attrOriginals.get(element);
  if (!originals) {
    originals = new Map();
    attrOriginals.set(element, originals);
  }

  const saved = originals.get(name);
  if (saved) {
    const expected = translateRuntimeText(saved, language);
    if (hasRuntimeChinese(current) && current !== expected) {
      originals.set(name, current);
      return current;
    }
    return saved;
  }
  if (!hasRuntimeChinese(current)) return null;

  originals.set(name, current);
  return current;
}

function translateElementAttributes(element: Element, language: Language) {
  if (shouldSkipAttributes(element)) return;

  ATTRIBUTE_NAMES.forEach((name) => {
    const current = element.getAttribute(name);
    if (!current) return;

    const original = getAttrOriginal(element, name, current, language);
    if (!original) return;

    const next = translateRuntimeText(original, language);
    if (current !== next) {
      commitInternalMutation(() => {
        element.setAttribute(name, next);
      });
    }
  });
}

function scanNode(root: Node, language: Language) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text, language);
    return;
  }

  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) {
    return;
  }

  const element = root.nodeType === Node.ELEMENT_NODE ? (root as Element) : null;
  if (element) {
    translateElementAttributes(element, language);
    if (shouldSkipText(element)) return;
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    translateTextNode(walker.currentNode as Text, language);
  }

  if (element) {
    element.querySelectorAll("*").forEach((child) => translateElementAttributes(child, language));
  } else if (root instanceof Document) {
    root.querySelectorAll("*").forEach((child) => translateElementAttributes(child, language));
  }
}

function scheduleScan(language: Language, root: Node = document.body, immediate = false) {
  const run = () => scanNode(root, language);
  const idle = (window as Window & {
    requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => void;
  }).requestIdleCallback;

  if (immediate) {
    run();
    return;
  }

  if (typeof idle === "function") {
    idle(run, { timeout: 180 });
    return;
  }

  requestAnimationFrame(run);
}

export function RuntimeTranslationLayer({ language }: { language: Language }) {
  useEffect(() => {
    if (typeof window === "undefined" || !document.body) return undefined;

    scheduleScan(language, document.body, true);

    let queued = false;
    const queueFullScan = () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(() => {
        queued = false;
        scheduleScan(language);
      });
    };

    const observer = new MutationObserver((mutations) => {
      if (internalMutationDepth > 0) return;

      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          const node = mutation.target as Text;
          const original = textOriginals.get(node);
          if (original || hasRuntimeChinese(node.nodeValue ?? "")) {
            queueFullScan();
            break;
          }
          continue;
        }

        if (mutation.type === "attributes") {
          const element = mutation.target as Element;
          if (!shouldSkipAttributes(element)) {
            translateElementAttributes(element, language);
          }
          continue;
        }

        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
            scheduleScan(language, node);
          }
        });
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: [...ATTRIBUTE_NAMES],
      characterData: true,
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [language]);

  return null;
}

export default RuntimeTranslationLayer;
