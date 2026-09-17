export const CONFIG = {
  step: 1 / 30,
  world: { size: 25, cell: 2.4, shiftMin: 35, shiftMax: 50, warning: 2, protectRadius: 5.5, phaseDuration: 60 },
  player: { hp: 100, stamina: 100, speed: 6, radius: .62, fireInterval: .25, damage: 28,
    dashCost: 30, dashDuration: .18, dashInvulnerability: .12, dashSpeed: 22, dashCooldown: .5, staminaRegen: 23, hurtGrace: .65 },
  director: { maxEnemies: 16, spawnStart: 4.2, spawnMin: 1.35, spawnWarning: 1.5, safeRadius: 11, eliteEvery: 90, assaultFirst: 24, assaultBase: 38, assaultMin: 28, assaultGap: .6 },
  combat: { maxBullets: 180, maxMortars: 12, bulletSpeed: 25, enemyBulletSpeed: 10, comboWindow: 4, maxCombo: 5, survivalScore: 5, maxPickups: 16 },
  effects: { high: 96, popups: 16 },
  performance: { softwareFPS: 24, highFPS: 60, idleFPS: 4, uiFPS: 5 },
  colors: { mint: 0x74d6b2, sky: 0x8fcdda, yellow: 0xffd36c, coral: 0xed7765, road: 0xe8e4d7, grass: 0xb5d3a1, ink: 0x263f44, steel: 0x8babb4, water: 0x7ec8db },
};
export const ENEMIES = {
  scout: { name: 'Trinh sát', hp: 40, speed: 3.5, radius: .51, scale: .78, color: 0xf28b67, interval: 2.3, damage: 10, points: 100, range: 5 },
  gunner: { name: 'Xạ thủ', hp: 65, speed: 2.4, radius: .62, scale: 1, color: 0xdc6383, interval: 3, damage: 12, points: 180, range: 10 },
  heavy: { name: 'Thiết giáp', hp: 145, speed: 1.45, radius: .83, scale: 1.3, color: 0x966fb5, interval: 3.6, damage: 25, points: 350, range: 11 },
  mortar: { name: 'Pháo cối', hp: 65, speed: 1.8, radius: .62, scale: 1, color: 0xe0a544, interval: 4.6, damage: 24, points: 250, range: 15 },
  elite: { name: 'ĐẠI ÚY KẸO THÉP', hp: 650, speed: 1.9, radius: .91, scale: 1.42, color: 0xcf5474, interval: 2.5, damage: 20, points: 1800, range: 12 },
};
