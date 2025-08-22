import fs from 'fs/promises';
import path from 'path';
import { config } from '../config.js';

const templateCache = new Map();

function replacePlaceholders(template, replacements) {
  let result = template;
  for (const [key, value] of Object.entries(replacements || {})) {
    result = result.replaceAll(`{${key}}`, String(value ?? '-'));
  }
  return result;
}

export async function initTemplates() {
  if (!config.templatesDir) {
    throw new Error('TEMPLATES_DIR is not defined');
  }

  const files = await fs.readdir(config.templatesDir);
  await Promise.all(
    files
      .filter((f) => f.endsWith('.html'))
      .map(async (fileName) => {
        const filePath = path.join(config.templatesDir, fileName);
        const content = await fs.readFile(filePath, 'utf8');
        templateCache.set(fileName, content);
      })
  );
}

export function renderTemplate(templateName, replacements) {
  const tpl = templateCache.get(templateName);
  if (!tpl) {
    throw new Error(`Template not found in cache: ${templateName}`);
  }
  return replacePlaceholders(tpl, replacements);
}


