import {
    BannerConfig,
    GameConfig,
    GachaTarget,
    CurrentProgress,
    SimulationResult,
    DistributionPoint,
} from '../types/gacha';

/** 模擬次數：次數越高結果越精確，但計算時間越長 */
const SIMULATION_COUNT = 100_000;

/**
 * 計算指定抽數的五星掉落概率
 * 根據軟保底線性遞增模型
 * @param pity 目前已墊的抽數（從 0 開始）
 * @param config 卡池配置
 * @returns 該抽的五星掉落概率
 */
function getFiveStarRate(pity: number, config: BannerConfig): number {
    const pullNumber = pity + 1;
    if (pullNumber >= config.hardPity) return 1.0;
    if (pullNumber < config.softPityStart) return config.baseFiveStarRate;

    // NOTE: 軟保底線性遞增模型 — 從社群大量統計中推導
    const rate =
        config.baseFiveStarRate +
        (pullNumber - config.softPityStart + 1) * config.softPityIncrement;
    return Math.min(rate, 1.0);
}

/**
 * 模擬在某個卡池中抽出一個 UP 五星所需的抽數
 * @param config 卡池配置
 * @param startPity 起始墊抽數
 * @param isGuaranteed 是否已有大保底
 * @returns [消耗抽數, 結束時的墊抽數, 結束時是否大保底]
 */
function simulateOneUp(
    config: BannerConfig,
    startPity: number,
    isGuaranteed: boolean
): [number, number, boolean] {
    let pity = startPity;
    let guaranteed = isGuaranteed;
    let totalPulls = 0;
    let losses = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        totalPulls++;
        const rate = getFiveStarRate(pity, config);

        if (Math.random() < rate) {
            // 出五星了，判斷是否為 UP
            if (guaranteed) {
                // 大保底，必定出 UP
                return [totalPulls, 0, false];
            }

            if (Math.random() < config.upRateOnFiveStar) {
                // 小保底，命中 UP
                return [totalPulls, 0, false];
            }

            // 歪了
            losses++;
            pity = 0;

            if (losses >= config.lossesToGuarantee) {
                // 累積足夠的命定值/歪的次數，下次大保底
                guaranteed = true;
                losses = 0;
            }
        } else {
            pity++;
        }
    }
}

/**
 * 模擬完成整個目標（X+Y）所需的總抽數
 * @param gameConfig 遊戲配置
 * @param target 玩家目標
 * @param progress 玩家目前進度
 * @returns 本次模擬所需的總抽數
 */
function simulateFullTarget(
    gameConfig: GameConfig,
    target: GachaTarget,
    progress: CurrentProgress
): number {
    let totalPulls = 0;

    // 角色池：需要抽 (constellation + 1) 個 UP 角色
    const characterCount = target.constellation + 1;
    let charPity = progress.characterPity;
    let charGuaranteed = progress.characterGuaranteed;

    for (let i = 0; i < characterCount; i++) {
        const [pulls, endPity, endGuaranteed] = simulateOneUp(
            gameConfig.characterBanner,
            charPity,
            charGuaranteed
        );
        totalPulls += pulls;
        charPity = endPity;
        charGuaranteed = endGuaranteed;
    }

    // 武器池：需要抽 weapon 個 UP 武器
    let weaponPity = progress.weaponPity;
    let weaponGuaranteed = progress.weaponGuaranteed;

    for (let i = 0; i < target.weapon; i++) {
        const [pulls, endPity, endGuaranteed] = simulateOneUp(
            gameConfig.weaponBanner,
            weaponPity,
            weaponGuaranteed
        );
        totalPulls += pulls;
        weaponPity = endPity;
        weaponGuaranteed = endGuaranteed;
    }

    return totalPulls;
}

/**
 * 執行蒙地卡羅模擬，計算目標的期望抽數與概率分佈
 * @param gameConfig 遊戲配置
 * @param target 玩家目標
 * @param progress 玩家目前進度
 * @returns 模擬結果
 */
export function runSimulation(
    gameConfig: GameConfig,
    target: GachaTarget,
    progress: CurrentProgress
): SimulationResult {
    // 如果目標為 0+0 且角色數也為 0，直接返回空結果
    if (target.constellation + 1 === 0 && target.weapon === 0) {
        return {
            expectedPulls: 0,
            medianPulls: 0,
            bestCase: 0,
            worstCase: 0,
            distribution: [],
        };
    }

    const results: number[] = new Array(SIMULATION_COUNT);
    let sum = 0;

    for (let i = 0; i < SIMULATION_COUNT; i++) {
        const pulls = simulateFullTarget(gameConfig, target, progress);
        results[i] = pulls;
        sum += pulls;
    }

    // 排序以計算百分位數
    results.sort((a, b) => a - b);

    const expectedPulls = Math.round(sum / SIMULATION_COUNT);
    const medianPulls = results[Math.floor(SIMULATION_COUNT * 0.5)];
    const bestCase = results[Math.floor(SIMULATION_COUNT * 0.01)];
    const worstCase = results[Math.floor(SIMULATION_COUNT * 0.99)];

    // 建立概率分佈（每 5 抽一個資料點）
    const maxPulls = results[results.length - 1];
    const distribution: DistributionPoint[] = [];
    const step = Math.max(1, Math.floor(maxPulls / 200));

    for (let p = 0; p <= maxPulls; p += step) {
        // 計算在 p 抽以內達成目標的累積概率
        const countBelow = results.filter((r) => r <= p).length;
        distribution.push({
            pulls: p,
            probability: countBelow / SIMULATION_COUNT,
        });
    }

    // 確保最後一個點為 100%
    if (distribution.length > 0 && distribution[distribution.length - 1].probability < 1) {
        distribution.push({
            pulls: maxPulls,
            probability: 1,
        });
    }

    return {
        expectedPulls,
        medianPulls,
        bestCase,
        worstCase,
        distribution,
    };
}

/**
 * 計算在給定抽數內達成目標的概率
 * @param gameConfig 遊戲配置
 * @param target 玩家目標
 * @param progress 玩家目前進度
 * @param availablePulls 可用抽數
 * @returns 達成概率 (0~1)
 */
export function calculateProbability(
    gameConfig: GameConfig,
    target: GachaTarget,
    progress: CurrentProgress,
    availablePulls: number
): number {
    if (availablePulls <= 0) return 0;

    let successCount = 0;

    for (let i = 0; i < SIMULATION_COUNT; i++) {
        const pulls = simulateFullTarget(gameConfig, target, progress);
        if (pulls <= availablePulls) {
            successCount++;
        }
    }

    return successCount / SIMULATION_COUNT;
}
