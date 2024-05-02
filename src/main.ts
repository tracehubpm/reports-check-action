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
import {SmartIssue} from "./github/smart-issue";
import {Comment} from "./github/comment";
import {DeepInfra} from "./deep-infra";
import {Feedback} from "./feedback";
import {Titled} from "./titled";
import {Excluded} from "./excluded";
import {Puzzled} from "./pdd/puzzled";
import {Pdd} from "./pdd/pdd";
import {FormattedSummary} from "./formatted-summary";
import {ChatGpt} from "./chat-gpt";
import OpenAI from "openai";
import {Models} from "./models";

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
          const report = new Titled(smart.title, body).asString();
          let llm;
          let validator;
          if ("openai" === type) {
            const model = core.getInput("openai_model");
            const open = new OpenAI({apiKey: openai});
            llm = new ChatGpt(
              open,
              model,
              0.7,
              512
            );
            validator = new ChatGpt(
              open,
              model,
              1.0,
              1024
            );
          } else if ("deepinfra" === type) {
            const model = core.getInput("deepinfra_model");
            llm = new DeepInfra(
              deep,
              model,
              0.7,
              512
            );
            validator = new DeepInfra(
              deep,
              model,
              1.0,
              1024
            );
          }
          const composed = await new Models(
            llm!!, validator!!
          ).compose(report);
          await new Feedback(
            new FormattedSummary(
              composed.problems,
              composed.suggestion
            ),
            octokit,
            issue,
            smart.user?.login,
            llm!!.name()
          ).post();
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
