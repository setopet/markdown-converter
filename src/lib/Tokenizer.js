export const TOKEN_TYPE = {
    BLOCK_START: "BLOCK_START",
    BLOCK_END: "BLOCK_END",
    WORD: "WORD",
    WHITE_SPACE: "WHITE_SPACE",
    HEADLINE_START: "HEADLINE_START",
    LIST_ELEMENT: "LIST_ELEMENT",
    STAR: "STAR"
}

export class Tokenizer {

    AT_START = -1;

    state = {
        position: this.AT_START,
        markdown: "",
        lastToken: undefined
    }

    constructor(markdown) {
        this.state.markdown = markdown ?? "";
    }

    nextToken() {
        if (this.state.position === this.AT_START) {
            this.state.position++;
            return this.setAndReturnToken({
                type: TOKEN_TYPE.BLOCK_START
            });
        } else if (this.state.position === this.state.markdown.length) {
            this.state.position++;
            return this.setAndReturnToken({
                type: TOKEN_TYPE.BLOCK_END,
            });
        } else if (!this.hasNextToken()) {
            throw new Error("No more tokens available");
        } else {
            return this.nextTokenFromChar(this.moveToNextChar());
        }
    }

    tokenizeMarkdown() {
        const tokens = [];
        while (this.hasNextToken()) {
            tokens.push(this.nextToken());
        }
        return tokens;
    }

    hasNextToken() {
        return this.state.position <= this.state.markdown.length;
    }

    moveToNextChar() {
        const char = this.nextChar();
        if (!char) {
            return null;
        } else {
            this.state.position++;
            return char;
        }
    }

    nextChar() {
        return this.charAt(this.state.position);
    }

    charAt(index) {
        if (index >= this.state.markdown.length) {
            return null;
        } else {
            return this.state.markdown.charAt(index);
        }
    }

    toWordToken(char) {
        const word = [char];
        let character = this.nextChar();
        while (character && character !== ' ' && character !== "\n" && character !== "-" && character !== "*") {
            word.push(character);
            this.moveToNextChar();
            character = this.nextChar();
        }
        return this.setAndReturnToken({
            type: TOKEN_TYPE.WORD,
            value: word
        });
    }

    setAndReturnToken(token) {
        this.state.lastToken = token;
        return token;
    }

    nextTokenFromChar(char) {
        const lastToken = this.state.lastToken;

        if (lastToken.type === TOKEN_TYPE.BLOCK_END) {
            this.state.position--;
            return this.setAndReturnToken({
                type: TOKEN_TYPE.BLOCK_START,
            });
        }

        let token;

        switch (char) {
            case ' ':
                token = ({
                    type: TOKEN_TYPE.WHITE_SPACE,
                    level: 1,
                    value: ' ',
                    isIndentation: lastToken.type === TOKEN_TYPE.BLOCK_START
                });
                while (this.nextChar() === ' ') {
                    token.level++;
                    this.moveToNextChar();
                }
                return this.setAndReturnToken(token);
            case '\n':
                return this.setAndReturnToken({
                    type: TOKEN_TYPE.BLOCK_END
                });
            case '#':
                if (lastToken.type === TOKEN_TYPE.BLOCK_START || (lastToken.type === TOKEN_TYPE.WHITE_SPACE && lastToken.isIndentation)) {
                    let headlineLevel = 1;
                    let index = this.state.position;
                    for (let nextChar = this.charAt(index); nextChar === '#'; nextChar = this.charAt(index)) {
                        headlineLevel++;
                        index++;
                    }
                    if (this.charAt(index) === ' ') {
                        this.state.position += headlineLevel;
                        return this.setAndReturnToken({
                            type: TOKEN_TYPE.HEADLINE_START,
                            level: headlineLevel
                        });
                    }
                }
                return this.toWordToken(char);
            case '-':
                if (this.nextChar() === ' ') {
                    this.moveToNextChar();
                    if (lastToken.type === TOKEN_TYPE.BLOCK_START) {
                        return this.setAndReturnToken({
                            type: TOKEN_TYPE.LIST_ELEMENT,
                            level: 0
                        });
                    } else if (lastToken.type === TOKEN_TYPE.WHITE_SPACE && lastToken.isIndentation) {
                        return this.setAndReturnToken({
                            type: TOKEN_TYPE.LIST_ELEMENT,
                            level: lastToken.level
                        });
                    }
                }
                return this.toWordToken(char);
            case '*':
                token = {
                    type: TOKEN_TYPE.STAR,
                    level: 1,
                    value: '*'
                };
                while (this.nextChar() === '*') {
                    this.moveToNextChar();
                    token.level++;
                }
                return this.setAndReturnToken(token);
            default:
                return this.toWordToken(char);
        }
    }

}