// src/utils/helpers.js
/**
 * 格式化时间
 * @param {Date|string} date - 日期对象或日期字符串
 * @returns {string} 格式化后的时间字符串 (HH:mm)
 */
export function formatTime(date) {
  if (!date) return ''
  
  const d = new Date(date)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/**
 * 格式化日期
 * @param {Date|string} date - 日期对象或日期字符串
 * @returns {string} 格式化后的日期字符串 (YYYY-MM-DD)
 */
export function formatDate(date) {
  if (!date) return ''
  
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

/**
 * 格式化日期时间
 * @param {Date|string} date - 日期对象或日期字符串
 * @returns {string} 格式化后的日期时间字符串 (YYYY-MM-DD HH:mm)
 */
export function formatDateTime(date) {
  if (!date) return ''
  
  const d = new Date(date)
  return `${formatDate(d)} ${formatTime(d)}`
}