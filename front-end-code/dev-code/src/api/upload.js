import request from '@/utils/request';

/**
 * 上传文件到OSS
 * @param {FormData} data - 包含文件的FormData对象
 * @returns {Promise<string>} 返回OSS图片URL
 */
export const uploadFile = (data) => {
  return request.post('/upload', data);
};