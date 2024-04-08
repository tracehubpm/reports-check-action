/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2023-2024 Tracehub.git
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import * as core from "@actions/core";
import {Octokit} from "@octokit/rest";
import {SmartIssue} from "./smart-issue";
import {Comment} from "./comment";
import {DeepInfra} from "./deep-infra";
import {Feedback} from "./feedback";
import {Titled} from "./titled";
import {Excluded} from "./excluded";
import {Puzzled} from "./puzzled";
import {Pdd} from "./pdd";
import {QualityExpert} from "./quality-expert";
import {AnalysisPrompt} from "./analysis-prompt";
import {ValidatePrompt} from "./validate-prompt";
import {Default} from "./default";
import {JsonFormat} from "./json-format";
import {Top} from "./top";
import {PolishJson} from "./polish-json";
import {Suggestions} from "./suggestions";
import {SuggestionsJson} from "./suggestions-json";
import {FormattedSummary} from "./formatted-summary";
import {MdObjects} from "./md-objects";
import {MdUnbox} from "./md-unbox";
import {ChatGpt} from "./chat-gpt";
import OpenAI from "openai";

export let github: {
  context: {
    issue: {
      owner: string,
      repo: string,
      number: number
      user: {
        login: string
      }
    }
  }
};
if (process.env.GITHUB_ACTIONS) {
  github = require("@actions/github");
} else {
  github = {
    context: {
      issue: {
        owner: "test",
        repo: "test",
        number: 123,
        user: {
          login: "test"
        }
      }
    }
  };
}

