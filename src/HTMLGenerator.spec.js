import {HTMLGenerator} from "./HTMLGenerator";

const generator = new HTMLGenerator();

test("generate paragraph", () => {
    expect(generator.generateParagraph("text")).toBe("<p>text</p>");
})

test("generate heading", () => {
    expect(generator.generateHeadline("heading", 6)).toBe("<h6>heading</h6>");
})

test("attempt generate heading >h6", () => {
    expect(() => generator.generateHeadline("heading", 7)).toThrow();
})

test("generate bold", () => {
    expect(generator.generateBold("bold")).toBe("<b>bold</b>");
})

test("generate italics", () => {
    expect(generator.generateItalics("italics")).toBe("<i>italics</i>");
})