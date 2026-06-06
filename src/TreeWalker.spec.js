import {exampleTree} from "./TreeBuilder.spec";
import {TreeWalker} from "./TreeWalker";

const walker = new TreeWalker();

test("walk tree", () => {
    expect(walker.convertTree(exampleTree)).toBe("<h1>headline</h1>\n<p>paragraph <b>bold also <i>italics</i> bold</b></p>");
})
