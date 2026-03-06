import MarkdownIt from 'markdown-it';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

function downloadBlob(content: BlobPart, mime: string, filename: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function downloadMarkdown(filename: string, markdown: string) {
  const name = filename.endsWith('.md') ? filename : `${filename}.md`;
  downloadBlob(markdown, 'text/markdown;charset=utf-8', name);
}

export async function downloadDocx(filename: string, markdown: string) {
  const name = filename.endsWith('.docx') ? filename : `${filename}.docx`;

  // 简单的转换：把 Markdown 渲染为纯文本段落（可根据需要扩展为更复杂的样式）
  const html = md.render(markdown || '');

  // 解析 HTML 并将主要节点映射为 docx 段落与样式（支持 h1-h6, p, ul/ol, li, strong/em, code, pre）
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const paragraphs: Paragraph[] = [];

  const makeRunsFromNode = (node: ChildNode): TextRun[] => {
    const runs: TextRun[] = [];
    if (node.nodeType === Node.TEXT_NODE) {
      const txt = (node.textContent || '');
      if (txt.trim() !== '') runs.push(new TextRun(txt));
      return runs;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tag = el.tagName.toLowerCase();

      if (tag === 'strong' || tag === 'b') {
        const txt = el.textContent || '';
        if (txt.trim() !== '') runs.push(new TextRun({ text: txt, bold: true }));
        return runs;
      }
      if (tag === 'em' || tag === 'i') {
        const txt = el.textContent || '';
        if (txt.trim() !== '') runs.push(new TextRun({ text: txt, italics: true } as any));
        return runs;
      }
      if (tag === 'code' && el.parentElement && el.parentElement.tagName.toLowerCase() !== 'pre') {
        // inline code
        const txt = el.textContent || '';
        runs.push(new TextRun({ text: txt, font: 'Courier New', shading: { type: 'clear', color: 'auto', fill: 'f5f5f5' } } as any));
        return runs;
      }
      if (tag === 'br') {
        runs.push(new TextRun('\n'));
        return runs;
      }

      // default: recurse children
      el.childNodes.forEach((c) => {
        makeRunsFromNode(c).forEach(r => runs.push(r));
      });
      return runs;
    }
    return runs;
  };

  const processBlock = (node: ChildNode) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as Element;
    const tag = el.tagName.toLowerCase();

    if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6') {
      const levelMap = {
        h1: HeadingLevel.HEADING_1,
        h2: HeadingLevel.HEADING_2,
        h3: HeadingLevel.HEADING_3,
        h4: HeadingLevel.HEADING_4,
        h5: HeadingLevel.HEADING_5,
        h6: HeadingLevel.HEADING_6,
      } as const;
      const level = (levelMap as Record<string, any>)[tag] || HeadingLevel.HEADING_1;
      // 为避免 Word 模板对 Heading 使用蓝色样式，显式设置 TextRun 颜色为黑色。
      const text = (el.textContent || '').trim();
      const run = new TextRun({ text, bold: true, color: '000000' });
      paragraphs.push(new Paragraph({ heading: level, children: [run] }));
      return;
    }

    if (tag === 'p' || tag === 'div') {
      const runs = makeRunsFromNode(el);
      paragraphs.push(new Paragraph({ children: runs }));
      return;
    }

    if (tag === 'pre') {
      // code block
      const codeEl = el.querySelector('code');
      const codeText = codeEl ? codeEl.textContent || '' : el.textContent || '';
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: codeText, font: 'Courier New' })] }));
      return;
    }

    if (tag === 'ul' || tag === 'ol') {
      const isOrdered = tag === 'ol';
      const items = Array.from(el.children).filter(c => c.tagName.toLowerCase() === 'li');
      items.forEach((li, idx) => {
        // li may contain elements; flatten into runs
        const runs = makeRunsFromNode(li);
        if (isOrdered) {
          // simple numbered prefix using index
          const prefix = `${idx + 1}. `;
          const first = runs.shift();
          const prefRun = new TextRun(prefix);
          const children = first ? [prefRun, first, ...runs] : [prefRun, ...runs];
          paragraphs.push(new Paragraph({ children }));
        } else {
          paragraphs.push(new Paragraph({ children: runs, bullet: { level: 0 } }));
        }
      });
      return;
    }

    // fallback: recurse into children
    el.childNodes.forEach(c => processBlock(c));
  };

  tmp.childNodes.forEach((n) => processBlock(n));

  const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', name);
}

export async function downloadPdf(filename: string, markdown: string) {
  const name = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  const html = md.render(markdown || '');

  // 创建离屏容器
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.padding = '24px';
  container.style.background = '#fff';
  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // image natural size in px * (72 / 96) gives points; we scale to fit page width
    const imgProps = { width: canvas.width, height: canvas.height };
    const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
    const imgWidth = imgProps.width * ratio;
    const imgHeight = imgProps.height * ratio;

    // If content fits one page
    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    } else {
      // 多页处理：按页高切分图片
      let position = 0;
      let remainingHeight = imgProps.height;
      const pxPerPt = imgProps.width / pageWidth;
      while (remainingHeight > 0) {
        const canvasPage = document.createElement('canvas');
        canvasPage.width = canvas.width;
        canvasPage.height = Math.min(canvas.height - position, Math.round(pageHeight * pxPerPt));
        const ctx = canvasPage.getContext('2d')!;
        ctx.drawImage(canvas, 0, position, canvas.width, canvasPage.height, 0, 0, canvasPage.width, canvasPage.height);
        const pageImg = canvasPage.toDataURL('image/jpeg', 0.95);
        if (position > 0) pdf.addPage();
        pdf.addImage(pageImg, 'JPEG', 0, 0, pageWidth, Math.min(pageHeight, (canvasPage.height / pxPerPt)));
        position += canvasPage.height;
        remainingHeight -= canvasPage.height;
      }
    }

    pdf.save(name);
  } finally {
    container.remove();
  }
}

export async function exportPdfViaPrint(filename: string, markdown: string) {
  return downloadPdf(filename, markdown);
}

export default { downloadMarkdown, downloadDocx, downloadPdf, exportPdfViaPrint };
