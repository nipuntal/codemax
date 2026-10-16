import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import pyodide from 'pyodide/package.json' with { type: 'json' };

export default defineConfig({
  plugins: [preact()],
  resolve: { alias: { 'node:zlib': new URL('./src/runner/zlib-stub.ts', import.meta.url).pathname } },
  define: { __PYODIDE_VERSION__: JSON.stringify(pyodide.version) },
  // both ship their own wasm, located relative to the module
  optimizeDeps: { exclude: ['@electric-sql/pglite', 'pyodide'] },
  worker: { format: 'es' },
  build: { target: 'es2022', cssMinify: true, modulePreload: { polyfill: false } },
});
