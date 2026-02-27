import React from 'react';
import { GameType } from '../../types/gacha';
import { GAME_CONFIGS, GAME_LIST } from '../../utils/game-configs';
import './GameSwitcher.css';

interface GameSwitcherProps {
    activeGame: GameType;
    onGameChange: (game: GameType) => void;
}

/** 遊戲切換頁籤元件 */
function GameSwitcher({ activeGame, onGameChange }: GameSwitcherProps) {
    return (
        <div className="game-switcher">
            {GAME_LIST.map((gameId) => {
                const config = GAME_CONFIGS[gameId];
                return (
                    <button
                        key={gameId}
                        className={`game-tab ${activeGame === gameId ? 'active' : ''}`}
                        onClick={() => onGameChange(gameId)}
                        id={`tab-${gameId}`}
                    >
                        <span className="game-tab-name">{config.name}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default React.memo(GameSwitcher);
