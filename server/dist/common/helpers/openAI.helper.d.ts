declare const functions: {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            expressions: {
                type: string;
                minItems: number;
                maxItems: number;
                items: {
                    type: string;
                    properties: {
                        category: {
                            type: string;
                            description: string;
                        };
                        expression: {
                            type: string;
                            description: string;
                        };
                        example1: {
                            type: string;
                            description: string;
                        };
                        example2: {
                            type: string;
                            description: string;
                        };
                        translation_expression: {
                            type: string;
                            description: string;
                        };
                        translation_example1: {
                            type: string;
                            description: string;
                        };
                        translation_example2: {
                            type: string;
                            description: string;
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