async function run() {
  console.log("Running bug report check...");
  try {
    const ghToken = core.getInput("github_token");
    if (!ghToken) {
      core.setFailed("`github_token` was not provided");
    }
    const openai = core.getInput("openai_token");
    const deep = core.getInput("deepinfra_token");
    let type;
    if (!openai && deep) {
      type = "deepinfra";
    } else if (!deep && openai) {
      type = "openai";
    } else {
      throw new Error(
        "Neither `openai_token` nor `deepinfra_token` was not provided"
      );
    }
    const issue = github.context.issue;
    if (issue) {
      console.log(`Found new issue: #${issue.number}`);
      const octokit = new Octokit(
        {auth: ghToken}
      );
      const smart = await new SmartIssue(
        octokit,
        issue
      ).fetch();
      const excluded = JSON.parse(core.getInput("exclude"));
      const skip = new Excluded(excluded, smart).value();
      if (skip) {
        console.log(
          `Issue #${issue.number} (${smart.title}) was skipped, all excluded titles: ${excluded}`
        );
      } else {
        const body = smart.body;
        if (!body) {
          await new Comment(
            octokit,
            issue,
            "@" + smart.user?.login
            + " the issue body is empty, please provide more details for this problem."
          ).post();
          const reason = "The issue body is empty";
          core.setFailed(reason);
          throw new Error(reason);
        }
        if (new Puzzled(body).value()) {
          console.log(
            `Puzzle found:
             ${body}`
          );
          let token = "";
          let model = "";
          if ("openai" === type) {
            token = openai;
            model = core.getInput("openai_model");
          } else if ("deepinfra" === type) {
            token = deep;
            model = core.getInput("deepinfra_model");
          }
          await new Pdd(
            octokit,
            issue,
            body,
            smart.user?.login!!,
            type,
            {
              token: token,
              model: model
            }
          ).run();
        } else {
          /**
           * @todo #69:90min Resolve huge code duplication when proceeding chain-of-thought.
           *  For now we have absolute the same code for both LLMs: ChatGPT and DeepInfra.
           *  Would be good to resolve this code duplication at this level in order to make this piece
           *  of code a bit more maintainable and logic-scalable.
           */
          if ("openai" === type) {
            const model = core.getInput("openai_model");
            const report = new Titled(smart.title, body).asString();
            const open = new OpenAI({apiKey: openai});
            const problems = await new ChatGpt(
              open,
              model,
              new QualityExpert(),
              new AnalysisPrompt(report),
              0.7,
              512
            ).analyze();
            console.log(
              `Analysis found problems: 
              ${problems}
              This list can have fake or falsy problems that bug report does not have.
              Running self-validation...
              `
            );
            const validated = await new ChatGpt(
              open,
              model,
              new Default(),
              new ValidatePrompt(report, problems),
              1.0,
              1024
            ).analyze();
            console.log(
              `Problems were validated, updated list of them:
              ${validated}
              `
            );
            const vformatted = await new ChatGpt(
              open,
              model,
              new Default(),
              new JsonFormat(validated),
              0.7,
              512
            ).analyze();
            console.log(
              `Packed into JSON:
              ${validated}
              ->
              ${vformatted}
              `
            );
            let candidate;
            const amount = JSON.parse(new MdUnbox(vformatted).value()).size;
            if (amount > 3) {
              console.log("Amount of problems is more than 3, running top goal")
              const top = await new ChatGpt(
                open,
                model,
                new Default(),
                new Top(vformatted, report),
                0.7,
                512
              ).analyze();
              console.log(
                `Top problems:
                ${top}
                `
              );
              candidate = await new ChatGpt(
                open,
                model,
                new Default(),
                new PolishJson(top),
                0.7,
                512
              ).analyze();
            } else {
              candidate = vformatted;
            }
            console.log(
              `Candidate problems for suggestions:
              ${candidate}
              `
            );
            const json = await new ChatGpt(
              open,
              model,
              new Default(),
              new SuggestionsJson(
                await new ChatGpt(
                  open,
                  model,
                  new Default(),
                  new Suggestions(report, candidate),
                  0.7,
                  512
                ).analyze()
              ),
              0.7,
              512
            ).analyze();
            console.log(
              `Packed suggestions into JSON:
              ${json}
              `
            );
            await new Feedback(
              new FormattedSummary(
                new MdObjects(JSON.parse(new MdUnbox(candidate).value()).problems),
                new MdObjects(JSON.parse(new MdUnbox(json).value()).suggestions)
              ),
              octokit,
              issue,
              smart.user?.login,
              model
            ).post();
          } else if ("deepinfra" === type) {
            const model = core.getInput("deepinfra_model");
            const report = new Titled(smart.title, body).asString();
            const problems = await new DeepInfra(
              deep,
              model,
              new QualityExpert(),
              new AnalysisPrompt(
                report
              ),
              0.7,
              512
            ).analyze();
            console.log(
              `Analysis found problems: 
              ${problems}
              This list can have fake or falsy problems that bug report does not have.
              Running self-validation...
              `
            );
            const validated = await new DeepInfra(
              deep,
              model,
              new Default(),
              new ValidatePrompt(
                report,
                problems
              ),
              1.0,
              1024
            ).analyze();
            console.log(
              `Problems were validated, updated list of them:
              ${validated}
              `
            );
            const vformatted = await new DeepInfra(
              deep,
              model,
              new Default(),
              new JsonFormat(validated),
              0.7,
              512
            ).analyze();
            console.log(
              `Packed into JSON:
              ${validated}
              ->
              ${vformatted}
              `
            );
            let candidate;
            const amount = JSON.parse(new MdUnbox(vformatted).value()).size;
            if (amount > 3) {
              console.log("Amount of problems is more than 3, running top goal")
              const top = await new DeepInfra(
                deep,
                model,
                new Default(),
                new Top(
                  vformatted,
                  report
                ),
                0.7,
                512
              ).analyze();
              console.log(
                `Top problems:
                ${top}
                `
              );
              candidate = await new DeepInfra(
                deep,
                model,
                new Default(),
                new PolishJson(top),
                0.7,
                512
              ).analyze();
            } else {
              candidate = vformatted;
            }
            console.log(
              `Candidate problems for suggestions:
              ${candidate}
              `
            );
            const json = await new DeepInfra(
              deep,
              model,
              new Default(),
              new SuggestionsJson(
                await new DeepInfra(
                  deep,
                  model,
                  new Default(),
                  new Suggestions(report, candidate),
                  0.7,
                  512
                ).analyze()
              ),
              0.7,
              512
            ).analyze();
            console.log(
              `Packed suggestions into JSON:
              ${json}
              `
            );
            await new Feedback(
              new FormattedSummary(
                new MdObjects(JSON.parse(new MdUnbox(candidate).value()).problems),
                new MdObjects(JSON.parse(new MdUnbox(json).value()).suggestions)
              ),
              octokit,
              issue,
              smart.user?.login,
              model
            ).post();
          }
        }
      }
    } else {
      console.log("No opened issue found");
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed(
        `An unknown error occurred.
         Please report it here:
         https://github.com/tracehubpm/reports-check-action/issues`
      );
    }
  }
}

run();
