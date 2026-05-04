import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/tokens/index.ts',
    'src/tailwind/index.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  // Components use React hooks / context. Prepend 'use client' to the main
  // bundle so Next.js / RSC consumers can import without "createContext only
  // works in client components" errors. Tokens and Tailwind preset are pure
  // and don't need the directive.
  async onSuccess() {
    const fs = await import('node:fs');
    for (const file of ['dist/index.js', 'dist/index.cjs']) {
      const content = fs.readFileSync(file, 'utf8');
      if (!content.startsWith('"use client"') && !content.startsWith("'use client'")) {
        fs.writeFileSync(file, '"use client";\n' + content);
      }
    }
  },
});
