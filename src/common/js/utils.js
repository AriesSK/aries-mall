// 获取本地存储
export const getLocal = (name) => {
  return localStorage.getItem(name)
}

// 设置本地存储
export const setLocal = (name, value) => {
  localStorage.setItem(name, value)
}