// src/components/Settings.jsx
import styles from "../styles/Setting.module.css";

function Settings({ theme, opponent, setTheme, setOpponent, multiplayer, setMultiplayer }) {
  return (
    <div className={styles.settingsDropdown}>
      <div className={styles.settingItem}>
        <label>Theme:</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="system">System</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>
      <div className={styles.settingItem}>
        <label>Opponent:</label>
        <select value={opponent} onChange={(e) => setOpponent(e.target.value)}>
          <option value="self">Self</option>
          <option value="ai">AI</option>
        </select>
      </div>
      <div className={styles.settingItem}>
        <label>Multiplayer:</label>
        <select value={multiplayer} onChange={(e) => setMultiplayer(e.target.value)}>
          <option value="offline">Offline</option>
          <option value="online">Online</option>
        </select>
      </div>
    </div>
  );
}

export default Settings;
