module.exports = {
  plugins: [
    require('postcss-import')({
      filter(name) {
        if (name.endsWith('.config.css')) {
          return true
        }
        return false
      },
    }),
    require('postcss-apply')(),
    require('postcss-calc')(),
    require('postcss-custom-media')(),
    require('postcss-custom-properties')({
      preserve: false,
    }),
    require('postcss-custom-selectors')(),
    require('postcss-media-minmax')(),
    require('postcss-nesting')(),
  ],
}
