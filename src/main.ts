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
import OpenAI from "openai";
import {QualityExpert} from "./quality-expert";
import {UserPrompt} from "./user-prompt";
import {Example} from "./example";
import {Rules} from "./rules";
import {Covered} from "./covered";
import {WithSummary} from "./with-summary";
import {DeepInfra} from "./deep-infra";

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
      core.setFailed("github_token was not provided");
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
      const body = smart.body;
      if (!body) {
        await new Comment(
          octokit,
          issue,
          "@" + smart.user?.login
          + " the issue body is empty, please provide more details for this problem."
        ).post();
        core.setFailed("The issue body is empty");
      }
      const openai = core.getInput("openai_token");
      if (openai) {
        const open = new OpenAI({apiKey: core.getInput("openai_token")});
        const response = await open.chat.completions.create({
          model: core.getInput("openai_model"),
          temperature: 0.1,
          messages: [
            {
              role: "system",
              content: new QualityExpert().value()
            },
            {
              role: "user",
              content: new UserPrompt(
                new Example(),
                new Rules(),
                body
              ).value()
            }
          ]
        });
        const summary = response.choices[0].message.content?.trim();
        if (summary?.includes("awesome")) {
          await new Comment(
            octokit,
            issue,
            new Covered(
              smart.user?.login,
              "thanks for detailed and disciplined report."
            ).value()
          ).post();
        } else {
          await new Comment(
            octokit,
            issue,
            new WithSummary(
              new Covered(
                smart.user?.login,
                "thanks for the report, quality analysis of this issue:",
              ),
              summary
            ).value()
          ).post();
          core.setFailed(
            `
          Quality analysis found errors:
          ${summary}
          `
          );
        }
      } else {
        const deepinfra = core.getInput("deepinfra_token");
        const model = core.getInput("deepinfra_model");
        const answer = await new DeepInfra(deepinfra, model)
          .analyze(body);

        console.log(answer);
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
