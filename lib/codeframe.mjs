//import { map, MapFunction } from 'unist-util-visit'
import { map } from 'unist-util-map';
/**
 * Adds a prism frame tag to the code block, typically to add a copy/paste button
 * @param node
 * @returns
 */
const mf = (node) => {
    if (node.type == 'code') {
        const n = {
            type: 'mdxJsxFlowElement',
            name: 'codeframe',
            attributes: [
                {
                    type: 'mdxJsxAttribute',
                    name: 'code',
                    value: node.value
                }
            ],
            children: [node]
        };
        return n;
    }
    return node;
};
export const remarkCodeFrame = () => (tree) => {
    return map(tree, mf);
};
