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
import {Comment} from "./github/comment";
import {Covered} from "./covered";
import {WithSummary} from "./with-summary";
import * as core from "@actions/core";
import {Octokit} from "@octokit/rest";

/**
 * Feedback.
 */
export class Feedback {

  /**
   * Ctor.
   * @param summary Problems
   * @param github GitHub
   * @param issue Issue
   * @param username Username
   * @param model LLM Model
   */
  constructor(
    private readonly summary: Scalar<string>,
    private readonly github: Octokit,
    private readonly issue: Issue,
    private readonly username: string | undefined,
    private readonly model: string
  ) {
  }

  async post() {
    const response = this.summary.value();
    if (response.includes("awesome")) {
      await new Comment(
        this.github,
        this.issue,
        new Covered(
          this.username,
          "thanks for detailed and disciplined report."
        ).value()
      ).post();
    } else {
      await new Comment(
        this.github,
        this.issue,
        new WithSummary(
          new Covered(
            this.username,
            "thanks for the report, here is a feedback:",
          ),
          response,
          this.model
        ).value()
      ).post();
      core.setFailed(
        `
          Quality analysis found the following errors:
          ${response}
          `
      );
    }
  }
}
