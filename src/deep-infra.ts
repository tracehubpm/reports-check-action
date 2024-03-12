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
import {QualityExpert} from "./quality-expert";
import {UserPrompt} from "./user-prompt";
import {Example} from "./example";
import {Rules} from "./rules";

/**
 * Deep Infra.
 */
export class DeepInfra implements Model {

  /**
   * API Key.
   */
  private readonly token: string;

  /**
   * Model.
   */
  private readonly model: string;

  /**
   * Ctor.
   * @param token Token
   * @param model Model
   */
  constructor(token: string, model: string) {
    this.token = token;
    this.model = model;
  }

  async analyze(report: string | null | undefined) {
    const response = await fetch(
      'https://api.deepinfra.com/v1/openai/chat/completions', {
        method: 'POST',
        body: JSON.stringify({
          model: this.model,
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content: new QualityExpert().value()
            },
            {
              role: "user",
              content: new UserPrompt(
                new Example(),
                new Rules(),
                report
              ).value()
            }
          ],
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${this.token}`,
        }
      });
    const answer = await response.json();
    console.log(
      `Tokens usage:
       prompt: ${answer.usage.prompt_tokens}
       completion: ${answer.usage.completion_tokens}
       `
    );
    return answer.choices[0].message.content;
  }
}
