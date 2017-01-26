module.exports = () => ({
  plugins: [
    require('postcss-simple-vars')({
      variables: () => require('graphcool-styles/dist/variables/variables.js'),
    }),
    require('postcss-cssnext')(),
    require('postcss-inherit')({
      globalStyles: 'node_modules/graphcool-styles/dist/styles.css'
    }),
  ]
})
