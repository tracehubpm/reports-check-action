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
import {Goal} from "../goal";
import {Default} from "../prompts/default";
import {MdUnbox} from "../md-unbox";
import {Top} from "../prompts/top";
import {NamedGoal} from "./named-goal";
import {Polish} from "../prompts/polish";

/**
 * Cap top problems goal.
 */
export class TopGoal implements Goal {

  /**
   * Ctor.
   * @param model Model
   * @param report Report
   * @param problems Problems
   */
  constructor(
    private readonly model: Model,
    private readonly report: string,
    private readonly problems: any
  ) {
  }

  async exec(): Promise<any> {
    console.log(
      `Running top goal`
    );
    const top = await this.model.analyze(
      new Default(),
      new Top(this.problems, this.report)
    );
    console.log(
      `Top problems:
        ${top}`
    );
    return await new NamedGoal(
      "polish",
      this.model,
      new Default(),
      new Polish(top)
    ).exec();
  }
}
