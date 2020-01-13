// @format

const path = require("path");

const reactDocgenTypescript = require("react-docgen-typescript").withCustomConfig(
    "./tsconfig.json"
);

const typescriptPropsParser = reactDocgenTypescript.parse;

module.exports = {
    title: "Data Explorer",
    defaultExample: false,
    propsParser: typescriptPropsParser,
    resolver: require("react-docgen").resolver.findAllComponentDefinitions,
    skipComponentsWithoutExample: true,
    exampleMode: "expand",
    usageMode: "expand",
    sections: [
        { name: "Basic Usage", components: "src/components/DataExplorerDefault.tsx" },
        {
            name: "Customized Usage",
            components: "src/components/*.tsx",
            ignore: "src/components/DataExplorerDefault.tsx",
            content: "src/components/customization.md"
        }
    ],
    compilerConfig: {
        // Allow us to use {...props}
        objectAssign: "Object.assign",
        transforms: {
            modules: false,
            // whether template strings get transpiled (we don't want it to, so that we can use the native functionality)
            templateString: false
        }
    },
    template: {
        body: {
            raw: ``
        }
    },
    webpackConfig: {
        node: {
            fs: "empty",
            child_process: "empty",
            net: "empty",
            canvas: "empty"
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
        },
        externals: ["canvas"],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    options: {
                        compilerOptions: {
                            strict: true,
                            jsx: "react",
                            composite: true
                        },
                        projectReferences: true,
                        transpileOnly: true
                    }
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
            ]
        }
    }
};