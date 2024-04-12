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
import {Split} from "./split";
import {Feedback} from "../feedback";
import {PddModel} from "./pdd-model";
import {PddPrompt} from "../prompts/pdd-prompt";
import {TodoReviewer} from "./todo-reviewer";
import {DefaultSummary} from "../default-summary";

/**
 * PDD routine.
 */
export class Pdd {

  /**
   * Ctor.
   * @param github GitHub
   * @param issue Issue
   * @param body Report body
   * @param username Username
   * @param type Model
   * @param pair Token model pair
   */
  constructor(
    private readonly github: Octokit,
    private readonly issue: Issue,
    private readonly body: string | undefined,
    private readonly username: string,
    private readonly type: string,
    private readonly pair: TokenModel
  ) {
  }

  /**
   * Run it.
   */
  async run() {
    const path = new BlobPath(this.body).value();
    const full = new HashSplit(path);
    const content = await new Blob(this.github, this.issue, full).value();
    const puzzle = await new Ranged(new Split(content), new Lines(path)).value();
    console.log(`Full path: ${full.value()}`);
    console.log(`Content: ${content}`);
    console.log(`Puzzle: ${puzzle}`);
    await new Feedback(
      new DefaultSummary(
        await new PddModel(
          this.type,
          this.pair.token,
          this.pair.model,
        ).analyze(
          new TodoReviewer(),
          new PddPrompt(
            puzzle,
            full.value()!!,
            content
          )
        ),
      ),
      this.github,
      this.issue,
      this.username,
      this.pair.model
    ).post();
  }
}
