import {HTMLConverter} from "./HTMLConverter";

const markDownConverter = new HTMLConverter();

test("convert null", () => {
    expect(markDownConverter.convert(null)).toBe("");
})

test("convert normal text", () => {
    expect(markDownConverter.convert("normal text")).toBe("<p>normal text</p>");
})

test("convert two paragraphs", () => {
    expect(markDownConverter.convert("one text\nsecond text")).toBe("<p>one text</p>\n<p>second text</p>");
})

test("convert headline", () => {
    expect(markDownConverter.convert("# This is a headline")).toBe("<h1>This is a headline</h1>");
});

test("convert headline and paragraph", () => {
    expect(markDownConverter.convert("# This is a headline\nThis is a paragraph")).toBe("<h1>This is a headline</h1>\n<p>This is a paragraph</p>");
});

test("convert headline level 2", () => {
    expect(markDownConverter.convert("## This is a second level headline")).toBe("<h2>This is a second level headline</h2>");
});

test("convert headline level 6", () => {
    expect(markDownConverter.convert("###### This is a sixth level headline")).toBe("<h6>This is a sixth level headline</h6>");
});

test("throw error on headline level 7", () => {
    expect(() => markDownConverter.convert("####### This is a seventh level headline")).toThrow();
});

test("convert italics", () => {
    expect(markDownConverter.convert("*this is italics* text")).toBe("<p><i>this is italics</i> text</p>");
})

test("convert bold", () => {
    expect(markDownConverter.convert("**this is bold** text")).toBe("<p><b>this is bold</b> text</p>");
})

test("convert nested formats", () => {
    expect(markDownConverter.convert("**this is bold and *this is also italics* **")).toBe("<p><b>this is bold and <i>this is also italics</i> </b></p>");
})

// TODO next:
/*
test("convert link", () => {
  expect(markDownConverter.convert("this: [is a link](http://localhost:8080) and text")).toBe("this: <a href='http://localhost:8080'>is a link</a> and text");
})
*/
