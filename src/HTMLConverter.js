import {HTMLGenerator} from "./HTMLGenerator";
import {TreeBuilder} from "./TreeBuilder";
import {TreeWalker} from "./TreeWalker";

export class HTMLConverter {

    convert(markdown) {
        const tree = new TreeBuilder(markdown).buildDocumentTree();
        return new TreeWalker(new HTMLGenerator()).convertTree(tree);
    }

}
