#!/usr/bin/env node

/**
 * Script para gerar ícones PNG a partir do logo.svg
 * 
 * Este script usa Puppeteer para renderizar o SVG
 * (compatível com mais sistemas)
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Gerador de Ícones - Profe PJ\n');
console.log('⚠️  O script automatizado requer dependências específicas.');
console.log('');
console.log('� Use o gerador visual no navegador:');
console.log('');
console.log('   1️⃣  Execute: npm run dev');
console.log('   2️⃣  Acesse: http://localhost:9002/icon-generator.html');
console.log('   3️⃣  Clique nos botões de download');
console.log('   4️⃣  Salve os 3 arquivos em /public/');
console.log('');
console.log('✨ É rápido, visual e funciona em qualquer sistema!');
console.log('');

// Alternative: provide instructions for manual generation
const logoPath = path.join(__dirname, '../public/logo.svg');
const publicDir = path.join(__dirname, '../public');

if (!fs.existsSync(logoPath)) {
  console.error('❌ Arquivo logo.svg não encontrado em /public/');
  process.exit(1);
}

console.log('📂 Logo encontrado: /public/logo.svg ✅');
console.log('');
console.log('💡 Alternativas:');
console.log('   • Gerador Web (recomendado)');
console.log('   • ImageMagick: convert logo.svg -resize 192x192 icon-192x192.png');
console.log('   • Inkscape: inkscape logo.svg --export-png=icon-192x192.png -w 192 -h 192');
console.log('   • GIMP: Abra o SVG e exporte como PNG');
console.log('   • Figma/Photoshop: Importe o SVG e exporte');
console.log('');
