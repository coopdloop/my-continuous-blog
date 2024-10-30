import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
// import markdown, { Mode } from 'vite-plugin-markdown'

export default defineConfig({
    plugins: [react(),
    // markdown({ mode: [Mode.HTML, Mode.TOC] }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    publicDir: "public"
})
