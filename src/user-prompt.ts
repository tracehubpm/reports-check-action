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
import {Rules} from "./rules";

/**
 * User prompt.
 */
export class UserPrompt {

  /**
   * Ctor.
   *
   * @param rules Rules
   * @param report Bug report
   */
  constructor(
    private readonly rules: Rules,
    private readonly report: string | null | undefined
  ) {
    this.rules = rules;
    this.report = report;
  }

  /**
   * Build user prompt.
   */
  value(): string {
    return `
    Please review following bug report.
    If bug report formulation does not match the rules, then please generate summary
    to the report author about what to fix in this report, so author can fix it using this summary.
    Please include in your summary only bullet point sentences about rules that bug report violates, supplied with useful context-rich information.
    The information and rule match must be precise.
    Don't generate any other information.
    If bug report does only match all the rules, then please don't generate summary, instead, just say "Quality is awesome".
    Rules can include: 
    1. steps to reproduce
    2. clear problem statement
    3. what is expected to see
    4. have its context, like class, file, code snippet, example, or class/file reference
    Its very important to adjust rules accordingly to the bug report itself.
    Bug report:
    ${this.report}
    `;
  }
}
