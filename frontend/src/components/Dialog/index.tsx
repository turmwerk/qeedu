
import React, { useEffect, useRef, useState } from 'react';
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
  const [pending, setPending] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  // 持久化消息
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages, STORAGE_KEY]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    body.scrollTop = body.scrollHeight;
  }, [messages, pending]);

  const send = () => {
    if (!input.trim() || pending) return;
    const text = input;
    setMessages(m => [...m, { from: 'user', text }]);
    setInput('');
    setPending(true);
    const reply = `已收到：${text}`;
    setTimeout(() => {
      setMessages(m => [...m, { from: 'bot', text: reply }]);
      setPending(false);
    }, 600);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>{botName}</div>
      <div ref={bodyRef} className={styles.body}>
        {messages.map((m, i) => (
          <div key={i} className={m.from === 'user' ? styles.msgUser : styles.msgBot}>{m.text}</div>
        ))}
        {pending && (
          <div className={styles.msgPending}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        )}
      </div>
      <div className={styles.footer}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={pending ? '对方输入中...' : '输入消息，回车发送'}
          onKeyDown={e => { if (e.key === 'Enter') send(); }}
          disabled={pending}
        />
        <button onClick={send} disabled={pending}>发送</button>
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
