export enum ArticleState {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export enum YesNo {
  YES = 'yes',
  NO = 'no',
}

export enum HTMLPreference {
  NO = 'no',
  PUG = 'pug',
  POSTHTML = 'posthtml',
  HANDLEBARS = 'handlebars',
}

export enum StylesPreference {
  CSSINJS = 'css-in-js',
  CSSINJSSEPARATE = 'css-in-js-separate-file',
  CSSSEPARATEFILES = 'separate-files',
}

export enum StylesType {
  CSS = 'css',
  SCSS = 'scss',
}

export type Article = {
  date: number;
  type: string;
  url: string;
  image?: string;
  title: string;
  description: string;
  content: string;
  site?: string;
  featured: boolean;
  state: ArticleState;
};

export type FormState = {
  name: string;
  email: string;
  message: string;
};

export type WebpackConfigGeneratorState = {
  id: string;
  jsEntry: string;
  processHTML: YesNo;
  htmlPreference: HTMLPreference;
  processStyles: YesNo;
  stylesPreference: StylesPreference;
  stylesType: StylesType;
  stylesEntry: string;
  processImages: YesNo;
  resolveSize: number;
  imageUrlResolve: boolean;
  imageOptimization: boolean;
  svgOptimization: boolean;
  optimizations: YesNo;
  devServer: YesNo;
  splitChunks: boolean;
  webp: boolean;
  criticalCss: boolean;
  purgeCss: boolean;
};
