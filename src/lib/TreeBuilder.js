import {TOKEN_TYPE, Tokenizer} from "./Tokenizer.js";
import {NODE_TYPE} from "../api/TreeModel.js";

export class TreeBuilder {

    FLAGS = {
        READING_BLOCK: "READING_BLOCK",
        NEW_BLOCK: "NEW_BLOCK",
    }

    root = {
        type: NODE_TYPE.ROOT,
        children: []
    };

    state = {
        position: 0,
        nodeStack: [this.root],
        delimiterStack: [],
        flag: this.FLAGS.NEW_BLOCK,
        tokenizer: undefined
    }

    constructor(markdown) {
        this.state.tokenizer = new Tokenizer(markdown);
    }

    hasBlock() {
        return this.state.tokenizer.hasNextToken();
    }

    /**
     * Returns the node for the next markdown block
     */
    nextBlock() {
        if(!this.hasBlock()) {
            throw new Error("No more nodes available");
        }
        return this.readBlockNode();
    }

    buildDocumentTree() {
        while (this.hasBlock()) {
            this.nextBlock();
        }
        return this.root;
    }

    readBlockNode() {
        const tokenizer = this.state.tokenizer;
        while (tokenizer.hasNextToken()) {
            const token = tokenizer.nextToken();
            const tokenType = token.type;
            switch (tokenType) {
                case TOKEN_TYPE.WHITE_SPACE:
                    break;
                case TOKEN_TYPE.BLOCK_START:
                    this.state.flag = this.FLAGS.NEW_BLOCK;
                    break;
                case TOKEN_TYPE.BLOCK_END:
                    const nodeType = this.state.nodeStack.at(-1).type;
                    this.state.delimiterStack = [];
                    if (nodeType === NODE_TYPE.PARAGRAPH || nodeType === NODE_TYPE.HEADLINE) {
                        return this.state.nodeStack.pop();
                    } else if (nodeType === NODE_TYPE.ROOT) {
                        const emptyTextNode = {
                            type: NODE_TYPE.TEXT,
                            value: [],
                            children: []
                        }
                        this.root.children.push(emptyTextNode);
                        return emptyTextNode;
                    } else {
                        throw new Error("Unrecognized block node " + nodeType);
                    }
                case TOKEN_TYPE.HEADLINE_START:
                    const node = {
                        type: NODE_TYPE.HEADLINE,
                        level: token.level,
                        children: [],
                        value: []
                    };
                    this.state.flag = this.FLAGS.READING_BLOCK;
                    this.state.nodeStack.at(-1).children.push(node);
                    this.state.nodeStack.push(node);
                    break;
                case TOKEN_TYPE.STAR:
                    const lastDelimiter = this.state.delimiterStack.at(-1);
                    if (lastDelimiter && lastDelimiter.token.type === TOKEN_TYPE.STAR && lastDelimiter.token.level === token.level) {
                        this.state.delimiterStack.pop();
                        let inlineType;
                        if (token.level === 1) {
                            inlineType = NODE_TYPE.ITALICS
                        } else {
                            inlineType = NODE_TYPE.STRONG;
                        }
                        const inlineNode = {
                            type: inlineType,
                            children: []
                        };
                        const currentPosition = this.state.nodeStack.at(-1).children.length;
                        const matchingPosition = lastDelimiter.position;
                        for (let i = currentPosition; i > matchingPosition; i--) {
                            let node = this.state.nodeStack.at(-1).children.pop();
                            inlineNode.children.unshift(node);
                        }
                        this.state.nodeStack.at(-1).children.push(inlineNode);
                        break;
                    } else {
                        this.state.delimiterStack.push({
                            token: token,
                            position: this.state.nodeStack.at(-1).children.length
                        });
                        break;
                    }
                case TOKEN_TYPE.WORD:
                    const textNode =
                        {
                            type: NODE_TYPE.TEXT,
                            children: [],
                            value: [...token.value]
                        }
                    if (this.state.flag === this.FLAGS.NEW_BLOCK) {
                        const node = {
                            type: NODE_TYPE.PARAGRAPH,
                            children: [
                                textNode
                            ]
                        }
                        this.state.flag = this.FLAGS.READING_BLOCK;
                        this.state.nodeStack.at(-1).children.push(node);
                        this.state.nodeStack.push(node);
                    } else {
                        this.state.nodeStack.at(-1).children.push(textNode);
                    }
                    break;
                default:
                    throw new Error(`Unknown token type ${tokenType}`);
            }
            this.state.position++;
        }
    }

}
