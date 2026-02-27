import React, { useCallback } from 'react';
import { GachaTarget, GameConfig } from '../../types/gacha';
import { QUICK_PRESETS } from '../../utils/game-configs';
import './TargetSelector.css';

interface TargetSelectorProps {
    target: GachaTarget;
    onTargetChange: (target: GachaTarget) => void;
    gameConfig: GameConfig;
}

/**
 * 目標選擇器元件
 * 包含命座/星魂選擇、武器/光錐選擇、快捷預設按鈕
 */
function TargetSelector({ target, onTargetChange, gameConfig }: TargetSelectorProps) {
    const handleConstellationChange = useCallback(
        (value: number) => {
            onTargetChange({ ...target, constellation: value });
        },
        [target, onTargetChange]
    );

    const handleWeaponChange = useCallback(
        (value: number) => {
            onTargetChange({ ...target, weapon: value });
        },
        [target, onTargetChange]
    );

    const handlePreset = useCallback(
        (constellation: number, weapon: number) => {
            onTargetChange({ constellation, weapon });
        },
        [onTargetChange]
    );

    return (
        <div className="target-selector">
            <h2 className="section-title">🎯 目標設定</h2>

            <div className="selector-grid">
                <div className="selector-item">
                    <label className="selector-label">
                        {gameConfig.characterTerm}
                    </label>
                    <div className="selector-buttons">
                        {Array.from({ length: 7 }, (_, i) => (
                            <button
                                key={i}
                                className={`selector-btn ${target.constellation === i ? 'active' : ''}`}
                                onClick={() => handleConstellationChange(i)}
                            >
                                {i === 0 ? '本體' : `${i}`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="selector-item">
                    <label className="selector-label">
                        {gameConfig.weaponTerm}
                    </label>
                    <div className="selector-buttons">
                        {Array.from({ length: 6 }, (_, i) => (
                            <button
                                key={i}
                                className={`selector-btn ${target.weapon === i ? 'active' : ''}`}
                                onClick={() => handleWeaponChange(i)}
                            >
                                {i === 0 ? '不抽' : `${i}`}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="quick-presets">
                <span className="preset-label">快捷：</span>
                {QUICK_PRESETS.map((preset) => (
                    <button
                        key={preset.label}
                        className={`preset-btn ${target.constellation === preset.constellation &&
                                target.weapon === preset.weapon
                                ? 'active'
                                : ''
                            }`}
                        onClick={() => handlePreset(preset.constellation, preset.weapon)}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default React.memo(TargetSelector);
