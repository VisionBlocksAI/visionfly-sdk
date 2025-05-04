import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";

const createConfig = (input, output) => ({
  input,
  output: [
    { file: `dist/${output}.js`, format: "cjs" },
    { file: `dist/${output}.esm.js`, format: "es" },
  ],
  external: ["react", "react-dom", "next"],
  plugins: [
    resolve(),
    commonjs(),
    babel({ babelHelpers: "bundled" }),
    terser(),
  ],
});

export default [
  createConfig("src/visionfly-core.js", "index"),
  createConfig("src/visionfly-react.js", "react"),
  createConfig("src/visionfly-next.js", "next"),
];
