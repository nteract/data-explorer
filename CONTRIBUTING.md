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

## How Publishing works

## Publishing

Publishing is handled by a 2-branch [pre-release process](https://intuit.github.io/auto/docs/generated/shipit#next-branch-default), configured in `release.yml`. All changes should be based off of the default `next` branch. Changes are published when a `release` tag is included on the PR.

- To prevent a change from creating a release, use the `skip-release` label.
- PRs made into the default branch are deployed to the `next` pre-release tag on NPM. The result can be installed with `npm install @nteract/data-explorer@next`.
  - When merging into `next`, please use the `create a merge commit` strategy. If `rebase` is used, auto won't be able to detect which PR introduced a particular set of commits..
- To release a new stable version, open a PR from `next` into `stable` using this [compare link](https://github.com/nteract/data-explorer/compare/stable...next).
  - When merging from `next` into `stable`, please use the `create a merge commit` strategy.
