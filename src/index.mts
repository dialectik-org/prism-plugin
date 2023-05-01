import { remarkCodeFrame } from './codeframe.mjs'
import { IDialectikPlugin, IPluginProvider } from '@dialectik/plugin-interface';
import rehypePrismPlus from 'rehype-prism-plus'

const onelighttheme = 'https:/cdn.jsdelivr.net/npm/prism-themes@1.9.0/themes/prism-one-light.css'
const prismreactrenderer = "import prismReactRenderer from 'https://cdn.jsdelivr.net/npm/prism-react-renderer@1.3.5/+esm'"

const prismPlugin : IDialectikPlugin = {
  stylesheets: [onelighttheme],
  emstylesheets: [prismreactrenderer],
  remarkPlugins: [remarkCodeFrame],
  rehypePlugins: [rehypePrismPlus],
  react: { tagname: 'codeframe', componentname: 'CodeFrame' },
  isRequired: (content: string): boolean => {
    // Define a regex pattern to match the "``` ... ```" pattern
    const pattern = /```[\s\S]*?```/;
    // Test the pattern against the input content
    return pattern.test(content);
  }
}

export const PluginProvider : IPluginProvider = {
  getPlugin : () => {
    return prismPlugin
  }
}