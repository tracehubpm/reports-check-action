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
import {Octokit} from "@octokit/rest";
import {Comment} from "./github/comment";
import {Label} from "./github/label";

/**
 * Non Relevant bug report.
 */
export class NonRelevant {

  /**
   * Ctor.
   * @param github Github
   * @param issue Issue
   * @param creator Creator
   */
  constructor(
    private readonly github: Octokit,
    private readonly issue: Issue,
    private readonly creator: string | undefined
  ) {
    this.github = github;
    this.issue = issue;
    this.creator = creator;
  }

  /**
   * Close non relevant issue.
   */
  async close() {
    await new Comment(
      this.github,
      this.issue,
      "@" + this.creator
      + " this issue is not relevant to " + "\`" + this.issue.owner + "/" + this.issue.repo + "\`" + "."
      + " We should close it."
    ).post();
    await new Label(this.github, this.issue, "invalid").attach();
    await this.github.issues.update(
      {
        owner: this.issue.owner,
        repo: this.issue.repo,
        issue_number: this.issue.number,
        state: "closed",
        state_reason: "not_planned"
      }
    );
  }
}
