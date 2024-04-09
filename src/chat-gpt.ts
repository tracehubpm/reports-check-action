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
import OpenAI from "openai";

/**
 * ChatGPT model.
 */
export class ChatGpt implements Model {

  /**
   * Ctor.
   * @param open Open AI
   * @param model Model name
   * @param temperature Temperature
   * @param max Max new tokens
   */
  constructor(
    private readonly open: OpenAI,
    private readonly model: string,
    private readonly temperature: number,
    private readonly max: number
  ) {
    this.open = open;
    this.model = model;
  }

  async analyze(system: Scalar<string>, user: Scalar<string>) {
    const response = await this.open.chat.completions.create({
      model: this.model,
      temperature: this.temperature,
      max_tokens: this.max,
      messages: [
        {
          role: "system",
          content: system.value()
        },
        {
          role: "user",
          content: user.value()
        }
      ]
    });
    return response.choices[0].message.content?.trim();
  }

  name(): string {
    return this.model;
  }
}
