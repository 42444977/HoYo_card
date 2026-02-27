import React from 'react';
import { SimulationResult, GameConfig, GachaTarget } from '../../types/gacha';
import DistributionChart from './DistributionChart';
import './ResultDisplay.css';

interface ResultDisplayProps {
    result: SimulationResult | null;
    target: GachaTarget;
    gameConfig: GameConfig;
    isLoading: boolean;
}

/**
 * 結果展示元件
 * 顯示期望抽數、最佳/最差情況、概率分佈圖
 */
function ResultDisplay({ result, target, gameConfig, isLoading }: ResultDisplayProps) {
    const targetLabel = `${target.constellation}+${target.weapon}`;
    const characterCount = target.constellation + 1;

    const getTargetDescription = () => {
        const parts: string[] = [];
        if (characterCount > 0) {
            if (target.constellation === 0) {
                parts.push('角色本體');
            } else {
                parts.push(`${target.constellation}${gameConfig.characterTerm}`);
            }
        }
        if (target.weapon > 0) {
            parts.push(`${target.weapon}把${gameConfig.weaponTerm}`);
        }
        return parts.join(' + ') || '無目標';
    };

    if (isLoading) {
        return (
            <div className="result-display">
                <h2 className="section-title">📊 計算結果</h2>
                <div className="loading-container">
                    <div className="loading-spinner" />
                    <p className="loading-text">模擬計算中...</p>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="result-display">
                <h2 className="section-title">📊 計算結果</h2>
                <p className="result-placeholder">選擇目標後自動計算</p>
            </div>
        );
    }

    const expectedCurrency = result.expectedPulls * gameConfig.currencyPerPull;

    return (
        <div className="result-display">
            <h2 className="section-title">📊 計算結果</h2>

            <div className="target-badge">
                <span className="target-label">🎯 目標：</span>
                <span className="target-value">{targetLabel}</span>
                <span className="target-desc">（{getTargetDescription()}）</span>
            </div>

            <div className="stat-cards">
                <div className="stat-card primary">
                    <div className="stat-icon">📊</div>
                    <div className="stat-info">
                        <div className="stat-label">期望抽數</div>
                        <div className="stat-value">{result.expectedPulls.toLocaleString()}</div>
                        <div className="stat-sub">
                            ≈ {expectedCurrency.toLocaleString()} {gameConfig.currencyName}
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-info">
                        <div className="stat-label">中位數</div>
                        <div className="stat-value">{result.medianPulls.toLocaleString()}</div>
                    </div>
                </div>

                <div className="stat-card best">
                    <div className="stat-icon">✨</div>
                    <div className="stat-info">
                        <div className="stat-label">最佳情況</div>
                        <div className="stat-value">{result.bestCase.toLocaleString()}</div>
                        <div className="stat-sub">前 1% 幸運</div>
                    </div>
                </div>

                <div className="stat-card worst">
                    <div className="stat-icon">⚠️</div>
                    <div className="stat-info">
                        <div className="stat-label">最差情況</div>
                        <div className="stat-value">{result.worstCase.toLocaleString()}</div>
                        <div className="stat-sub">後 1% 非酋</div>
                    </div>
                </div>
            </div>

            {result.distribution.length > 0 && (
                <DistributionChart distribution={result.distribution} />
            )}
        </div>
    );
}

export default React.memo(ResultDisplay);
