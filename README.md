Bug Reports (GitHub Issues) Quality Checker.

The quality of bug reports is paramount for the overall quality of a software project:
[poorly formulated bug reports](https://www.yegor256.com/2018/04/24/right-way-to-report-bugs.html) often lead to wasted time,
programmers frustration, and delays.
This repository is a [Github Action](https://github.com/features/actions) that would trigger
on every new issue submitted, check that issue for quality problems, 
and report them in the issue as a comment, asking bug reporter to fix the report.

// status badges, action version

### How to use

Consider this configuration:
```yml
name: reports-check
on:
 issues:
   types: [opened, edited]
jobs:
  check:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4
      - uses: tracehubpm/reports-check-action@latest
        with:
          openai_token: ${{ secrets.OPENAI_TOKEN }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

### Configurations

Quality checker can be configured the way you want.
These are the parameters you can use/override:

* `openai_token`: Open AI API key, you can obtain it [here](https://platform.openai.com/api-keys).
* `github_token`: GitHub token to post messages in the issue's comments.
* `openai_model`: Open AI ChatGPT model, the default one is `gpt-4`.

### Evaluation Quality Rules

### How to contribute

Fork repository, make changes, send us a [pull request](https://www.yegor256.com/2014/04/15/github-guidelines.html).
We will review your changes and apply them to the `master` branch shortly,
provided they don't violate our quality standards. To avoid frustration,
before sending us your pull request please run full build:

```bash
$ npm install
$ npm run gha
```
