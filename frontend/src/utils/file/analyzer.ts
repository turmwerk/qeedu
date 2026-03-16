/**
 * 文件类型分析工具
 */

export type FileIconType = 
  | 'document'
  | 'image'
  | 'video'
  | 'audio'
  | 'archive'
  | 'code'
  | 'pdf'
  | 'excel'
  | 'word'
  | 'powerpoint'
  | 'text'
  | 'unknown';

/**
 * 根据文件扩展名获取文件类型
 * @param fileName 文件名
 * @returns 文件图标类型
 */
export const getFileIconType = (fileName: string): FileIconType => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  
  // 图片文件
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'].includes(ext)) {
    return 'image';
  }
  
  // 视频文件
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'].includes(ext)) {
    return 'video';
  }
  
  // 音频文件
  if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'].includes(ext)) {
    return 'audio';
  }
  
  // PDF文件
  if (ext === 'pdf') {
    return 'pdf';
  }
  
  // Word文档
  if (['doc', 'docx'].includes(ext)) {
    return 'word';
  }
  
  // Excel表格
  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return 'excel';
  }
  
  // PowerPoint演示
  if (['ppt', 'pptx'].includes(ext)) {
    return 'powerpoint';
  }
  
  // 压缩文件
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext)) {
    return 'archive';
  }
  
  // 代码文件
  if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'c', 'cpp', 'h', 'hpp', 'cs', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 'html', 'css', 'scss', 'sass', 'less', 'json', 'xml', 'yaml', 'yml', 'sql', 'sh', 'bat', 'cmd'].includes(ext)) {
    return 'code';
  }
  
  // 文本文件
  if (['txt', 'md', 'markdown', 'log', 'cfg', 'conf', 'ini'].includes(ext)) {
    return 'text';
  }
  
  return 'unknown';
};

/**
 * 获取文件类型的SVG图标路径
 * @param iconType 文件图标类型
 * @returns SVG路径字符串
 */
export const getFileIconSvgPath = (iconType: FileIconType): string => {
  const paths: Record<FileIconType, string> = {
    document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    image: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    video: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    audio: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
    archive: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
    code: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    pdf: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    excel: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    word: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    powerpoint: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
    text: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    unknown: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  };
  
  return paths[iconType];
};

/**
 * 获取文件类型的颜色
 * @param iconType 文件图标类型
 * @returns Tailwind颜色类名
 */
export const getFileIconColor = (iconType: FileIconType): string => {
  const colors: Record<FileIconType, string> = {
    document: 'text-blue-500',
    image: 'text-green-500',
    video: 'text-purple-500',
    audio: 'text-pink-500',
    archive: 'text-yellow-600',
    code: 'text-cyan-500',
    pdf: 'text-red-500',
    excel: 'text-green-600',
    word: 'text-blue-600',
    powerpoint: 'text-orange-500',
    text: 'text-gray-500',
    unknown: 'text-gray-400',
  };
  
  return colors[iconType];
};
