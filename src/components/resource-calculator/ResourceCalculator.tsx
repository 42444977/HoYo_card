import React, { useState, useCallback, useMemo } from 'react';
import { GameConfig, GachaTarget, CurrentProgress } from '../../types/gacha';
import { calculateProbability } from '../../utils/gacha-engine';
import { formatProbability } from '../../utils/format';
import './ResourceCalculator.css';

interface ResourceCalculatorProps {
    gameConfig: GameConfig;
    target: GachaTarget;
}

/**
 * 資源計算器元件
 * 讓玩家輸入持有的貨幣或抽數，計算達成目標的概率
 */
function ResourceCalculator({ gameConfig, target }: ResourceCalculatorProps) {
    const [inputMode, setInputMode] = useState<'currency' | 'pulls'>('currency');
    const [currencyAmount, setCurrencyAmount] = useState<string>('');
    const [pullAmount, setPullAmount] = useState<string>('');
    const [showAdvanced, setShowAdvanced] = useState(false);

    // 進階選項
    const [charPity, setCharPity] = useState<string>('0');
    const [charGuaranteed, setCharGuaranteed] = useState(false);
    const [weaponPity, setWeaponPity] = useState<string>('0');
    const [weaponGuaranteed, setWeaponGuaranteed] = useState(false);

    const [probability, setProbability] = useState<number | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    // NOTE: 儲存按下計算按鈕時的抽數，避免輸入變動導致結果文字與概率不一致
    const [calculatedPulls, setCalculatedPulls] = useState<number>(0);

    const availablePulls = useMemo(() => {
        if (inputMode === 'pulls') {
            return parseInt(pullAmount) || 0;
        }
        const currency = parseInt(currencyAmount) || 0;
        return Math.floor(currency / gameConfig.currencyPerPull);
    }, [inputMode, pullAmount, currencyAmount, gameConfig.currencyPerPull]);

    const progress: CurrentProgress = useMemo(() => ({
        characterPity: parseInt(charPity) || 0,
        characterGuaranteed: charGuaranteed,
        weaponPity: parseInt(weaponPity) || 0,
        weaponGuaranteed: weaponGuaranteed,
    }), [charPity, charGuaranteed, weaponPity, weaponGuaranteed]);

    const handleCalculate = useCallback(() => {
        if (availablePulls <= 0) return;
        if (target.constellation + 1 === 0 && target.weapon === 0) return;

        setIsCalculating(true);
        setProbability(null);
        // NOTE: 鎖定當前抽數，按下按鈕後才更新顯示
        const pullsSnapshot = availablePulls;
        setCalculatedPulls(pullsSnapshot);

        // NOTE: 使用 setTimeout 讓 UI 先更新再執行耗時計算
        setTimeout(() => {
            const prob = calculateProbability(gameConfig, target, progress, pullsSnapshot);
            setProbability(prob);
            setIsCalculating(false);
        }, 50);
    }, [availablePulls, gameConfig, target, progress]);

    const getProbabilityColor = (prob: number) => {
        if (prob >= 0.9) return '#4ade80';
        if (prob >= 0.7) return '#a3e635';
        if (prob >= 0.5) return '#facc15';
        if (prob >= 0.3) return '#fb923c';
        return '#ef4444';
    };

    return (
        <div className="resource-calculator">
            <h2 className="section-title">🎲 概率計算</h2>

            <div className="input-mode-toggle">
                <button
                    className={`mode-btn ${inputMode === 'currency' ? 'active' : ''}`}
                    onClick={() => setInputMode('currency')}
                >
                    {gameConfig.currencyName}
                </button>
                <button
                    className={`mode-btn ${inputMode === 'pulls' ? 'active' : ''}`}
                    onClick={() => setInputMode('pulls')}
                >
                    抽數
                </button>
            </div>

            <div className="input-group">
                {inputMode === 'currency' ? (
                    <div className="input-field">
                        <label>持有{gameConfig.currencyName}</label>
                        <input
                            type="number"
                            value={currencyAmount}
                            onChange={(e) => setCurrencyAmount(e.target.value)}
                            placeholder={`輸入${gameConfig.currencyName}數量`}
                            min="0"
                            id="currency-input"
                        />
                        {currencyAmount && (
                            <span className="input-hint">
                                ≈ {availablePulls} 抽
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="input-field">
                        <label>可用抽數</label>
                        <input
                            type="number"
                            value={pullAmount}
                            onChange={(e) => setPullAmount(e.target.value)}
                            placeholder="輸入抽數"
                            min="0"
                            id="pulls-input"
                        />
                    </div>
                )}
            </div>

            <button
                className="advanced-toggle"
                onClick={() => setShowAdvanced(!showAdvanced)}
            >
                {showAdvanced ? '▾' : '▸'} 進階選項
            </button>

            {showAdvanced && (
                <div className="advanced-options">
                    <div className="advanced-row">
                        <div className="input-field compact">
                            <label>角色池已墊抽數</label>
                            <input
                                type="number"
                                value={charPity}
                                onChange={(e) => setCharPity(e.target.value)}
                                min="0"
                                max={gameConfig.characterBanner.hardPity - 1}
                                id="char-pity-input"
                            />
                        </div>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={charGuaranteed}
                                onChange={(e) => setCharGuaranteed(e.target.checked)}
                            />
                            <span>已有大保底</span>
                        </label>
                    </div>

                    {target.weapon > 0 && (
                        <div className="advanced-row">
                            <div className="input-field compact">
                                <label>{gameConfig.weaponTerm}池已墊抽數</label>
                                <input
                                    type="number"
                                    value={weaponPity}
                                    onChange={(e) => setWeaponPity(e.target.value)}
                                    min="0"
                                    max={gameConfig.weaponBanner.hardPity - 1}
                                    id="weapon-pity-input"
                                />
                            </div>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={weaponGuaranteed}
                                    onChange={(e) => setWeaponGuaranteed(e.target.checked)}
                                />
                                <span>已有大保底</span>
                            </label>
                        </div>
                    )}
                </div>
            )}

            <button
                className="calculate-btn"
                onClick={handleCalculate}
                disabled={availablePulls <= 0 || isCalculating}
                id="calculate-probability-btn"
            >
                {isCalculating ? '計算中...' : '計算達成概率'}
            </button>

            {probability !== null && (
                <div className="probability-result">
                    <div className="prob-value" style={{ color: getProbabilityColor(probability) }}>
                        {formatProbability(probability)}
                    </div>
                    <div className="prob-desc">
                        使用 {calculatedPulls.toLocaleString()} 抽達成目標的概率
                    </div>
                    <div className="prob-bar-container">
                        <div
                            className="prob-bar"
                            style={{
                                width: `${probability * 100}%`,
                                backgroundColor: getProbabilityColor(probability),
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default React.memo(ResourceCalculator);
