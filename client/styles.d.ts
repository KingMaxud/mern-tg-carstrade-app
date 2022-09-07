// For CSS
declare module '*.module.css' {
   const classes: { [key: string]: string }
   export default classes
}

// For SCSS
declare module '*.module.scss' {
   const classes: { [key: string]: string }
   export default classes
}

// For SVG
declare module '*.svg' {
   const content: any
   export = content
}

// For JPG
declare module '*.jpg' {
   const value: any
   export = value
}
