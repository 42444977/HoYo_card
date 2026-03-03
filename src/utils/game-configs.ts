import { GameConfig, GameType } from '../types/gacha';

/**
 * 三款遊戲的抽卡參數設定
 * 數據來源：遊戲內公告 + 社群大規模統計
 */

const GENSHIN_CONFIG: GameConfig = {
    id: 'genshin',
    name: '原神',
    characterBanner: {
        baseFiveStarRate: 0.006,
        softPityStart: 74,
        hardPity: 90,
        softPityIncrement: 0.06,
        // NOTE: 捕獲明光機制使小保底出 UP 概率從 50% 提升至 55%
        upRateOnFiveStar: 0.55,
        lossesToGuarantee: 1,
    },
    weaponBanner: {
        baseFiveStarRate: 0.007,
        softPityStart: 63,
        hardPity: 80,
        softPityIncrement: 0.07,
        upRateOnFiveStar: 0.75,
        // NOTE: 6.0 版本後命定值上限從 2 降為 1
        lossesToGuarantee: 1,
    },
    characterTerm: '命座',
    weaponTerm: '武器',
    currencyName: '原石',
    pullItemName: '糾纏之緣',
    currencyPerPull: 160,
    bannerImage: './images/genshin.png',
    themeClass: 'theme-genshin',
};

const STAR_RAIL_CONFIG: GameConfig = {
    id: 'starRail',
    name: '星穹鐵道',
    characterBanner: {
        baseFiveStarRate: 0.006,
        softPityStart: 74,
        hardPity: 90,
        softPityIncrement: 0.06,
        upRateOnFiveStar: 0.5,
        lossesToGuarantee: 1,
    },
    weaponBanner: {
        baseFiveStarRate: 0.008,
        softPityStart: 66,
        hardPity: 80,
        softPityIncrement: 0.07,
        upRateOnFiveStar: 0.75,
        lossesToGuarantee: 1,
    },
    characterTerm: '星魂',
    weaponTerm: '光錐',
    currencyName: '星瓊',
    pullItemName: '星軌通票',
    currencyPerPull: 160,
    bannerImage: './images/rail.jpg',
    themeClass: 'theme-starrail',
};

const ZZZ_CONFIG: GameConfig = {
    id: 'zzz',
    name: '絕區零',
    characterBanner: {
        baseFiveStarRate: 0.006,
        softPityStart: 74,
        hardPity: 90,
        softPityIncrement: 0.06,
        upRateOnFiveStar: 0.5,
        lossesToGuarantee: 1,
    },
    weaponBanner: {
        baseFiveStarRate: 0.01,
        softPityStart: 64,
        hardPity: 80,
        softPityIncrement: 0.07,
        upRateOnFiveStar: 0.75,
        lossesToGuarantee: 1,
    },
    characterTerm: '影院等級',
    weaponTerm: '音擎',
    currencyName: '菲林',
    pullItemName: '加密母帶',
    currencyPerPull: 160,
    bannerImage: './images/ZZZ.png',
    themeClass: 'theme-zzz',
};

const WUWA_CONFIG: GameConfig = {
    id: 'wuwa',
    name: '鳴潮',
    characterBanner: {
        baseFiveStarRate: 0.008,
        softPityStart: 64,
        hardPity: 80,
        // NOTE: 社群統計推算，軟保底每抽遞增約 6%
        softPityIncrement: 0.06,
        // NOTE: 鳴潮角色限定池為 50/50 機制，歪 1 次後大保底
        upRateOnFiveStar: 0.5,
        lossesToGuarantee: 1,
    },
    weaponBanner: {
        baseFiveStarRate: 0.008,
        softPityStart: 64,
        hardPity: 80,
        softPityIncrement: 0.06,
        // NOTE: 鳴潮武器池無 50/50，80 抽內直接保底 UP 武器
        upRateOnFiveStar: 1.0,
        lossesToGuarantee: 0,
    },
    characterTerm: '諧振',
    weaponTerm: '武器',
    currencyName: '星聲',
    pullItemName: '星靈',
    currencyPerPull: 160,
    bannerImage: './images/ww.png',
    themeClass: 'theme-wuwa',
};

/** 所有遊戲配置對照表 */
export const GAME_CONFIGS: Record<GameType, GameConfig> = {
    genshin: GENSHIN_CONFIG,
    starRail: STAR_RAIL_CONFIG,
    zzz: ZZZ_CONFIG,
    wuwa: WUWA_CONFIG,
};

/** 遊戲列表（用於渲染切換頁籤） */
export const GAME_LIST: GameType[] = ['genshin', 'starRail', 'zzz', 'wuwa'];

/** 快捷預設目標 */
export const QUICK_PRESETS = [
    { label: '0+0', constellation: 0, weapon: 0 },
    { label: '0+1', constellation: 0, weapon: 1 },
    { label: '2+1', constellation: 2, weapon: 1 },
    { label: '6+1', constellation: 6, weapon: 1 },
    { label: '6+5', constellation: 6, weapon: 5 },
];
