
// vite.config.js

import { resolve } from 'path'
import {defineConfig} from "vite";

export default defineConfig({
    build:{
        lib:{
            entry:resolve(__dirname,'./index.js'),
            name:'cryptoNet',
        },
        minify:true,
    },
    esbuild: {
        drop: ["console", "debugger"],
        minify:true,
        minifyWhitespace: true
    },
    optimizeDeps: {
        esbuildOptions: {
            "minifyWhitespace": true,
            "minifyIdentifiers": true,
            "minifySyntax": true
        },
    },
})

