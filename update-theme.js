import fs from 'fs';
import path from 'path';

const componentsDir = path.join(process.cwd(), 'components');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  content = content.replace(/bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg/g, 'modern-card p-6');
  content = content.replace(/bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md/g, 'modern-card p-4');
  content = content.replace(/bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg/g, 'btn-primary');
  content = content.replace(/bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg/g, 'btn-secondary');
  content = content.replace(/bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg/g, 'btn-danger');
  content = content.replace(/min-w-full divide-y divide-gray-200 dark:divide-gray-700/g, 'table-modern');
  content = content.replace(/px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider/g, 'px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400');
  content = content.replace(/px-6 py-4 whitespace-nowrap/g, 'px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-300');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir(componentsDir);
