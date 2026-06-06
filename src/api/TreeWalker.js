import {HTMLGenerator} from "./HTMLGenerator.js";
import {NODE_TYPE} from "./TreeModel.js";

export class TreeWalker {

    constructor(generator = new HTMLGenerator()) {
        this.generator = generator;
    }

    convertTree(node) {
        let text;
        switch (node.type) {
            case NODE_TYPE.ROOT:
                return node.children.map(child => this.convertTree(child)).join('\n');
            case NODE_TYPE.HEADLINE:
                text = node.children.map(child => this.convertTree(child)).join(' ');
                return this.generator.generateHeadline(text, node.level);
            case NODE_TYPE.PARAGRAPH:
                text = node.children.map(child => this.convertTree(child)).join(' ');
                return this.generator.generateParagraph(text);
            case NODE_TYPE.TEXT:
                text = node.value.join('');
                return text;
            case NODE_TYPE.STRONG:
                return this.generator.generateBold(node.children.map(child => this.convertTree(child)).join(' '));
            case NODE_TYPE.ITALICS:
                return this.generator.generateItalics(node.children.map(child => this.convertTree(child)).join(' '));
            default:
                throw new Error(`Unexpected node type ${node.type}`);
        }
    }

}
