import {MarkdownConverter} from "./MarkdownConverter.js";
import {NODE_TYPE} from "./TreeModel.js";


test("convert null", () => {
    expect(MarkdownConverter.convertToHtml(null)).toBe("");
})

test("convert normal text", () => {
    expect(MarkdownConverter.convertToHtml("normal text")).toBe("<p>normal text</p>");
})

test("convert two paragraphs", () => {
    expect(MarkdownConverter.convertToHtml("one text\nsecond text")).toBe("<p>one text</p>\n<p>second text</p>");
})

test("convert headline", () => {
    expect(MarkdownConverter.convertToHtml("# This is a headline")).toBe("<h1>This is a headline</h1>");
});

test("convert headline and paragraph", () => {
    expect(MarkdownConverter.convertToHtml("# This is a headline\nThis is a paragraph")).toBe("<h1>This is a headline</h1>\n<p>This is a paragraph</p>");
});

test("convert headline level 2", () => {
    expect(MarkdownConverter.convertToHtml("## This is a second level headline")).toBe("<h2>This is a second level headline</h2>");
});

test("convert headline level 6", () => {
    expect(MarkdownConverter.convertToHtml("###### This is a sixth level headline")).toBe("<h6>This is a sixth level headline</h6>");
});

test("throw error on headline level 7", () => {
    expect(() => MarkdownConverter.convertToHtml("####### This is a seventh level headline")).toThrow();
});

test("convert italics", () => {
    expect(MarkdownConverter.convertToHtml("*this is italics* text")).toBe("<p><i>this is italics</i> text</p>");
})

test("convert bold", () => {
    expect(MarkdownConverter.convertToHtml("**this is bold** text")).toBe("<p><b>this is bold</b> text</p>");
})

test("convert nested formats", () => {
    expect(MarkdownConverter.convertToHtml("**this is bold and *this is also italics* bold**")).toBe("<p><b>this is bold and <i>this is also italics</i> bold</b></p>");
})

const exampleTree = [
    {
        type: NODE_TYPE.PARAGRAPH,
        children: [
            {
                type: NODE_TYPE.TEXT,
                children: [],
                value: [..."hello"]
            }
        ]
    }, {
        type: NODE_TYPE.PARAGRAPH,
        children: [
            {
                type: NODE_TYPE.TEXT,
                children: [],
                value: [..."text"]
            }
        ]
    }
]

test("stream nodes", async () => {
    const result = [];
    for await(let node of MarkdownConverter.nodeStream("hello\ntext")) {
       result.push(node);
    }
    expect(result).toEqual(exampleTree)
})

test("build document tree", () => {
    expect(MarkdownConverter.documentTree("hello\ntext")).toEqual({
        type: NODE_TYPE.ROOT,
        children: [
            ...exampleTree
        ]
    })
})

// TODO next:
/*
test("convert link", () => {
  expect(markDownConverter.convert("this: [is a link](http://localhost:8080) and text")).toBe("this: <a href='http://localhost:8080'>is a link</a> and text");
})
*/
