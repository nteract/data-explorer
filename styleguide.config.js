module.exports = {
    components: 'src/**/[A-Z]*.{ts,tsx}',
    propsParser: require('react-docgen-typescript').withCustomConfig(
        './tsconfig.json'
    ).parse
}