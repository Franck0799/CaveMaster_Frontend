// ==========================================
// SCRIPT DE MIGRATION DES VARIABLES SASS VERS CSS
// ==========================================
// Ce script remplace automatiquement les variables SASS par des variables CSS
// dans tous les fichiers .scss de votre projet
//generalement utilisé pour migrer les variables de thème ( couleurs, backgrounds, textes, bordures, ombres, etc. black,white, primary, secondary, success, danger, warning, info, orange, etc. )

const fs = require('fs');
const path = require('path');

// Compteur de statistiques
let stats = {
  filesProcessed: 0,
  filesModified: 0,
  totalReplacements: 0
};

// Configuration
const config = {
  // Dossier à traiter (src/app pour tous les composants)
  srcDir: './src/app',
  // Créer une sauvegarde avant modification
  createBackup: true,
  // Extension des fichiers à traiter
  fileExtension: '.scss'
};

// Dictionnaire de remplacement - ORDRE IMPORTANT (du plus spécifique au plus général)
const replacements = {
  // === VARIABLES DE COULEUR ===
  '\\$primary-light': 'var(--primary-light)',
  '\\$primary-dark': 'var(--primary-dark)',
  '\\$primary(?!-)': 'var(--primary)',
  '\\$secondary-color': 'var(--secondary)',
  '\\$secondary': 'var(--secondary)',
  '\\$accent': 'var(--accent)',
  '\\$success-color': 'var(--success)',
  '\\$success': 'var(--success)',
  '\\$warning-color': 'var(--warning)',
  '\\$warning': 'var(--warning)',
  '\\$danger-color': 'var(--danger)',
  '\\$danger': 'var(--danger)',
  '\\$info-color': 'var(--info)',
  '\\$info': 'var(--info)',
  '\\$orange-color': 'var(--stat-orange)',
  '\\$orange': 'var(--stat-orange)',

  // === VARIABLES DE BACKGROUND ===
  '\\$dark-bg': 'var(--dark-bg)',
  '\\$darker-bg': 'var(--darker-bg)',
  '\\$card-bg': 'var(--card-bg)',
  '\\$card-hover': 'var(--card-hover)',
  '\\$sidebar-bg': 'var(--sidebar-bg)',
  '\\$bg-dark': 'var(--dark-bg)',
  '\\$bg-darker': 'var(--darker-bg)',
  '\\$bg-card': 'var(--card-bg)',
  '\\$bg-light': 'var(--dark-bg)',
  '\\$bg-white': 'var(--card-bg)',

  // === VARIABLES DE TEXTE ===
  '\\$text-primary': 'var(--text-primary)',
  '\\$text-secondary': 'var(--text-secondary)',
  '\\$text-muted': 'var(--text-muted)',
  '\\$text-dark': 'var(--text-primary)',
  '\\$text-light': 'var(--text-muted)',
  '\\$text(?!-)': 'var(--text)',

  // === VARIABLES DE BORDURE ===
  '\\$border-color': 'var(--border-color)',
  '\\$border-light': 'var(--border-light)',
  '\\$border(?!-)': 'var(--border)',

  // === VARIABLES D'OMBRE ===
  '\\$shadow-sm': 'var(--shadow)',
  '\\$shadow-md': 'var(--shadow-md)',
  '\\$shadow-lg': 'var(--shadow-lg)',
  '\\$shadow(?!-)': 'var(--shadow)',

  // === VARIABLES SPÉCIALES ===
  '\\$wine-red': 'var(--wine-red)',
  '\\$wine-white': 'var(--wine-white)',
  '\\$scan-line-color': 'var(--scan-line-color)',
  '\\$glow-primary': 'var(--glow-primary)',
  '\\$glow-success': 'var(--glow-success)',
  '\\$glow-danger': 'var(--glow-danger)',

  // === RGBA AVEC OPACITÉ ===
  // Opacité 0.05
  'rgba\\(\\$([a-z-]+),\\s*0\\.05\\)': 'color-mix(in srgb, var(--$1) 5%, transparent)',
  // Opacité 0.1
  'rgba\\(\\$([a-z-]+),\\s*0\\.1\\)': 'color-mix(in srgb, var(--$1) 10%, transparent)',
  // Opacité 0.15
  'rgba\\(\\$([a-z-]+),\\s*0\\.15\\)': 'color-mix(in srgb, var(--$1) 15%, transparent)',
  // Opacité 0.2
  'rgba\\(\\$([a-z-]+),\\s*0\\.2\\)': 'color-mix(in srgb, var(--$1) 20%, transparent)',
  // Opacité 0.25
  'rgba\\(\\$([a-z-]+),\\s*0\\.25\\)': 'color-mix(in srgb, var(--$1) 25%, transparent)',
  // Opacité 0.3
  'rgba\\(\\$([a-z-]+),\\s*0\\.3\\)': 'color-mix(in srgb, var(--$1) 30%, transparent)',
  // Opacité 0.4
  'rgba\\(\\$([a-z-]+),\\s*0\\.4\\)': 'color-mix(in srgb, var(--$1) 40%, transparent)',
  // Opacité 0.5
  'rgba\\(\\$([a-z-]+),\\s*0\\.5\\)': 'color-mix(in srgb, var(--$1) 50%, transparent)',
  // Opacité 0.6
  'rgba\\(\\$([a-z-]+),\\s*0\\.6\\)': 'color-mix(in srgb, var(--$1) 60%, transparent)',
  // Opacité 0.7
  'rgba\\(\\$([a-z-]+),\\s*0\\.7\\)': 'color-mix(in srgb, var(--$1) 70%, transparent)',
  // Opacité 0.75
  'rgba\\(\\$([a-z-]+),\\s*0\\.75\\)': 'color-mix(in srgb, var(--$1) 75%, transparent)',
  // Opacité 0.8
  'rgba\\(\\$([a-z-]+),\\s*0\\.8\\)': 'color-mix(in srgb, var(--$1) 80%, transparent)',
  // Opacité 0.85
  'rgba\\(\\$([a-z-]+),\\s*0\\.85\\)': 'color-mix(in srgb, var(--$1) 85%, transparent)',
  // Opacité 0.9
  'rgba\\(\\$([a-z-]+),\\s*0\\.9\\)': 'color-mix(in srgb, var(--$1) 90%, transparent)',
  // Opacité 0.95
  'rgba\\(\\$([a-z-]+),\\s*0\\.95\\)': 'color-mix(in srgb, var(--$1) 95%, transparent)',
};

