/**
 * 文件上传工具函数
 */

// 导出文件大小格式化函数
export { formatFileSize } from './preview';

/**
 * 处理文件选择
 * @param existingFiles 已存在的文件列表
 * @param newFiles 新选择的文件列表
 * @returns 合并后的文件列表
 */
export const handleFileSelection = (
  existingFiles: File[],
  newFiles: FileList | null
): File[] => {
  if (!newFiles) return existingFiles;
  return [...existingFiles, ...Array.from(newFiles)];
};

/**
 * 移除指定索引的文件
 * @param files 文件列表
 * @param index 要移除的文件索引
 * @returns 移除后的文件列表
 */
export const removeFileAtIndex = (files: File[], index: number): File[] => {
  return files.filter((_, i) => i !== index);
};

/**
 * 验证文件类型
 * @param file 文件对象
 * @param allowedTypes 允许的文件类型数组
 * @returns 是否为允许的类型
 */
export const validateFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.some((type) => {
    if (type.endsWith("/*")) {
      const prefix = type.slice(0, -2);
      return file.type.startsWith(prefix);
    }
    return file.type === type;
  });
};

/**
 * 验证文件大小
 * @param file 文件对象
 * @param maxSizeInMB 最大文件大小（MB）
 * @returns 是否在允许的大小范围内
 */
export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};
