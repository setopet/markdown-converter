export const TOKEN_TYPE = {
    START: "START",
    WORD: "WORD",
    WHITE_SPACE: "WHITE_SPACE",
    LINE_BREAK: "LINE_BREAK",
    END: "END",
    HASH_TAG: "HASH_TAG",
    DASH: "DASH",
    HEADLINE_START: "HEADLINE_START",
    LIST_ELEMENT: "LIST_ELEMENT",
    STAR: "STAR"
}

export class Tokenizer {

    tokenizeMarkdown(markdown) {
        if (!markdown) {
            return [{type: TOKEN_TYPE.START}, {type: TOKEN_TYPE.END}]
        }
        const tokens = [];
        let position = 0;
        tokens.push({
            type: TOKEN_TYPE.START
        });
        while (position < markdown.length) {
            let char = markdown.charAt(position);
            this.tokenize(char, tokens);
            position++;
        }
        this.tokenize(null, tokens);
        return tokens;
    }

    tokenize(char, tokens) {
        switch (char) {
            case ' ':
                if (this.getLastToken(tokens).type === TOKEN_TYPE.WORD) {
                    this.densifyWordToken(char, tokens);
                } else if (this.getLastToken(tokens).type === TOKEN_TYPE.DASH && this.lastTokenIsAtLineStart(tokens)) {
                    tokens.pop();
                    if (this.getLastToken(tokens).type === TOKEN_TYPE.WHITE_SPACE) {
                        const indentation = tokens.pop();
                        tokens.push({
                            type: TOKEN_TYPE.LIST_ELEMENT,
                            level: indentation.level
                        })
                    } else {
                        tokens.push({
                            type: TOKEN_TYPE.LIST_ELEMENT,
                            level: 0
                        })
                    }
                } else if (this.getLastToken(tokens).type === TOKEN_TYPE.HASH_TAG && this.lastTokenIsAtLineStart(tokens)) {
                    const level = tokens.pop().level;
                    tokens.push({
                        type: TOKEN_TYPE.HEADLINE_START,
                        level: level
                    })
                } else if (this.getLastToken(tokens).type === TOKEN_TYPE.WHITE_SPACE) {
                    this.getLastToken(tokens).level++;
                } else {
                    tokens.push({
                        type: TOKEN_TYPE.WHITE_SPACE,
                        level: 1,
                        value: ' '
                    });
                }
                return;
            case '\n':
                tokens.push({
                    type: TOKEN_TYPE.LINE_BREAK
                });
                return;
            case '#':
                if (this.getLastToken(tokens).type === TOKEN_TYPE.HASH_TAG) {
                    this.getLastToken(tokens).level++;
                } else {
                    tokens.push({
                        type: TOKEN_TYPE.HASH_TAG,
                        level: 1,
                        value: '#'
                    })
                }
                return;
            case '-':
                tokens.push({
                    type: TOKEN_TYPE.DASH,
                    value: '-'
                });
                return;
            case null:
                tokens.push({
                    type: TOKEN_TYPE.END,
                });
                return;
            case '*':
                if (this.getLastToken(tokens).type === TOKEN_TYPE.STAR) {
                    this.getLastToken(tokens).level++;
                } else {
                    tokens.push({
                        type: TOKEN_TYPE.STAR,
                        level: 1,
                        value: '*'
                    });
                }
                return;
            default:
                this.densifyWordToken(char, tokens);
        }
    }

    densifyWordToken(char, tokens) {
        if (tokens.at(-1).type === TOKEN_TYPE.WORD) {
            tokens.at(-1).value.push(char);
        } else {
            tokens.push({
                type: TOKEN_TYPE.WORD,
                value: [char]
            })
        }
    }

    getLastToken(tokens) {
        return tokens.at(-1);
    }

    lastTokenIsAtLineStart(tokens) {
        if (tokens.length < 2) {
            return false;
        }
        const beforeLastToken = tokens.at(tokens.length - 2).type;
        if (beforeLastToken === TOKEN_TYPE.START || beforeLastToken === TOKEN_TYPE.LINE_BREAK) {
            return true;
        }
        if (tokens.length > 2) {
            const beforeBeforeLastToken = tokens.at(tokens.length - 3).type
            if (beforeLastToken === TOKEN_TYPE.WHITE_SPACE && (beforeBeforeLastToken === TOKEN_TYPE.LINE_BREAK ||
                beforeBeforeLastToken === TOKEN_TYPE.START)) {
                return true;
            }
        }
        return false;
    }

}