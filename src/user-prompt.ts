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
    If bug report formulation does not match the rules, then please generate a summary
    to the report author about what to fix in this report, so author can fix it according to your summary.
    Summary must include only star bullet point (*) sentences about rules that bug report violates, supplied with useful context-rich information related to the bug report.
    Don't include any other information in your summary.
    If bug report does only match all the rules, then please don't generate summary, instead, just say "Quality is awesome".
    Rules=[
    Bug report should have problem statement (Expected to see: problem statement formulation, so it clear that "there is a problem"),
    Bug report should have what is expected to see (Expected to see: expected behavior or expected values in which system archives desired state),
    Bug report should have it's context, like class, file, code snippet, example, or class/file reference (Expected to see: provided code snippet or reference like EmailsTest.java)
    ]
    It's very important to adjust rules accordingly to the bug report itself, so some rules can be omitted due to its irrelevance to the issue.
    Bug report:
    ${this.report}
    `;
  }
}
