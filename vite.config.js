import {
    copyFileSync,
} from "node:fs";

import {
    defineConfig,
} from "vite";


const githubPagesSpaFallback = () => ({
    name: "github-pages-spa-fallback",

    apply: "build",

    closeBundle() {
        copyFileSync(
            "dist/index.html",
            "dist/404.html",
        );
    },
});


export default defineConfig({
    base:
        "/otus-js-lapina-repo2/",

    plugins: [
        githubPagesSpaFallback(),
    ],
});