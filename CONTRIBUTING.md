# Contributing

We follow the [nteract CONTRIBUTING.md](https://raw.githubusercontent.com/nteract/nteract/main/CONTRIBUTING.md) processes. If you
have any difficulty, please let us know. Happy Contributing :smile:

## Local Development

For expedited development, you can run:

```bash
yarn install
yarn styleguide
```

The data explorer documentation will be run live locally on `http://localhost:6060/`, and you can experiment with the settings and data.

Now you are ready to contribute :tada: !

## Commit messages

This project uses [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) guidelines for writing commit messages. After you make your change, run this command for an interactive prompt.

```bash
yarn run commit
```

Consistent formatting allows us to keep the [changelog](./CHANGELOG.md) up to date automatically, and ensures future developers have a readable timeline of changes over time. For more information, see the [commitizen project page](https://github.com/commitizen/cz-cli).
