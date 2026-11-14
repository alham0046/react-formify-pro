// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,               // Generates index.d.ts for full TypeScript autocomplete
  splitting: false,
  sourcemap: true,
  clean: true,
  injectStyle: true, // 👈 This is the important one
  loader: {
    '.css': 'css', // 👈 Tell tsup to process css files
  },
  external: ['react', 'react-dom'], // Never bundle React inside the library
})