type StreamHandlers = {
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
};

export const createMockChatStream = (
  text: string,
  handlers: StreamHandlers,
): AbortController => {
  const controller = new AbortController();
  const chunks = text.split(/(?<=[,.!?，。！？\n])/).filter(Boolean);
  let index = 0;

  const tick = () => {
    if (controller.signal.aborted) return;
    if (index >= chunks.length) {
      handlers.onDone();
      return;
    }
    handlers.onDelta(chunks[index]);
    index += 1;
    window.setTimeout(tick, 30);
  };

  window.setTimeout(tick, 20);
  return controller;
};

export const buildMockAssistantReply = (
  botName: string,
  message: string,
  contextLabel?: string,
) => {
  const head = contextLabel ? `${botName}已读取${contextLabel}。` : `${botName}已读取当前上下文。`;
  return `${head}你刚刚的重点是：${message}。下一步我建议先完成当前页高优先动作，再根据右侧面板补齐材料、检查清单或生成草稿。`;
};
