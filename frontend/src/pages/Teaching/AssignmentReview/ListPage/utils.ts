export const formatUpdatedAt = (value?: number) => {
  if (!value) return "刚刚更新";
  const diff = Date.now() - value;
  const minutes = Math.max(1, Math.floor(diff / (1000 * 60)));
  if (minutes < 60) return `${minutes} 分钟前更新`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前更新`;
  return `${Math.floor(hours / 24)} 天前更新`;
};
