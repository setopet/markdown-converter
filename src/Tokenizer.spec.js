import {TOKEN_TYPE, Tokenizer} from "./Tokenizer";

const tokenizer = () => new Tokenizer();

test("tokenize empty", () => {
    expect(tokenizer().tokenizeMarkdown("")).toStrictEqual([{
        type: TOKEN_TYPE.START
    },
        {
            type: TOKEN_TYPE.END
        }]);
})

test("tokenize hash tag", () => {
    expect(tokenizer().tokenizeMarkdown("#word")).toContainEqual({
        type: TOKEN_TYPE.WORD,
        value: [...'#word']
    })
})

test("tokenize headline start", () => {
    expect(tokenizer().tokenizeMarkdown("## word")).toContainEqual({
        type: TOKEN_TYPE.HEADLINE_START,
        level: 2
    })
})

test("tokenize headline start with white space", () => {
    expect(tokenizer().tokenizeMarkdown(" ## word")).toContainEqual({
        type: TOKEN_TYPE.HEADLINE_START,
        level: 2
    });
});

test("tokenize hash tag to hash tag", () => {
    expect(tokenizer().tokenizeMarkdown("a## #word")).toContainEqual({
        type: TOKEN_TYPE.WORD,
        value: [...'a##']
    })
})

test("tokenize list element", () => {
    expect(tokenizer().tokenizeMarkdown("- word")).toContainEqual({
        type: TOKEN_TYPE.LIST_ELEMENT,
        level: 0
    })
})

test("tokenize list element with indentation", () => {
    expect(tokenizer().tokenizeMarkdown("  - word")).toContainEqual({
        type: TOKEN_TYPE.LIST_ELEMENT,
        level: 2
    })
})

test("tokenize dash", () => {
    expect(tokenizer().tokenizeMarkdown(" -word")).toContainEqual({
        type: TOKEN_TYPE.WORD,
        value: [...'-word']
    })
})