# reports-check-action

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
The quality of bug reports is paramount for the overall quality of a
software project: [poorly formulated bug reports](https://www.yegor256.com/2018/04/24/right-way-to-report-bugs.html)
often lead to wasted time, programmers frustration, and delays.
This repository is a [Github Action](https://github.com/features/actions)
that would trigger on every new issue submitted, check that issue for quality
problems, and report them in the issue as a comment, asking bug reporter to fix
the report.

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

In this case we are preventing all issues with titles
`I have a question...` and `I want to request new feature...` to
be analyzed by the reports checker.

### Analysis Method

Our analysis method consists of a series intermediate steps.
Once [reports-check-action](https://github.com/marketplace/actions/reports-check-action)
receives new GitHub issue, the following happens:

![chain.svg](/doc/chain.svg)

Each goal is represented as separate prompt to the LLM. Thus, we utilize
famous pattern called [Chain-Of-Thought](https://arxiv.org/abs/2201.11903).

#### Analysis

Firstly, we run simple analysis against submitted bug report.
Output looks like this:

```text
Quality problems related to this bug report formulation:

* The title of the bug report "deltaBidning" and "lambdaBidning" Typos in Phi.g4 grammar file is not clear and descriptive enough. A better title could be "Incorrect naming in Phi.g4 grammar file".
* The bug report lacks a clear problem statement. It's suggested to start the description with a clear problem statement instead of an action. For example: "In the Phi.g4 grammar file, there are two typos in the following code block. Instead of 'deltaBidning' and 'lambdaBidning', it should be 'deltaBinding' and 'lambdaBinding'."
* The bug report lacks information about the impact of these typos on the software's functionality. For example, it would be helpful to know if the issue prevents compilation, causes runtime errors, or leads to unexpected behavior. Additionally, a severity label for the issue could be useful.
```

#### Self Validation

LLM validates previous analysis result and corrects it if needed:

```text
The title of the bug report "deltaBidning" and "lambdaBidning" Typos in Phi.g4 grammar file is not clear and descriptive enough. A better title could be "Incorrect naming in Phi.g4 grammar file".
The bug report lacks information about the impact of these typos on the software's functionality. For example, it would be helpful to know if the issue prevents compilation, causes runtime errors, or leads to unexpected behavior. Additionally, a severity label for the issue could be useful.
```

We utilize pattern so-called [Self Validation](https://arxiv.org/abs/2212.09561)
that aims to help a bit with [hallucinations](https://www.iguazio.com/glossary/llm-hallucination)
and [stochasticity](https://en.wikipedia.org/wiki/Stochastic_parrot)
as [this paper](https://arxiv.org/abs/2308.00245) suggests.
After self validation proceeded, we pack it into [Markdown](https://en.wikipedia.org/wiki/Markdown)
format using [Markdown Packing Method](#markdown-packing-method):

```markdown
* The title of the bug report "deltaBidning" and "lambdaBidning" Typos in Phi.g4 grammar file is not clear and
  descriptive enough. A better title could be "Incorrect naming in Phi.g4 grammar file".
* The bug report lacks information about the impact of these typos on the software's functionality. For example, it
  would be helpful to know if the issue prevents compilation, causes runtime errors, or leads to unexpected behavior.
  Additionally, a severity label for the issue could be useful.
```

#### Cap Top 3

Some analysis results contains many problems.
Consider this example:

```markdown
1. Lack of a clear description: The report lacks a clear and concise description of the problem. It simply states there are typos but does not specify what the typos are or how they impact the system.
2. Missing steps to reproduce: There are no steps provided to reproduce the issue. This makes it difficult for developers to identify if they have fixed the issue correctly.
3. No severity level: The severity level of the issue is not stated. This is important information for developers to prioritize how soon the issue should be resolved.
4. Lack of environment details: The report does not mention which environment this issue occurs in (e.g., which version of the software, which operating system).
5. Use of shorthand: The term 'take a look here' is used, which is not clear or professional. It is best to avoid using shorthand or colloquial language in formal documentation.
6. Incomplete code block: The code block is not complete (it is cut off after the relevant lines). This makes it difficult for developers to understand the context of the issue.
```

In order to make programmers not ignore the feedback reports by this action,
we **minimize** amount of problems to just 3 or less.
LLM at this stage picks the most important problems from previous analysis
and adds them into new response:

```markdown
1. Lack of a clear description: The report lacks a clear and concise description of the problem. It simply states there are typos but does not specify what the typos are or how they impact the system.
2. Missing steps to reproduce: There are no steps provided to reproduce the issue. This makes it difficult for developers to identify if they have fixed the issue correctly.
6. Incomplete code block: The code block is not complete (it is cut off after the relevant lines). This makes it difficult for developers to understand the context of the issue.
```

#### Polish

Here we polish the response we got before. In this goal we fix formatting
issues and improve standardization of the response by making it "solid":

```markdown
* Lack of a clear description: The report lacks a clear and concise description of the problem. It simply states there are typos but does not specify what the typos are or how they impact the system.
* Missing steps to reproduce: There are no steps provided to reproduce the issue. This makes it difficult for developers to identify if they have fixed the issue correctly.
* Incomplete code block: The code block is not complete (it is cut off after the relevant lines). This makes it difficult for developers to understand the context of the issue.
```

#### Suggestions

At `suggestions` we generate actual suggestions on how to improve bug report
formulation. At this point we don't ask LLM to use strict formatting, in most
cases it is just a free of format text:

```text
Suggested improvements:

Clear description: Please provide a clear explanation of the issue. Explain what typos were found in the code (deltaBidning and lambdaBidning) and how they impact the system functionality.

Steps to reproduce: Include the necessary steps to reproduce the issue. This will help the developers understand the issue better and identify if the fix was correct.

Complete code block: Kindly provide the complete code block for better context understanding.

Suggested Bug Report:

deltaBidning and lambdaBidning Typos in Phi.g4 grammar file: In our Phi.g4 grammar file, we have identified typos in the following lines:

binding
    : alphaBinding
    | emptyBinding
    | deltaBidning
    | lambdaBidning
    ;
The correct syntax should be:

binding
    : alphaBinding
    | emptyBinding
    | deltaBinding
    | lambdaBinding
    ;
The typos(deltaBidning and lambdaBidning) impact the system's syntax understanding and cause unexpected behavior or errors.

To reproduce this issue, follow these steps:

Open the Phi.g4 grammar file.
Locate the lines marked above.
Observe that deltaBidning should be deltaBinding and lambdaBidning should be lambdaBinding.
These corrections will solve the issue and appropriately define the grammar rules for binding.
```

Next step we do is splitting this text into _logical chunks_ and [format](#markdown-packing-method)
them into JSON object:

```markdown
* Clear description: Please provide a clear explanation of the issue. Explain what typos were found in the code (deltaBidning and lambdaBidning) and how they impact the system functionality.
* Steps to reproduce: Include the necessary steps to reproduce the issue. This will help the developers understand the issue better and identify if the fix was correct.
* Complete code block: Kindly provide the complete code block for better context understanding.
* Suggested Bug Report:deltaBidning and lambdaBidning Typos in Phi.g4 grammar file: In our Phi.g4 grammar file, we have identified typos in the following lines:\n\n```\nbinding\n    : alphaBinding\n    | emptyBinding\n    | deltaBidning\n    | lambdaBidning\n    ;\n```\nThe correct syntax should be:\n\n```\nbinding\n    : alphaBinding\n    | emptyBinding\n    | deltaBinding\n    | lambdaBinding\n    ;\n```\nThe typos(deltaBidning and lambdaBidning) impact the system's syntax understanding and cause unexpected behavior or errors.\n\nTo reproduce this issue, follow these steps:\n\n- Open the Phi.g4 grammar file.\n- Locate the lines marked above.\n- Observe that deltaBidning should be deltaBinding and lambdaBidning should be lambdaBinding.\n\nThese corrections will solve the issue and appropriately define the grammar rules for binding.
```

In the [UML](https://en.wikipedia.org/wiki/Unified_Modeling_Language) notation, the full process looks like this:

![method.svg](/doc/method.svg)

#### Markdown Packing Method

LLMs often produce suboptimal results when directly prompted to output in
some strict user format. That's why we let LLM "think" in English and ask
to summarize Markdown array only at the final step of the operation.
At this stage we pack previous LLM response to Markdown array format.

Sometime before we got to this solution, we used to utilize one prompt,
where we describe all the details and _format_ that we expect LLM to give us.

### Puzzle (PDD) Analysis

This action supports analysis not only for issues created manually,
but also for puzzles, a.k.a `todo` in your code.
[Puzzle Driven Development (2010)](https://www.yegor256.com/2010/03/04/pdd.html),
[12/840,306](https://patents.google.com/patent/US20120023476)
was suggested as a novel way for managing issues in software development.
Read how it works:

* [PDD in Action (2017)](https://www.yegor256.com/2017/04/05/pdd-in-action.html)
* [A Disabled Test In Lieu of a Bug Report (2023)](https://www.yegor256.com/2023/07/25/contribute-disabled-tests.html)

Issue is treated as puzzle if it satisfies the following regex:

```regexp
The puzzle `(.+)` from #(\d+) has to be resolved:.+
```

Then we parse the issue to find a tree path where puzzle is hidden.

This one

```text
https://github.com/tracehubpm/tracehub/blob/8d2aca048e33a5c9d83a49af4246c9ad7fde9998/src/main/java/SnippetTestCase.java#L61-L66
```

Turns into 3 elements:

* file path (`src/main/java/SnippetTestCase.java`)
* `SnippetTestCase.java` source code
* puzzle, located in range of `61` and `66` lines

After all of this done, we provide it to LLM and ask for quality problems.

### How to contribute

Fork repository, make changes, send us a [pull request](https://www.yegor256.com/2014/04/15/github-guidelines.html).
We will review your changes and apply them to the `master` branch shortly,
provided they don't violate our quality standards. To avoid frustration,
before sending us your pull request please run full build:

```bash
npm install
npm run gha
```
