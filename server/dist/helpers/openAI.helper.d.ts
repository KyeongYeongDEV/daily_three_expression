declare const functions: {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            expressions: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        category: {
                            type: string;
                        };
                        expression: {
                            type: string;
                        };
                        example1: {
                            type: string;
                        };
                        example2: {
                            type: string;
                        };
                        translation_expression: {
                            type: string;
                        };
                        translation_example1: {
                            type: string;
                        };
                        translation_example2: {
                            type: string;
                        };
                    };
                    required: string[];
                };
            };
        };
        required: string[];
    };
}[];
export { functions };
