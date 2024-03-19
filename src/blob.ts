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
import {Base64} from "js-base64";

/**
 * Code tree GitHub blob.
 */
export class Blob implements Scalar<Promise<string[]>> {

  /**
   * Ctor.
   * @param github GitHub
   * @param issue Issue
   */
  constructor(
    private readonly github: Octokit,
    private readonly issue: any
  ) {
  }

  /**
   * As text.
   */
  async value(): Promise<string[]> {
    console.log("branch");
    const {data} = await this.github.repos.get(
      {
        owner: this.issue.owner,
        repo: this.issue.repo
      }
    );
    console.log(data);

    const pattern = /https:\/\/github\.com\/[^/]+\/[^/]+\/blob\/[^/]+\/(.+)/;
    const match = this.issue.body.match(pattern);
    console.log(match[1]);

    const response = await this.github.repos.getContent({
      owner: this.issue.owner,
      repo: this.issue.repo,
      ref: data.default_branch,
      path: '.trace/project.yml' // file path after deterministic parsing
    });
    const encoded = JSON.parse(JSON.stringify(response.data)).content;
    const decoded = Base64.decode(encoded);
    return decoded.split('\n');
  }
}
