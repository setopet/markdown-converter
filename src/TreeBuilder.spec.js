import {NODE_TYPE, TreeBuilder} from "./TreeBuilder";

const treeBuilder = new TreeBuilder();

export const exampleTree =
    {
        type: NODE_TYPE.ROOT,
        children: [
            {
                type: NODE_TYPE.HEADLINE,
                level: 1,
                children: [{
                    type: NODE_TYPE.TEXT,
                    value: [..."headline"],
                    children: []
                }],
                value: []
            },
            {
                type: NODE_TYPE.PARAGRAPH,
                children: [
                    {
                        type: NODE_TYPE.TEXT,
                        value: [..."paragraph"],
                        children: []
                    },
                    {
                        type: NODE_TYPE.STRONG,
                        children: [{
                            type: NODE_TYPE.TEXT,
                            value: [..."bold"],
                            children: []
                        },
                            {
                                type: NODE_TYPE.TEXT,
                                value: [..."also"],
                                children: []
                            },
                            {
                                type: NODE_TYPE.ITALICS,
                                children: [{
                                    type: NODE_TYPE.TEXT,
                                    value: [..."italics"],
                                    children: []
                                }]
                            },
                            {
                                type: NODE_TYPE.TEXT,
                                value: [..."bold"],
                                children: []
                            }
                        ]
                    }
                ]
            }
        ]
    }

test("build tree", () => {
    expect(treeBuilder.buildTree("# headline\nparagraph **bold also *italics* bold**")).toEqual(
        exampleTree
    )
})
