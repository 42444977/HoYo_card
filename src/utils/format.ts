/**
 * 數值格式化工具函數
 */

/**
 * 格式化概率百分比顯示
 * - 若概率 >= 1%，顯示一位小數（例：45.3%）
 * - 若概率 < 1% 且 > 0，找到第一個非零小數位，顯示到該位後兩位
 *   避免直接顯示 0.0% 這種誤導性結果
 *   例如：0.0082% → "0.0082%"，0.00050% → "0.00050%"
 * - 若概率為 0，顯示 "0%"
 * @param probability 概率值（0~1 範圍）
 * @returns 格式化後的百分比字串
 */
export function formatProbability(probability: number): string {
    const pct = probability * 100;

    if (pct >= 1) {
        return `${pct.toFixed(1)}%`;
    }

    // NOTE: probability 精確等於 0 表示模擬 100,000 次中沒有任何一次成功
    // 真實概率低於最小可偵測值 1/100,000 = 0.001%，無法精確表示
    // 顯示上限提示而非誤導性的 "0%"
    if (probability === 0) {
        return '< 0.001%';
    }

    // NOTE: 找到第一個非零位的小數位數
    // 例如 pct = 0.082 → log10(0.082) ≈ -1.086 → ceil(1.086) = 2 → 需要 2+2=4 位小數
    // 例如 pct = 0.005 → log10(0.005) ≈ -2.301 → ceil(2.301) = 3 → 需要 3+2=5 位小數
    const firstNonZeroPos = Math.ceil(-Math.log10(pct));
    const decimalPlaces = Math.min(firstNonZeroPos + 2, 10);

    // toFixed 後移除末尾不必要的零（只保留到非零位後兩位）
    const raw = pct.toFixed(decimalPlaces);
    // 找到非零位然後保留後兩位：例如 "0.00500" → "0.005"（非零位是第3位，後兩位為第4、5位→ "0.00500"）
    // 使用正則移除末尾多餘的零
    const trimmed = raw.replace(/(\.\d*?[1-9])0+$/, '$1');

    return `${trimmed}%`;
}
