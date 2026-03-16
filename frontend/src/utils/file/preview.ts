/**
 * 文件预览工具
 */

/**
 * 在新标签页中预览文件
 * @param file 文件对象
 */
export const previewFileInNewTab = (file: File): void => {
  try {
    // 创建文件的URL
    const fileURL = URL.createObjectURL(file);
    
    // 在新标签页打开
    const newWindow = window.open(fileURL, '_blank');
    
    if (!newWindow) {
      console.error('无法打开新窗口，可能被浏览器拦截');
      // 如果被拦截，可以尝试下载
      downloadFile(file);
    } else {
      // 当窗口关闭时释放URL
      newWindow.addEventListener('unload', () => {
        URL.revokeObjectURL(fileURL);
      });
    }
  } catch (error) {
    console.error('预览文件失败:', error);
  }
};

/**
 * 下载文件
 * @param file 文件对象
 */
export const downloadFile = (file: File): void => {
  try {
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 释放URL
    setTimeout(() => {
      URL.revokeObjectURL(fileURL);
    }, 100);
  } catch (error) {
    console.error('下载文件失败:', error);
  }
};

/**
 * 判断文件是否可以在浏览器中直接预览
 * @param file 文件对象
 * @returns 是否可预览
 */
export const isPreviewable = (file: File): boolean => {
  const previewableTypes = [
    // 图片
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/bmp',
    'image/svg+xml',
    'image/webp',
    // 文本
    'text/plain',
    'text/html',
    'text/css',
    'text/javascript',
    'text/csv',
    // PDF
    'application/pdf',
    // 视频
    'video/mp4',
    'video/webm',
    'video/ogg',
    // 音频
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/webm',
  ];
  
  return previewableTypes.includes(file.type);
};

/**
 * 根据文件类型获取预览策略
 * @param file 文件对象
 * @returns 预览策略：'inline'（内嵌）或 'download'（下载）
 */
export const getPreviewStrategy = (file: File): 'inline' | 'download' => {
  if (isPreviewable(file)) {
    return 'inline';
  }
  return 'download';
};

/**
 * 格式化文件大小为可读格式
 * @param bytes 字节数
 * @returns 格式化后的文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
