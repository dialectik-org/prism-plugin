import { remarkCodeFrame } from './codeframe.mjs';
import { readdirSync } from 'fs';
import { dirname, extname, join } from 'path';
import { refractor } from 'refractor';
import rehypePrismPlus from 'rehype-prism-plus';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const onelighttheme = 'https:/cdn.jsdelivr.net/npm/prism-themes@1.9.0/themes/prism-one-light.css';
const prismreactrenderer = "import prismReactRenderer from 'https://cdn.jsdelivr.net/npm/prism-react-renderer@1.3.5/+esm'";
const prismPlugin = {
    stylesheets: [onelighttheme],
    emstylesheets: [prismreactrenderer],
    remarkPlugins: [remarkCodeFrame],
    rehypePlugins: [rehypePrismPlus],
    react: { tagname: 'codeframe', componentname: 'CodeFrame' },
    isRequired: (content) => {
        // Define a regex pattern to match the "``` ... ```" pattern
        const pattern = /```[\s\S]*?```/;
        // Test the pattern against the input content
        return pattern.test(content);
    }
};
const loadPluginFiles = (pluginDirectory) => {
    readdirSync(pluginDirectory, { withFileTypes: true }).forEach(async (entry) => {
        if (entry.isFile() && extname(entry.name) === '.mjs') {
            const grammar = join(pluginDirectory, entry.name);
            import(grammar).then((lang) => {
                refractor.register(lang.default);
            });
        }
    });
};
export const PluginProvider = {
    getPlugin: (arg) => {
        // __dirname is .../node_modules/@dialectik/prism-plugin/lib
        const modulesDir = join(__dirname, '..', '..', '..');
        console.log(modulesDir);
        if (arg !== undefined && arg?.length) {
            arg.forEach(plugin => {
                console.log("Prism plugin is loading '" + plugin + "' plugin");
                loadPluginFiles(join(modulesDir, plugin));
            });
        }
        return prismPlugin;
    }
};
