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
import OpenAI from "openai";

/**
 * ChatGPT model.
 */
export class ChatGpt implements Model {

  /**
   * Ctor.
   * @param open Open AI
   * @param model Model name
   * @param system System prompt
   * @param prompt User prompt
   */
  constructor(
    private readonly open: OpenAI,
    private readonly model: string,
    private readonly system: Scalar<string>,
    private readonly prompt: Scalar<string>
  ) {
    this.open = open;
    this.model = model;
  }

  async analyze() {
    const response = await this.open.chat.completions.create({
      model: this.model,
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: this.system.value()
        },
        {
          role: "user",
          content: this.prompt.value()
        }
      ]
    });
    return response.choices[0].message.content?.trim();
  }
}
