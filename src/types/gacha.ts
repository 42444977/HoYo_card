/**
 * 抽卡計算器核心型別定義
 * 適用於原神、星穹鐵道、絕區零三款遊戲
 */

/** 支援的遊戲列舉 */
export type GameType = 'genshin' | 'starRail' | 'zzz';

/** 單一卡池的配置參數 */
export interface BannerConfig {
    /** 基礎五星/S級掉落概率 */
    baseFiveStarRate: number;
    /** 軟保底起始抽數 */
    softPityStart: number;
    /** 硬保底抽數 */
    hardPity: number;
    /** 軟保底每抽概率遞增量 */
    softPityIncrement: number;
    /** 出金時命中 UP 的概率（小保底概率） */
    upRateOnFiveStar: number;
    /** 歪了幾次後觸發大保底（角色池=1，原神武器池命定值=1） */
    lossesToGuarantee: number;
}

/** 一款遊戲的完整配置 */
export interface GameConfig {
    /** 遊戲識別碼 */
    id: GameType;
    /** 遊戲名稱 */
    name: string;
    /** 角色/代理人池配置 */
    characterBanner: BannerConfig;
    /** 武器/光錐/音擎池配置 */
    weaponBanner: BannerConfig;
    /** 角色池術語（如「命座」「星魂」「影院等級」） */
    characterTerm: string;
    /** 武器池術語（如「武器」「光錐」「音擎」） */
    weaponTerm: string;
    /** 貨幣名稱（如「原石」「星瓊」「菲林」） */
    currencyName: string;
    /** 抽卡道具名稱（如「糾纏之緣」「星軌通票」「加密母帶」） */
    pullItemName: string;
    /** 每抽需要的貨幣數量 */
    currencyPerPull: number;
    /** 遊戲橫幅圖片路徑 */
    bannerImage: string;
    /** CSS 主題類名 */
    themeClass: string;
}

/** 玩家目標（X+Y 表記法） */
export interface GachaTarget {
    /** 命座/星魂/影院等級（0~6） */
    constellation: number;
    /** 武器/光錐/音擎數量（0~5） */
    weapon: number;
}

/** 玩家目前的抽卡進度 */
export interface CurrentProgress {
    /** 角色池已墊抽數（距離上次五星的抽數） */
    characterPity: number;
    /** 角色池是否已有大保底 */
    characterGuaranteed: boolean;
    /** 武器池已墊抽數 */
    weaponPity: number;
    /** 武器池是否已有大保底（命定值 >= 1）*/
    weaponGuaranteed: boolean;
}

/** 模擬計算結果 */
export interface SimulationResult {
    /** 期望（平均）抽數 */
    expectedPulls: number;
    /** 中位數抽數 */
    medianPulls: number;
    /** 最佳情況（第 1 百分位） */
    bestCase: number;
    /** 最差情況（第 99 百分位） */
    worstCase: number;
    /** 概率分佈（每個抽數對應的累積概率） */
    distribution: DistributionPoint[];
}

/** 概率分佈資料點 */
export interface DistributionPoint {
    /** 抽數 */
    pulls: number;
    /** 在此抽數內達成目標的累積概率（0~1） */
    probability: number;
}
