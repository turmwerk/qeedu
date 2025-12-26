import React, { useState } from 'react';
import styles from './style.module.scss';


const STORAGE_KEY = 'syllabus_dialog_messages';

const Dialog: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ from: 'user'|'bot'; text: string }>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      { from: 'bot', text: '欢迎使用大纲助手，你可以询问如何改进课程大纲。' }
    ];
  });
  const [input, setInput] = useState('');

  // 持久化消息
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { from: 'user', text: input }]);
    const reply = `已收到：${input}`;
    setTimeout(() => setMessages(m => [...m, { from: 'bot', text: reply }]), 600);
    setInput('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>对话助手</div>
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

export default Dialog;
