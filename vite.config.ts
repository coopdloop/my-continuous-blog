import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import metaMapPlugin from "vite-plugin-react-meta-map";

export default defineConfig({
    plugins: [
        react(),
        metaMapPlugin({
            pageMetaMapFilePath: "./src/pageMetaMap.ts",
            pageTemplateFilePath: "./src/PageTemplate.tsx",
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    publicDir: "public",
    envDir: "."
})
