import axios from 'axios';

// 读取配置文件
async function getConfig() {
  const res = await fetch('/config.json');
  return res.json();
}

export async function getAxiosInstance() {
  const config = await getConfig();
  const instance = axios.create({
    baseURL: config.baseUrl,
    headers: {
      'xc-token': config.xcToken
    }
  });
  return { instance, config };
}
