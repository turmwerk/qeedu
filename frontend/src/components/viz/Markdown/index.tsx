import React from 'react';
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
	highlight: function (str, lang) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return '<pre class="hljs"><code>' + hljs.highlight(str, { language: lang }).value + '</code></pre>';
			} catch (__) {}
		}
		return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
	}
}).use(mk as any);

export const Markdown: React.FC<{ value?: string }> = ({ value = '' }) => {
	let html = value ? md.render(value) : '';
	// 用正则为所有.katex外层加.katex-isolate类
	html = html.replace(/class="katex(?!-)/g, 'class="katex katex-isolate');
	return (
		<div className={styles.wrap}>
			{value ? (
				<div className={styles.content} dangerouslySetInnerHTML={{ __html: html }} />
			) : (
				<div className={styles.empty}>空的 Markdown</div>
			)}
		</div>
	);
};
