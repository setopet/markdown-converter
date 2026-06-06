import {TOKEN_TYPE, Tokenizer} from "./Tokenizer";

export const NODE_TYPE = {
    ROOT: "ROOT",
    HEADLINE: "HEADLINE",
    PARAGRAPH: "PARAGRAPH",
    TEXT: "TEXT",
    STRONG: "STRONG",
    ITALICS: "ITALICS",
}

export class TreeBuilder {

    FLAGS = {
        READING_BLOCK: "READING_BLOCK",
        NEW_BLOCK: "NEW_BLOCK",
    }

    constructor(tokenizer = new Tokenizer()) {
        this.tokenizer = tokenizer;
    }

    buildTree(markdown) {
        const tokens = this.tokenizer.tokenizeMarkdown(markdown);
        const root = {
            type: NODE_TYPE.ROOT,
            children: []
        }
        const state = {
            position: 0,
            nodeStack: [root],
            delimiterStack: [],
            flag: this.FLAGS.NEW_BLOCK
        }
        while (state.position < tokens.length) {
            const token = tokens[state.position];
            const tokenType = token.type;
            switch (tokenType) {
                case TOKEN_TYPE.START:
                case TOKEN_TYPE.WHITE_SPACE:
                case TOKEN_TYPE.END:
                    break;
                case TOKEN_TYPE.BLOCK_START:
                    state.flag = this.FLAGS.NEW_BLOCK;
                    break;
                case TOKEN_TYPE.BLOCK_END:
                    const nodeType = state.nodeStack.at(-1).type;
                    if (nodeType === NODE_TYPE.PARAGRAPH || nodeType === NODE_TYPE.HEADLINE) {
                        state.nodeStack.pop();
                    }
                    state.delimiterStack = [];
                    break;
                case TOKEN_TYPE.HEADLINE_START:
                    const node = {
                        type: NODE_TYPE.HEADLINE,
                        level: token.level,
                        children: [],
                        value: []
                    };
                    state.flag = this.FLAGS.READING_BLOCK;
                    state.nodeStack.at(-1).children.push(node);
                    state.nodeStack.push(node);
                    break;
                case TOKEN_TYPE.STAR:
                    const lastDelimiter = state.delimiterStack.at(-1);
                    if (lastDelimiter && lastDelimiter.token.type === TOKEN_TYPE.STAR && lastDelimiter.token.level === token.level) {
                        state.delimiterStack.pop();
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
                        const currentPosition = state.nodeStack.at(-1).children.length;
                        const matchingPosition = lastDelimiter.position;
                        for (let i = currentPosition;  i > matchingPosition; i--) {
                            let node = state.nodeStack.at(-1).children.pop();
                            inlineNode.children.unshift(node);
                        }
                        state.nodeStack.at(-1).children.push(inlineNode);
                        break;
                    } else {
                        state.delimiterStack.push({
                            token: token,
                            position: state.nodeStack.at(-1).children.length
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
                    if (state.flag === this.FLAGS.NEW_BLOCK) {
                        const node = {
                            type: NODE_TYPE.PARAGRAPH,
                            children: [
                                textNode
                            ]
                        }
                        state.flag = this.FLAGS.READING_BLOCK;
                        state.nodeStack.at(-1).children.push(node);
                        state.nodeStack.push(node);
                    } else {
                        state.nodeStack.at(-1).children.push(textNode);
                    }
                    break;
                default:
                    throw new Error(`Unknown token type ${tokenType}`);
            }
            state.position++;
        }
        return root;
    }

}
