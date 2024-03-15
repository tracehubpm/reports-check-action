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
    Please review following bug report.
    Bug report can be formulated in different ways, so it's very important to look deeply in its context to identify does report matches or not to the specific rule.
    If bug report formulation does not match the rules, then please generate a summary to the bug report author.
    The summary must include only violated rules and the report context information that can help to fix the report.
    It's very important to not include matched rules.
    Don't include any other information in your summary.
    Please strictly adhere the example template provided.
    If bug report does only match all the rules, then please don't generate summary, instead, just say "Quality is awesome".
    Rules=[
    Bug report should have problem statement, examples: any problem statement essential formulation, so it clear that "there is a problem";
    Bug report should have what is expected to see, examples: expected behavior or expected values in which system archives desired state;
    Bug report should have it's context, examples: provided code snippet or reference to class or file like EmailsTest.java
    ]
    Summary Example:
    * <violated rule, context>
    Bug report:
    ${this.report}
    `;
  }
}
