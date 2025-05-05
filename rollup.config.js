import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";

const createConfig = (input, output, external = []) => ({
  input,
  output: [
    {
      file: output.replace(".esm.js", ".js"),
      format: "cjs",
      sourcemap: true,
    },
    {
      file: output,
      format: "esm",
      sourcemap: true,
    },
  ],
  external,
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-react"],
      extensions: [".js", ".jsx"],
    }),
    terser(),
  ],
});

export default [
  // Core SDK
  createConfig("src/visionfly-core.js", "dist/index.esm.js"),
  // React SDK
  createConfig("src/visionfly-react.jsx", "dist/react.esm.js", [
    "react",
    "react-dom",
  ]),
];
