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
import {Ranged} from "./ranged";
import {Blob} from "./blob";
import {Octokit} from "@octokit/rest";
import {BlobPath} from "./blob-path";
import {Lines} from "./lines";
import {HashSplit} from "./hash-split";

/**
 * PDD routine.
 */
export class Pdd {

  /**
   * Ctor.
   * @param github GitHub
   * @param issue Issue
   * @param body Report body
   * @param type Model
   */
  constructor(
    private readonly github: Octokit,
    private readonly issue: Issue,
    private readonly body: string | undefined,
    private readonly type: string
  ) {
  }

  /**
   * Run it.
   */
  async run() {
    const path = new BlobPath(this.body).value();
    const full = new HashSplit(path);
    const content = new Blob(this.github, this.issue, full);
    const puzzle = await new Ranged(content, new Lines(path)).value();

    console.log(full.value());
    console.log(content.value());
    console.log(puzzle);

    // await new Feedback(
    //   await new PddModel(
    //     this.type,
    //     "token",
    //     "model",
    //     this.prompt
    //   ).analyze(),
    //   this.github,
    //   this.issue,
    //   "username",
    //   "model"
    // ).post();
  }
}
