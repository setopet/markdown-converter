export const TOKEN_TYPE = {
    START: "START",
    END: "END",
    BLOCK_START: "BLOCK_START",
    BLOCK_END: "BLOCK_END",
    WORD: "WORD",
    WHITE_SPACE: "WHITE_SPACE",
    HEADLINE_START: "HEADLINE_START",
    LIST_ELEMENT: "LIST_ELEMENT",
    STAR: "STAR"
}

export class Tokenizer {

    position = 0;
    markdown = "";
    tokens = [];

    tokenizeMarkdown(markdown) {
        if (!markdown) {
            return [{type: TOKEN_TYPE.START}, {type: TOKEN_TYPE.END}]
        }
        this.markdown = markdown;
        this.tokens.push({
            type: TOKEN_TYPE.START
        });
        this.tokens.push({
            type: TOKEN_TYPE.BLOCK_START
        })
        for (let char = this.moveToNextChar(); char; char = this.moveToNextChar()) {
            this.nextToken(char, this.tokens);
        }
        this.nextToken(null, this.tokens);
        const result = this.tokens;
        this.tokens = [];
        this.position = 0;
        return result;
    }

    moveToNextChar() {
        const char = this.nextChar();
        if (!char) {
            return null;
        } else {
            this.position++;
            return char;
        }
    }

    nextChar() {
        return this.charAt(this.position);
    }

    charAt(index) {
        if (index >= this.markdown.length) {
            return null;
        } else {
            return this.markdown.charAt(index);
        }
    }

    lastToken() {
        return this.tokens.at(-1);
    }

    toWordToken(char) {
        if (this.tokens.at(-1).type === TOKEN_TYPE.WORD) {
            this.tokens.at(-1).value.push(char);
        } else {
            this.tokens.push({
                type: TOKEN_TYPE.WORD,
                value: [char]
            })
        }
    }

    nextToken(char) {
        const lastToken = this.lastToken(this.tokens);

        switch (char) {
            case ' ':
                if (this.lastToken().type === TOKEN_TYPE.WHITE_SPACE) {
                    this.lastToken().level++;
                } else {
                    this.tokens.push({
                        type: TOKEN_TYPE.WHITE_SPACE,
                        level: 1,
                        value: ' ',
                        isIndentation: this.lastToken(this.tokens).type === TOKEN_TYPE.BLOCK_START
                    });
                }
                return;
            case '\n':
                this.tokens.push({
                    type: TOKEN_TYPE.BLOCK_END
                });
                this.tokens.push({
                    type: TOKEN_TYPE.BLOCK_START,
                })
                return;
            case '#':
                if (lastToken.type === TOKEN_TYPE.BLOCK_START || (lastToken.type === TOKEN_TYPE.WHITE_SPACE && lastToken.isIndentation)) {
                    let headlineLevel = 1;
                    let index = this.position;
                    for (let nextChar = this.charAt(index); nextChar === '#'; nextChar = this.charAt(index)) {
                        headlineLevel++;
                        index++;
                    }
                    if (this.charAt(index) === ' ') {
                        this.position += headlineLevel;
                        this.tokens.push({
                            type: TOKEN_TYPE.HEADLINE_START,
                            level: headlineLevel
                        })
                        return;
                    }
                }
                this.toWordToken(char);
                return;
            case '-':
                if (this.nextChar() === ' ') {
                    this.moveToNextChar();
                    if (lastToken.type === TOKEN_TYPE.BLOCK_START) {
                        this.tokens.push({
                            type: TOKEN_TYPE.LIST_ELEMENT,
                            level: 0
                        });
                        return;
                    } else if (lastToken.type === TOKEN_TYPE.WHITE_SPACE && lastToken.isIndentation) {
                        const indentation = this.tokens.pop();
                        this.tokens.push({
                            type: TOKEN_TYPE.LIST_ELEMENT,
                            level: indentation.level
                        });
                        return;
                    }
                }
                this.toWordToken(char);
                return;
            case null:
                this.tokens.push({
                    type: TOKEN_TYPE.BLOCK_END
                })
                this.tokens.push({
                    type: TOKEN_TYPE.END,
                });
                return;
            case '*':
                if (this.lastToken().type === TOKEN_TYPE.STAR) {
                    this.lastToken().level++;
                } else {
                    this.tokens.push({
                        type: TOKEN_TYPE.STAR,
                        level: 1,
                        value: '*'
                    });
                }
                return;
            default:
                this.toWordToken(char);
        }
    }


}