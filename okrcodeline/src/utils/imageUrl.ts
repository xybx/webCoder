// vue文件调用此方法，build后将保留源码，若非必须使用动态导入图片，强烈不推荐使用此方法
export const getImageUrl = (name: string): string => new URL(`../${name}`, import.meta.url).href
