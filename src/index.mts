import { remarkCodeFrame } from './codeframe.mjs'
import { IDialectikPlugin, IPluginProvider } from '@dialectik/plugin-interface';
import { Dirent, readdirSync } from 'fs';
import { dirname, extname, join } from 'path';
import { refractor } from 'refractor'
import rehypePrismPlus from 'rehype-prism-plus'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const onelighttheme = 'https:/cdn.jsdelivr.net/npm/prism-themes@1.9.0/themes/prism-one-light.css'

const prismPlugin : IDialectikPlugin = {
  withMain: false,
  withComponents: true,
  stylesheets: [onelighttheme],
  remarkPlugins: [remarkCodeFrame],
  rehypePlugins: [rehypePrismPlus],
  isRequired: (content: string): boolean => {
    // Define a regex pattern to match the "``` ... ```" pattern
    const pattern = /```[\s\S]*?```/;
    // Test the pattern against the input content
    return pattern.test(content);
  },
  requires: []
}

const loadPluginFiles = (pluginDirectory: string) => {
  readdirSync(pluginDirectory, { withFileTypes: true }).forEach(async (entry: Dirent) => {
    if (entry.isFile() && extname(entry.name) === '.mjs') {
      const grammar = join(pluginDirectory, entry.name);
      import(grammar).then((lang) => {
        refractor.register(lang.default);
      });
    }
  });
}

export const PluginProvider : IPluginProvider = {
  getPlugin : (arg ?: any) => {
    // __dirname is .../node_modules/@dialectik/prism-plugin/lib
    const modulesDir = join(__dirname, '..', '..', '..');
    //console.log(modulesDir)
    if (arg !== undefined && arg?.length) {
      (arg as string[]).forEach(plugin => {
        console.log("Prism plugin is loading '" + plugin + "' plugin")
        loadPluginFiles(join(modulesDir, plugin))
      })
    }
    return prismPlugin
  }
}