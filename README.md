[![EO principles respected here](https://www.elegantobjects.org/badge.svg)](https://www.elegantobjects.org)
[![DevOps By Rultor.com](http://www.rultor.com/b/trarcehubpm/reports-check-action)](http://www.rultor.com/p/tracehubpm/reports-check-action)
[![We recommend IntelliJ IDEA](https://www.elegantobjects.org/intellij-idea.svg)](https://www.jetbrains.com/idea/)

[![node](https://github.com/tracehubpm/reports-check-action/actions/workflows/node.yml/badge.svg)](https://github.com/tracehubpm/reports-check-action/actions/workflows/node.yml)
[![codecov](https://codecov.io/gh/tracehubpm/reports-check-action/graph/badge.svg?token=Wae1wJmXf6)](https://codecov.io/gh/tracehubpm/reports-check-action)
[![release](https://img.shields.io/github/v/release/tracehubpm/reports-check-action.svg?logo=github)](https://github.com/tracehubpm/reports-check-action/releases)
[![Hits-of-Code](https://hitsofcode.com/github/tracehubpm/reports-check-action)](https://hitsofcode.com/view/github/tracehubpm/reports-check-action)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/tracehubpm/reports-check-action/blob/master/LICENSE.txt)

Bug Reports (GitHub Issues) Quality Checker.

**Motivation**.
The quality of bug reports is paramount for the overall quality of a software project:
[poorly formulated bug reports](https://www.yegor256.com/2018/04/24/right-way-to-report-bugs.html) often lead to wasted time,
programmers frustration, and delays.
This repository is a [Github Action](https://github.com/features/actions) that would trigger
on every new issue submitted, check that issue for quality problems, 
and report them in the issue as a comment, asking bug reporter to fix the report.

### How to use

Consider this configuration:
```yml
name: reports-check
on:
 issues:
   types: opened
permissions:
  issues: write
  contents: read
jobs:
  check:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4
      - uses: tracehubpm/reports-check-action@latest
        with:
          openai_token: ${{ secrets.OPENAI_TOKEN }}
          github_token: ${{ secrets.GH_TOKEN }}
```

### Configurations

Quality checker can be configured the way you want.
These are the parameters you can use/override:

* `openai_token`: Open AI API key, you can obtain it [here](https://platform.openai.com/api-keys).
* `github_token`: GitHub token to post messages in the issue's comments.
* `openai_model`: Open AI ChatGPT model, the default one is `gpt-4`.
* `deepinfra_token`: Deep Infra API key, you can obtain it [here](https://deepinfra.com/dash/api_keys).
* `deepinfra_model`: Deep Infra API model, the default one is `Phind/Phind-CodeLlama-34B-v2`,
check out [all available models](https://deepinfra.com/models/text-generation).
* `exclude`: Issue titles to exclude from checking.

### Issues to ignore

You can configure this action to ignore some incoming issues.
To do so, you can use `exclude` and pass to it an array of regular expressions.
Consider this configuration:

```yml
name: reports-check
on:
 issues:
   types: opened
permissions:
  issues: write
  contents: read
jobs:
  check:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4
      - uses: tracehubpm/reports-check-action@latest
        with:
          openai_token: ${{ secrets.OPENAI_TOKEN }}
          github_token: ${{ secrets.GH_TOKEN }}
          exclude: '["^I have a question*.+$", "^I want to request new feature*.+$"]'
```

In this case we are preventing all issues with titles `I have a question...` and `I want to request new feature...` to be analyzed by the reports checker.

### Puzzle (PDD) Analysis

This action supports analysis not only for issues created manually, but also for puzzles, a.k.a `todo` in your code. 
[Puzzle Driven Development (2010)](https://www.yegor256.com/2010/03/04/pdd.html), [12/840,306](https://patents.google.com/patent/US20120023476) was suggested as a novel way for managing issues in software development.
Read how it works:
* [PDD in Action (2017)](https://www.yegor256.com/2017/04/05/pdd-in-action.html)
* [A Disabled Test In Lieu of a Bug Report (2023)](https://www.yegor256.com/2023/07/25/contribute-disabled-tests.html)

Issue is treated as puzzle if it satisfies the following regex:

```regexp
The puzzle `(.+)` from #(\d+) has to be resolved:.+
```

Then we are parsing the issue to find a tree path where puzzle is hidden.

This one
```text
https://github.com/tracehubpm/tracehub/blob/8d2aca048e33a5c9d83a49af4246c9ad7fde9998/src/main/java/SnippetTestCase.java#L61-L66
```

Turns into 3 elements:
* file path (`src/main/java/SnippetTestCase.java`)
* `SnippetTestCase.java` source code
* puzzle, located in range of `61` and `66` lines

After all of this done, we provide it to LLM and ask for quality problems.

### Quality Evaluation Process

If your bug report does not look clean, this action will automatically
formulate the list of _top 3 most_ suggestions on how to improve the bug
report to its author.

Technically, the process internals look like this:

![evaluation.svg](/doc/evaluation.svg)

problems.json:
```json
[
  "The bug report title is not descriptive enough. It only mentions \"diamond operator check gives false positive\" but doesn't specify where or in what context. A more descriptive title would be \"False positive on diamond operator check in MapOf class\"",
  "The report lacks essential details such as the software version, the operating system, and the development environment. Including these details can help to reproduce the bug and understand if it's a localized issue or a more general one.",
  "The report is missing steps to reproduce the bug. Even though the code snippet is provided, it would be helpful to outline the steps leading to the issue.",
  "The report does not include any error messages or logs. These can provide valuable context and clues about what is causing the bug",
  "The author should avoid using phrases like \"Can we do something about this?\" and instead use a more formal language, such as \"Suggesting to review the DiamondOperatorCheck for potential improvements\"."
]
```

top.json:
```json
[
  "The bug report title is not descriptive enough. It only mentions \"diamond operator check gives false positive\" but doesn't specify where or in what context. A more descriptive title would be \"False positive on diamond operator check in MapOf class\"",
  "The report does not include any error messages or logs. These can provide valuable context and clues about what is causing the bug",
  "The report does not include any error messages or logs. These can provide valuable context and clues about what is causing the bug"
]
```

suggestions.json:
```json
[
  "Improve the title of the bug report: Title: \"False positive on diamond operator check for MapOf class\"",
  "Include the specific error messages and logs: Error message from PMD: \"UseDiamondOperator: Use Diamond Operator\" Error message from DiamondOperatorCheck: \"DiamondOperatorCheck: Redundant specification of type arguments\"",
  "Describe the issue in more detail: Description: The PMD and DiamondOperatorCheck tools are reporting that there is an issue with the use of the diamond operator in the MapOf class. However, if we attempt to use the diamond operator with MapOf, we receive a compilation error."
]
```

Quality criteria are based on several researches, including:
* [Painless Bug Tracking, by Joel Spolsky, 2000](https://www.joelonsoftware.com/2000/11/08/painless-bug-tracking)
* [What Makes a Satisficing Bug Report? by Tommaso Dal Sasso, Andrea Mocci, and Michele Lanza, 2016](https://www.researchgate.net/publication/309151102_What_Makes_a_Satisficing_Bug_Report)

### How to contribute

Fork repository, make changes, send us a [pull request](https://www.yegor256.com/2014/04/15/github-guidelines.html).
We will review your changes and apply them to the `master` branch shortly,
provided they don't violate our quality standards. To avoid frustration,
before sending us your pull request please run full build:

```bash
$ npm install
$ npm run gha
```