// Fonction pour créer une sauvegarde
function createBackup(filePath) {
  const backupPath = filePath + '.backup';
  fs.copyFileSync(filePath, backupPath);
}

// Fonction pour traiter un fichier
function processFile(filePath) {
  stats.filesProcessed++;

  try {
    // Lire le contenu du fichier
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let fileReplacements = 0;

    // Créer une sauvegarde si configuré
    if (config.createBackup) {
      createBackup(filePath);
    }

    // Appliquer tous les remplacements
    Object.entries(replacements).forEach(([pattern, replacement]) => {
      const regex = new RegExp(pattern, 'g');
      const matches = content.match(regex);

      if (matches) {
        content = content.replace(regex, replacement);
        fileReplacements += matches.length;
      }
    });

    // Sauvegarder si le fichier a été modifié
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      stats.filesModified++;
      stats.totalReplacements += fileReplacements;
      console.log(`✅ Migré: ${filePath.replace(config.srcDir + '/', '')}`);
      console.log(`   → ${fileReplacements} remplacement(s)\n`);
    }
  } catch (error) {
    console.error(`❌ Erreur lors du traitement de ${filePath}:`, error.message);
  }
}

// Fonction pour parcourir les dossiers récursivement
function walkDir(dir) {
  try {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);

      try {
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          // Ignorer node_modules et autres dossiers à exclure
          if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
            walkDir(filePath);
          }
        } else if (file.endsWith(config.fileExtension)) {
          processFile(filePath);
        }
      } catch (error) {
        console.error(`❌ Erreur d'accès à ${filePath}:`, error.message);
      }
    });
  } catch (error) {
    console.error(`❌ Erreur lors de la lecture du dossier ${dir}:`, error.message);
  }
}

// Fonction principale
function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     🚀 MIGRATION DES VARIABLES SASS VERS CSS             ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Vérifier que le dossier source existe
  if (!fs.existsSync(config.srcDir)) {
    console.error(`❌ Le dossier ${config.srcDir} n'existe pas!`);
    console.error('   Assurez-vous d\'exécuter ce script depuis la racine du projet.\n');
    process.exit(1);
  }

  console.log(`📁 Dossier source: ${config.srcDir}`);
  console.log(`📝 Extension: ${config.fileExtension}`);
  console.log(`💾 Sauvegarde: ${config.createBackup ? 'Activée (.backup)' : 'Désactivée'}`);
  console.log('\n' + '─'.repeat(60) + '\n');

  const startTime = Date.now();

  // Lancer la migration
  walkDir(config.srcDir);

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Afficher les statistiques
  console.log('\n' + '═'.repeat(60));
  console.log('✨ MIGRATION TERMINÉE !\n');
  console.log(`📊 STATISTIQUES:`);
  console.log(`   • Fichiers traités: ${stats.filesProcessed}`);
  console.log(`   • Fichiers modifiés: ${stats.filesModified}`);
  console.log(`   • Total de remplacements: ${stats.totalReplacements}`);
  console.log(`   • Durée: ${duration}s`);
  console.log('═'.repeat(60) + '\n');

  if (config.createBackup) {
    console.log('💡 Note: Des fichiers .backup ont été créés.');
    console.log('   Vous pouvez les supprimer après avoir vérifié que tout fonctionne.\n');
    console.log('   Pour supprimer toutes les sauvegardes:');
    console.log('   → find src/app -name "*.backup" -delete\n');
  }

  if (stats.filesModified === 0) {
    console.log('ℹ️  Aucun fichier n\'a été modifié.');
    console.log('   Soit la migration a déjà été effectuée,');
    console.log('   soit aucune variable SASS n\'a été trouvée.\n');
  } else {
    console.log('🎉 Prochaines étapes:');
    console.log('   1. Vérifiez les fichiers modifiés');
    console.log('   2. Supprimez les déclarations de variables SASS ($variable: valeur;)');
    console.log('   3. Testez l\'application');
    console.log('   4. Testez le changement de thème\n');
  }
}

// Lancer le script
main();
