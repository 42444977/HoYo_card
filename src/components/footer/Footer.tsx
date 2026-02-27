import React from 'react';
import './Footer.css';

/** 頁尾元件 — 免責聲明與機制說明 */
function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p className="footer-disclaimer">
                    本計算器基於社群統計數據與蒙地卡羅模擬（100,000 次），結果僅供參考。
                </p>
                <p className="footer-note">
                    本網站與 HoYoverse（米哈遊）無關。原神、崩壞：星穹鐵道、絕區零為 HoYoverse 的商標。
                </p>
                <p className="footer-source">
                    數據來源：遊戲內公告 · 社群統計 · paimon.moe
                </p>
            </div>
        </footer>
    );
}

export default React.memo(Footer);
