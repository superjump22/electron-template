import { resolve, sep } from 'path';

export default {
  '*': 'prettier --ignore-unknown --write',
  '*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue}': 'eslint',
  /**
   * Run typechecking if any type-sensitive files or project dependencies was changed
   * @param {string[]} filenames
   * @return {string[]}
   */
  '{package-lock.json,packages/**/{*.ts,*.mts,*.cts,*.tsx,*.vue,tsconfig.json}}': ({
    filenames,
  }) => {
    // if dependencies was changed run type checking for all packages
    if (filenames.some(f => f.endsWith('package-lock.json'))) {
      return ['npm run typecheck --if-present'];
    }

    // else run type checking for staged packages
    const fileNameToPackageName = filename =>
      filename.replace(resolve(process.cwd(), 'packages') + sep, '').split(sep)[0];
    return [...new Set(filenames.map(fileNameToPackageName))].map(
      p => `npm run typecheck:${p} --if-present`,
    );
  },
};
