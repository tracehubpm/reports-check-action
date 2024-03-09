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
import {IssueBody} from "./issue-body";

export let github: {
  context: {
    issue: {
      owner: string,
      repo: string,
      number: number
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
        number: 123
      }
    }
  };
}

async function run() {
  console.log("Running bug report check...");
  try {
    const issue = github.context.issue;
    if (issue) {
      console.log(`Found new issue: ${issue.number}`);
      const body = await new IssueBody(
        new Octokit(
          {auth: core.getInput("github_token")}
        ),
        issue
      ).fetch();
      console.log(`body: ${body}`);
      // quality analysis.

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
