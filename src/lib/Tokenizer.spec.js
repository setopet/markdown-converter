import {TOKEN_TYPE, Tokenizer} from "./Tokenizer.js";


test("tokenize empty", () => {
    expect(new Tokenizer("").tokenizeMarkdown()).toStrictEqual([
        {type: TOKEN_TYPE.BLOCK_START},
        {type: TOKEN_TYPE.BLOCK_END},
        ]);
})

test("tokenize hash tag", () => {
    expect(new Tokenizer("#word").tokenizeMarkdown()).toContainEqual({
        type: TOKEN_TYPE.WORD,
        value: [...'#word']
    });
})

test("tokenize headline start", () => {
    expect(new Tokenizer("## word").tokenizeMarkdown()).toContainEqual({
        type: TOKEN_TYPE.HEADLINE_START,
        level: 2
    });
})

test("tokenize headline start with white space", () => {
    expect(new Tokenizer(" ## word").tokenizeMarkdown()).toContainEqual({
        type: TOKEN_TYPE.HEADLINE_START,
        level: 2
    });
});

test("tokenize hash tag to hash tag", () => {
    expect(new Tokenizer("a## #word").tokenizeMarkdown()).toContainEqual({
        type: TOKEN_TYPE.WORD,
        value: [...'a##']
    })
})

test("tokenize list element", () => {
    expect(new Tokenizer("- word").tokenizeMarkdown()).toContainEqual({
        type: TOKEN_TYPE.LIST_ELEMENT,
        level: 0
    })
})

test("tokenize list element with indentation", () => {
    expect(new Tokenizer("  - word").tokenizeMarkdown()).toContainEqual({
        type: TOKEN_TYPE.LIST_ELEMENT,
        level: 2
    })
})

test("tokenize dash", () => {
    expect(new Tokenizer(" -word").tokenizeMarkdown()).toContainEqual({
        type: TOKEN_TYPE.WORD,
        value: [...'-word']
    })
})