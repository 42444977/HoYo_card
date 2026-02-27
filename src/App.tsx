import { useState, useEffect, useCallback, useMemo } from 'react';
import { GameType, GachaTarget, CurrentProgress, SimulationResult } from './types/gacha';
import { GAME_CONFIGS } from './utils/game-configs';
import { runSimulation } from './utils/gacha-engine';
import GameSwitcher from './components/game-switcher/GameSwitcher';
import TargetSelector from './components/target-selector/TargetSelector';
import ResultDisplay from './components/result-display/ResultDisplay';
import ResourceCalculator from './components/resource-calculator/ResourceCalculator';
import Footer from './components/footer/Footer';
import './App.css';

/**
 * HoYoverse 三遊戲抽卡期望計算器
 * 支援原神、星穹鐵道、絕區零
 */
function App() {
    const [activeGame, setActiveGame] = useState<GameType>('genshin');
    const [target, setTarget] = useState<GachaTarget>({ constellation: 0, weapon: 0 });
    const [result, setResult] = useState<SimulationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const gameConfig = useMemo(() => GAME_CONFIGS[activeGame], [activeGame]);

    // NOTE: 預設進度為零，期望計算使用零墊抽
    const defaultProgress: CurrentProgress = useMemo(() => ({
        characterPity: 0,
        characterGuaranteed: false,
        weaponPity: 0,
        weaponGuaranteed: false,
    }), []);

    // 當目標或遊戲改變時，自動重新計算
    useEffect(() => {
        if (target.constellation + 1 <= 0 && target.weapon === 0) {
            setResult(null);
            return;
        }

        setIsLoading(true);

        // 使用 setTimeout 讓 UI 先更新，避免計算阻塞渲染
        const timerId = setTimeout(() => {
            const simResult = runSimulation(gameConfig, target, defaultProgress);
            setResult(simResult);
            setIsLoading(false);
        }, 100);

        return () => clearTimeout(timerId);
    }, [gameConfig, target, defaultProgress]);

    const handleGameChange = useCallback((game: GameType) => {
        setActiveGame(game);
        setResult(null);
    }, []);

    const handleTargetChange = useCallback((newTarget: GachaTarget) => {
        setTarget(newTarget);
    }, []);

    return (
        <div className={`app ${gameConfig.themeClass}`}>
            {/* 背景裝飾 */}
            <div className="bg-gradient" />
            <div className="bg-particles" />

            <div className="container">
                {/* 標題 */}
                <header className="app-header">
                    <h1 className="app-title">
                        <span className="title-icon">✦</span>
                        HoYo 抽卡計算器
                    </h1>
                    <p className="app-subtitle">計算你的抽卡期望與達成概率</p>
                </header>

                {/* 遊戲切換 */}
                <GameSwitcher activeGame={activeGame} onGameChange={handleGameChange} />

                {/* 遊戲橫幅圖片 */}
                <div className="game-banner">
                    <img
                        src={gameConfig.bannerImage}
                        alt={`${gameConfig.name} 橫幅`}
                        className="banner-image"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>

                {/* 主要內容 */}
                <div className="main-content">
                    {/* 目標選擇 */}
                    <TargetSelector
                        target={target}
                        onTargetChange={handleTargetChange}
                        gameConfig={gameConfig}
                    />

                    {/* 結果展示 */}
                    <ResultDisplay
                        result={result}
                        target={target}
                        gameConfig={gameConfig}
                        isLoading={isLoading}
                    />

                    {/* 資源計算 */}
                    <ResourceCalculator
                        gameConfig={gameConfig}
                        target={target}
                    />
                </div>

                <Footer />
            </div>
        </div>
    );
}

export default App;
