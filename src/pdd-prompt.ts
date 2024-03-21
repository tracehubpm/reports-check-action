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
 * Puzzle prompt.
 */
export class PddPrompt implements Scalar<string> {

  /**
   * Ctor.
   * @param snippet Todo snippet
   * @param path Full content path
   * @param content Content
   */
  constructor(
    private readonly snippet: string | undefined,
    private readonly path: string,
    private readonly content: string
  ) {
  }

  value(): string {
    return `
    Take a look at this code snippet.
    Pay attention only to the code to which outlined 'todo' connected with and the outlined todo formulation.
    Ignore any other information such as LICENSE, other todos and irrelevant to the outlined todo code.
    The todo message must deliver a clear state of reason of what needs to be done by other codebase contributor.
    Please review it and generate a summary about quality issues related to this todo message formulation.
    The summary must include only star (*), no indent bullet points with quality problems that only this message has, and context tips on how to fix them, so author of this report can improve it.
    If you see that message is clear, then just say "Quality is awesome".
    You must generate either summary with quality problems that related to this todo or just say "Quality is awesome", nothing in middle.
    Don't generate any other information.
    Please strictly adhere to the summary example.
    Summary example:
    * <>
    * <>
    * <>
    Todo snippet:
    ${this.snippet}
    
    This todo is located inside ${this.path}:
    ${this.content}
    `;
  }
}
