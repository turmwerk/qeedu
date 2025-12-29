
import React, { useState } from 'react';
import styles from './style.module.scss';

interface DialogMessage {
  from: 'user' | 'bot';
  text: string;
}

interface DialogProps {
  dialogId: string; // 唯一标识（如大纲id）
  botName?: string; // 机器人名字
  initMessage?: string; // 初始消息
}

const getStorageKey = (dialogId: string) => `dialog_messages_${dialogId}`;

const Dialog: React.FC<DialogProps> & { clearDialog: (dialogId: string) => void } = ({ dialogId, botName = '对话助手', initMessage = '欢迎使用对话助手，你可以开始提问。' }) => {
  const STORAGE_KEY = getStorageKey(dialogId);
  const [messages, setMessages] = useState<DialogMessage[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      { from: 'bot', text: initMessage }
    ];
  });
  const [input, setInput] = useState('');

  // 持久化消息
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages, STORAGE_KEY]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { from: 'user', text: input }]);
    const reply = `已收到：${input}`;
    setTimeout(() => setMessages(m => [...m, { from: 'bot', text: reply }]), 600);
    setInput('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>{botName}</div>
      <div className={styles.body}>
        {messages.map((m, i) => (
          <div key={i} className={m.from === 'user' ? styles.msgUser : styles.msgBot}>{m.text}</div>
        ))}
      </div>
      <div className={styles.footer}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="输入消息，回车发送" onKeyDown={e => { if (e.key === 'Enter') send(); }} />
        <button onClick={send}>发送</button>
      </div>
    </div>
  );
};

Dialog.clearDialog = (dialogId: string) => {
  try {
    localStorage.removeItem(getStorageKey(dialogId));
  } catch {}
};

export default Dialog;
