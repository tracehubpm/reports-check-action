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

/**
 * Simple named goal.
 */
export class NamedGoal implements Goal {

  /**
   * Ctor.
   * @param name Name of the goal
   * @param model Model
   * @param system System
   * @param user User
   */
  constructor(
    private readonly name: string,
    private readonly model: Model,
    private readonly system: Scalar<string>,
    private readonly user: Scalar<string>
  ) {
  }

  async exec(): Promise<any> {
    console.log(
      `Running ${this.name} goal`
    );
    const response = await this.model.analyze(this.system, this.user);
    console.log(
      `${this.name} completed, response from ${this.model.name()}:
      ${response}
      `
    );
    return response;
  }
}
