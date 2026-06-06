import {HTMLGenerator} from "./HTMLGenerator.js";
import {TreeBuilder} from "../lib/TreeBuilder.js";
import {TreeWalker} from "./TreeWalker.js";

/**
 * API for MarkdownConverter
 */
export class MarkdownConverter {

    /**
     * Converts markdown to HTML
     *
     * @param markdown the markdown
     * @returns the HTML
     */
    static convertToHtml(markdown) {
        const treeWalker = new TreeWalker(new HTMLGenerator());
        return this.nodeIterator(markdown)
            .map(node => treeWalker.convertTree(node))
            .reduce((text, block) => text + "\n" + block);
    }

    /**
     * Returns the document tree for the markdown
     *
     * @param markdown the markdown
     * @returns the node of the document with type {@link NODE_TYPE.ROOT}
     */
    static documentTree(markdown) {
        return new TreeBuilder(markdown).buildDocumentTree();
    }

    /**
     * Returns a {@link ReadableStream} of nodes
     *
     * @param markdown the markdown
     * @returns the {@link ReadableStream}
     */
    static nodeStream(markdown) {
        return ReadableStream.from(MarkdownConverter.nodeIterator(markdown));
    }

    /**
     * Returns an {@link IteratorObject} for block nodes from markdown
     *
     * @param markdown the markdown
     * @returns the {@link IteratorObject}
     */
    static nodeIterator(markdown) {
        const treeBuilder = new TreeBuilder(markdown);
        return Iterator.from({
            [Symbol.iterator]() {
                return this;
            },
            next() {
                if (treeBuilder.hasBlock()) {
                    return {
                        done: false,
                        value: treeBuilder.nextBlock()
                    }
                }
                return {
                    done: true
                };
            }
        });
    }

}
