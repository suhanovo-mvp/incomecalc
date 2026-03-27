#!/usr/bin/env node
import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildApp() {
  try {
    await build({
      root: path.join(__dirname, 'client'),
      build: {
        outDir: path.join(__dirname, 'dist'),
        emptyOutDir: true,
      },
    });
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildApp();
