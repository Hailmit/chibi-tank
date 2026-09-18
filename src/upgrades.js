import { CONFIG } from './config.js';

export const UPGRADE_INTERVAL = 120;
export const UPGRADE_MAX_LEVEL = 4;

export const UPGRADE_CARDS = [
  { id: 'armor', name: 'GIÁP GIA CỐ', symbol: '◆' },
  { id: 'engine', name: 'ĐỘNG CƠ', symbol: '↗' },
  { id: 'cannon', name: 'HỎA LỰC', symbol: '✦' },
];

export function upgradeDescription(player, id) {
  if (id === 'armor') return player.armorLevel < UPGRADE_MAX_LEVEL ? '+25 giáp tối đa và hồi 25 giáp' : 'Hồi 50 giáp';
  if (id === 'engine') return player.engineLevel < UPGRADE_MAX_LEVEL ? '+10% tốc độ, +15% hồi năng lượng' : 'Đầy năng lượng, tăng tốc 8 giây';
  if (id === 'cannon') return player.cannonLevel < UPGRADE_MAX_LEVEL ? '+12% sát thương mọi loại đạn' : 'Bắn nhanh 10 giây';
  return '';
}

export function applyUpgrade(player, id) {
  if (id === 'armor') {
    if (player.armorLevel < UPGRADE_MAX_LEVEL) { player.armorLevel++; player.maxHP += 25; player.hp = Math.min(player.maxHP, player.hp + 25); }
    else player.hp = Math.min(player.maxHP, player.hp + 50);
  } else if (id === 'engine') {
    if (player.engineLevel < UPGRADE_MAX_LEVEL) { player.engineLevel++; player.speedMultiplier = 1 + player.engineLevel * .1; player.staminaRegenMultiplier = 1 + player.engineLevel * .15; }
    else { player.stamina = CONFIG.player.stamina; player.speedBuff = Math.max(player.speedBuff, 8); }
  } else if (id === 'cannon') {
    if (player.cannonLevel < UPGRADE_MAX_LEVEL) { player.cannonLevel++; player.damageMultiplier = 1 + player.cannonLevel * .12; }
    else player.fireBuff = Math.max(player.fireBuff, 10);
  } else return false;
  return true;
}
