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

/**
 * Deep Infra.
 */
export class DeepInfra implements Model {

  /**
   * Ctor.
   * @param token Token
   * @param model Model
   * @param temperature Temperature
   * @param max Max new tokens
   */
  constructor(
    private readonly token: string,
    private readonly model: string,
    private readonly temperature: number,
    private readonly max: number
  ) {
  }

  async analyze(system: Scalar<string>, prompt: Scalar<string>) {
    const response = await fetch(
      'https://api.deepinfra.com/v1/openai/chat/completions', {
        method: 'POST',
        body: JSON.stringify({
          model: this.model,
          max_new_tokens: this.max,
          temperature: this.temperature,
          messages: [
            {
              role: "system",
              content: system.value()
            },
            {
              role: "user",
              content: prompt.value()
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
      `Tokens usage: prompt: ${answer.usage.prompt_tokens}, completion: ${answer.usage.completion_tokens}, total: ${answer.usage.total_tokens}`
    );
    return answer.choices[0].message.content;
  }

  name(): string {
    return this.model;
  }
}
