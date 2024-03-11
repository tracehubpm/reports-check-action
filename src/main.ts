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
    const issue = github.context.issue;
    if (issue) {
      console.log(`Found new issue: #${issue.number}`);
      const octokit = new Octokit(
        {auth: core.getInput("github_token")}
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

      // role: system
      // content:
      // You are a software quality analysis expert tasked with
      // reviewing incoming bug reports that developers are submit.

      // role: user
      // content:
      // Please review the quality of following bug report.
      // If it does not look like a bug report, then just say "Not a bug report".
      // If bug report does follow all the rules, please rate such bug report as "awesome"
      // by answering just "Quality is awesome".
      // Otherwise, please say what needs to be improved,
      // this must contain only 1-2 sentence bullet points, mainly focusing on the context of the bug report, as well as the rules.
      // Each bullet point should link the bug report context with rules.
      // Print only the statements, without any other info.
      // Please strictly adhere to the example template provided.
      // Example of analysis summary: ${example}
      // Rules=[
      // Bug report has steps to reproduce,
      // Bug report is saying what is expected to see,
      // Bug report is saying what you saw instead,
      // Bug report has its location, like class, file, or simple example
      // ]
      // Bug report: ${body}.

      // temperature: 0.1

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
