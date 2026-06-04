import {HTMLGenerator} from "./HTMLGenerator";
import {TreeBuilder} from "./TreeBuilder";
import {TreeWalker} from "./TreeWalker";

export class HTMLConverter {

    convert(markdown) {
        const tree = new TreeBuilder().buildTree(markdown);
        return new TreeWalker(new HTMLGenerator()).traverseTree(tree);
    }

}
