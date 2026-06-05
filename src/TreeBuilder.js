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

    BUILDER_STATE = {
        FINISHED_BLOCK: "FINISHED_BLOCK",
        READING_BLOCK: "READING_BLOCK",
    }

    constructor(tokenizer = new Tokenizer()) {
        this.tokenizer = tokenizer;
    }

    buildTree(markdown) {
        const tokens = this.tokenizer.tokenizeMarkdown(markdown);
        let position = 0;
        const root = {
            type: NODE_TYPE.ROOT,
            children: []
        }
        const stack = [root];
        let delimiterStack = [];
        let state;
        while (position < tokens.length) {
            const token = tokens[position];
            const tokenType = token.type;
            switch (tokenType) {
                case TOKEN_TYPE.START:
                case TOKEN_TYPE.WHITE_SPACE:
                case TOKEN_TYPE.END:
                    break;
                case TOKEN_TYPE.BLOCK_START:
                    state = this.BUILDER_STATE.FINISHED_BLOCK;
                    break;
                case TOKEN_TYPE.BLOCK_END:
                    state = this.BUILDER_STATE.FINISHED_BLOCK;
                    const nodeType = stack.at(-1).type;
                    if (nodeType === NODE_TYPE.PARAGRAPH || nodeType === NODE_TYPE.HEADLINE) {
                        stack.pop();
                    }
                    delimiterStack = [];
                    break;
                case TOKEN_TYPE.HEADLINE_START:
                    const node = {
                        type: NODE_TYPE.HEADLINE,
                        level: token.level,
                        children: [],
                        value: []
                    };
                    state = this.BUILDER_STATE.READING_BLOCK;
                    stack.at(-1).children.push(node);
                    stack.push(node);
                    break;
                case TOKEN_TYPE.STAR:
                    const lastDelimiter = delimiterStack.at(-1);
                    if (lastDelimiter && lastDelimiter.token.type === TOKEN_TYPE.STAR && lastDelimiter.token.level === token.level) {
                        delimiterStack.pop();
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
                        const currentPosition = stack.at(-1).children.length;
                        const matchingPosition = lastDelimiter.position;
                        for (let i = currentPosition;  i > matchingPosition; i--) {
                            let node = stack.at(-1).children.pop();
                            inlineNode.children.unshift(node);
                        }
                        stack.at(-1).children.push(inlineNode);
                        break;
                    } else {
                        delimiterStack.push({
                            token: token,
                            position: stack.at(-1).children.length
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
                    if (state === this.BUILDER_STATE.FINISHED_BLOCK) {
                        const node = {
                            type: NODE_TYPE.PARAGRAPH,
                            children: [
                                textNode
                            ]
                        }
                        state = this.BUILDER_STATE.READING_BLOCK;
                        stack.at(-1).children.push(node);
                        stack.push(node);
                    } else {
                        stack.at(-1).children.push(textNode);
                    }
                    break;
                default:
                    throw new Error(`Unknown token type ${tokenType}`);
            }
            position++;
        }
        return root;
    }

}
