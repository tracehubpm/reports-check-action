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
 * User prompt.
 */
export class UserPrompt {

  /**
   * Ctor.
   *
   * @param report Bug report
   */
  constructor(
    private readonly report: string | null | undefined
  ) {
    this.report = report;
  }

  /**
   * Build user prompt.
   */
  value(): string {
    return `
    Please strictly review following bug report.
    If bug report formulation has any quality problems, confusion, or uncertainties, then please generate a summary to the bug report
    author. The summary must include only quality problems with the report and how to fix them, so
    author can formulate the report better.
    If bug report is clean, then please don't generate summary, instead, just say "Quality is awesome".
    Bug report:
    ${this.report}
    `;
  }
}
