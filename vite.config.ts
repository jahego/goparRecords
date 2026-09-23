import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const pagesBase = '/goparRecords/'

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? pagesBase : '/',
})
