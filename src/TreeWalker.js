import {NODE_TYPE} from "./TreeBuilder";
import {HTMLGenerator} from "./HTMLGenerator";

export class TreeWalker {

    constructor(generator = new HTMLGenerator()) {
        this.generator = generator;
    }

    traverseTree(node) {
        let text;
        switch (node.type) {
            case NODE_TYPE.ROOT:
                return node.children.map(child => this.traverseTree(child)).join('\n');
            case NODE_TYPE.HEADLINE:
                text = node.children.map(child => this.traverseTree(child)).join(' ');
                return this.generator.generateHeadline(text, node.level);
            case NODE_TYPE.PARAGRAPH:
                text = node.children.map(child => this.traverseTree(child)).join(' ');
                return this.generator.generateParagraph(text);
            case NODE_TYPE.TEXT:
                text = node.value.join('');
                return text;
            case NODE_TYPE.STRONG:
                return this.generator.generateBold(node.children.map(child => this.traverseTree(child)).join(' '));
            case NODE_TYPE.ITALICS:
                return this.generator.generateItalics(node.children.map(child => this.traverseTree(child)).join(' '));
            default:
                throw new Error(`Unexpected node type ${node.type}`);
        }
    }

}
