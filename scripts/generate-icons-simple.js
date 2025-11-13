#!/usr/bin/env node

/**
 * Script simplificado para gerar instruções de ícones
 * Evita problemas de compatibilidade com bibliotecas nativas
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const logoPath = path.join(__dirname, '../public/logo.svg');
const publicDir = path.join(__dirname, '../public');

console.log('\n🎨 Gerador de Ícones PWA - Profe PJ\n');

// Check if logo exists
if (!fs.existsSync(logoPath)) {
  console.error('❌ Arquivo logo.svg não encontrado em /public/\n');
  process.exit(1);
}

console.log('✅ Logo encontrado: /public/logo.svg\n');

// Check if icons already exist
const icons = [
  'icon-192x192.png',
  'icon-512x512.png',
  'badge-72x72.png'
];

const existingIcons = icons.filter(icon => 
  fs.existsSync(path.join(publicDir, icon))
);

if (existingIcons.length === icons.length) {
  console.log('✅ Todos os ícones já existem!\n');
  existingIcons.forEach(icon => {
    console.log(`   • ${icon}`);
  });
  console.log('');
  process.exit(0);
}

// Try ImageMagick
exec('which convert', (error) => {
  if (!error) {
    console.log('🔧 ImageMagick detectado! Gerando ícones...\n');
    generateWithImageMagick();
  } else {
    showWebInstructions();
  }
});

function generateWithImageMagick() {
  const sizes = [
    { size: 72, name: 'badge-72x72.png' },
    { size: 192, name: 'icon-192x192.png' },
    { size: 512, name: 'icon-512x512.png' }
  ];

  let completed = 0;

  sizes.forEach(({ size, name }) => {
    const outputPath = path.join(publicDir, name);
    const cmd = `convert "${logoPath}" -resize ${size}x${size} "${outputPath}"`;
    
    exec(cmd, (error) => {
      if (error) {
        console.error(`❌ Erro ao gerar ${name}`);
        showWebInstructions();
      } else {
        console.log(`✅ Gerado: ${name} (${size}x${size})`);
        completed++;
        
        if (completed === sizes.length) {
          console.log('\n🎉 Todos os ícones foram gerados com sucesso!\n');
        }
      }
    });
  });
}

function showWebInstructions() {
  console.log('\n📱 Use o Gerador Visual (Recomendado):\n');
  console.log('   1. Execute: npm run dev');
  console.log('   2. Acesse: http://localhost:9002/icon-generator.html');
  console.log('   3. Clique nos 3 botões de download');
  console.log('   4. Salve os arquivos em /public/\n');
  console.log('✨ Rápido, fácil e funciona em qualquer sistema!\n');
}
