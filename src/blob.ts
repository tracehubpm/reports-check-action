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
   * @param body Report body
   */
  constructor(
    private readonly github: Octokit,
    private readonly issue: Issue,
    private readonly body: string | undefined
  ) {
  }

  /**
   * As text.
   */
  async value(): Promise<string[]> {
    const {data} = await this.github.repos.get(
      {
        owner: this.issue.owner,
        repo: this.issue.repo
      }
    );
    const pattern = /https:\/\/github\.com\/[^/]+\/[^/]+\/blob\/[^/]+\/(.+)/;
    const match = this.body?.match(pattern);
    if (match) {
      const full = match[1];
      console.log(full);
      const lines = /(.+?)(?:#L(\d+)-(\d+))?/;
      const lined = full.match(lines);
      if (lined) {
        const filePath = lined[1]; // File path
        console.log(filePath);
        if (lined[2] && lined[3]) {
          const lines = lined[2] + '-' + lined[3]; // Line numbers
          console.log(lines);
        } else {
          console.log('Line numbers not specified');
        }
      }

      const response = await this.github.repos.getContent({
        owner: this.issue.owner,
        repo: this.issue.repo,
        ref: data.default_branch,
        path: '.trace/project.yml' // file path after deterministic parsing
      });
      const encoded = JSON.parse(JSON.stringify(response.data)).content;
      const decoded = Base64.decode(encoded);
      return decoded.split('\n');
    } else {
      throw new Error(`Asset ${this.body} does not contain puzzle blob, regex ${pattern}`);
    }
  }
}
