import React, { useState } from 'react';
import MarkdownIt from 'markdown-it';
import mk from 'markdown-it-katex';
import hljs from 'highlight.js';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';
import styles from './style.module.scss';

const md = new MarkdownIt({
	html: false,
 	linkify: true,
 	typographer: true,
    highlight: function (str: string, lang: string) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' + hljs.highlight(str, { language: lang }).value + '</code></pre>';
            } catch (__) {}
        }
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
}).use(mk as any);

export const Markdown: React.FC<{
    value?: string;
    onChange?: (v: string) => void;
    onFullScreen?: () => void;
    showControls?: boolean;
}> = ({ value = '', onChange, onFullScreen, showControls = true }) => {
        const [showRaw, setShowRaw] = useState(false);
        let html = value ? md.render(value) : '';
        // 用正则为所有.katex外层加.katex-isolate类
        html = html.replace(/class="katex(?!-)/g, 'class="katex katex-isolate');

        return (
                <div className={styles.wrap}>
                        {showControls && (
                            <div className={styles.controls}>
                                    <button
                                        className={styles.toggleBtn}
                                        onClick={() => setShowRaw(v => !v)}
                                        aria-pressed={showRaw}
                                    >
                                        {showRaw ? '渲染 Markdown' : '显示 Markdown'}
                                    </button>
                                    {onFullScreen && (
                                        <button className={styles.fullBtn} onClick={onFullScreen}>全屏编辑</button>
                                    )}
                            </div>
                        )}

                        <div className={`${styles.container} ${showRaw ? styles.containerRaw : styles.containerRender}`}>
                            {showRaw ? (
                                onChange ? (
                                    <textarea className={styles.editor} value={value} onChange={(e) => onChange(e.target.value)} />
                                ) : (
                                    <pre className={styles.editor}>
                                        {value}
                                    </pre>
                                )
                            ) : (
                                (value) ? (
                                    <div className={styles.content} dangerouslySetInnerHTML={{ __html: html }} />
                                ) : (
                                    <div className={styles.empty}>空的 Markdown</div>
                                )
                            )}
                        </div>
                </div>
        );
};

export default Markdown;
