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
import {DeepInfra} from "./deep-infra";
import {ChatGpt} from "./chat-gpt";
import OpenAI from "openai";
import {TodoReviewer} from "./todo-reviewer";

/**
 * PDD model.
 */
export class PddModel implements Model {

  /**
   * Ctor.
   * @param type Type
   * @param token Token
   * @param model Model name
   * @param prompt Prompt
   */
  constructor(
    private readonly type: string,
    private readonly token: string,
    private readonly model: string,
    private readonly prompt: Scalar<string>
  ) {
  }

  async analyze(): Promise<any> {
    let answer;
    if (this.type === "openai") {
      answer = await new ChatGpt(
        new OpenAI({apiKey: this.token}),
        this.model,
        new TodoReviewer(),
        this.prompt
      ).analyze();
    } else {
      console.log(this.prompt.value());
      answer = await new DeepInfra(
        this.token,
        this.model,
        new TodoReviewer(),
        this.prompt,
        0.7,
        512
      ).analyze();
    }
    return answer;
  }
}
