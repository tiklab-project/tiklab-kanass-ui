
/**
 * @name: rollup.config
 * @author mahai
 * @date 2022/7/8 1:07 PM
 * @description rollup.config
 */
 import fs from 'fs';
 import path from 'path';
 import commonPlugins from "./scripts/commonPlugins";
 
 const pkg = require("./package.json");
 
 const IS_DEV = process.env.NODE_ENV === "development"
 const BABEL_ENV = process.env.BABEL_ENV || 'umd';
 
 const getFiles = (entry, extensions=[], excludeExtensions = []) => {
     let fileNames = [];
     const dirs = fs.readdirSync(entry);
     dirs.forEach((dir) => {
         const path = `${entry}/${dir}`;
         if (fs.lstatSync(path).isDirectory()) {
             fileNames = [
                 ...fileNames,
                 ...getFiles(path, extensions, excludeExtensions),
             ];
 
             return;
         }
         if (!excludeExtensions.some((exclude) => dir.endsWith(exclude))
             && extensions.some((ext) => dir.endsWith(ext))
         ) {
             fileNames.push(path);
         }
     });
     return fileNames;
 }
 const globals = {
     react: 'React',
     'react-dom': 'ReactDOM',
     antd:"antd",
     'react-i18next':'reactI18next',
     "tiklab-core-ui":"tiklabCoreUi",
     "@ant-design/icons":"icons",
     "tiklab-plugin-ui":"tiklabPluginUi",
     "tiklab-form-ui":"tiklabFormUi",
     "tiklab-privilege-ui":"tiklabPrivilegeUi",
     "tiklab-user-ui":"tiklabUserUi",
     "tiklab-slate-ui":"tiklabSlateUi",
     'mobx-react':'mobxReact',
     'mobx':'mobx',
     "react-router-dom":"reactRouterDom"
 };
 
 
 const extensions = ['.js', '.jsx',]

 const esOutput = {
     globals,
     preserveModules: true,
     preserveModulesRoot: 'components',
     exports: 'named',
     assetFileNames: ({name}) => {
         console.log(name)
         const {ext, dir, base} = path.parse(name);
         if (ext !== '.css') return '[name].[ext]';
         // 规范 style 的输出格式
         return path.join(dir, 'style', base);
     },
 }
 
 const external = Object.keys(pkg.peerDependencies || {}).concat('react-dom')
 
 export default () => {
     switch (BABEL_ENV) {
         case "esm":
             return {
                 input: [
                     'src/ui.js',
                     ...getFiles('./src', extensions),
                 ],
                 output: { ...esOutput, dir: 'es', format: 'es', sourcemap: IS_DEV},
                 external,
                 plugins: [ ...commonPlugins]
             };
         default:
             return [];
    }
 }
 