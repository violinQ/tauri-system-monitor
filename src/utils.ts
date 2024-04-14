import { filesize } from 'filesize';

/**
 * 格式化 byte 数据
 * @param bytes - 字节数值
 * @param opt - 配置项
 * @param opt.spacer - 分隔符
 * @param opt.round - 保留小数位数
 * @param opt.symbols - 单位符号配置对象 例如: GB: 'G'
 */
export function formatByte(
  bytes: number,
  opt: { spacer?: string; round?: number; symbols?: Record<string, string> },
): string {
  const { spacer = '', round = 2, symbols = {} } = opt;
  return filesize(bytes, {
    spacer,
    round,
    symbols,
    standard: 'jedec',
    roundingMethod: 'floor',
  });
}
