import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    // ✦ Server & client components   │  app/ + nested routes
    './app/**/*.{ts,tsx,mdx}',
    // ✦ Component libraries          │  src/components/* etc.
    './src/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    // ✦ shadcn/ui generated files    │  ui/button.tsx …
    './src/components/ui/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      /** put custom colours, spacing, fonts here */
    }
  },
  plugins: [
    /** Example: require('@tailwindcss/typography'), */
  ]
}

export default config
