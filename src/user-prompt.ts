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
import {Example} from "./example";
import {Rules} from "./rules";

/**
 * User prompt.
 */
export class UserPrompt {

  /**
   * Example.
   */
  private readonly example: Example;

  /**
   * Rules.
   */
  private readonly rules: Rules;

  /**
   * Bug report.
   */
  private readonly report: string | null | undefined;

  /**
   * Ctor.
   *
   * @param example Example
   * @param rules Rules
   * @param report Bug report
   */
  constructor(example: Example, rules: Rules, report: string | null | undefined) {
    this.example = example;
    this.rules = rules;
    this.report = report;
  }

  /**
   * Build user prompt.
   */
  value(): string {
    return `
    Please review the quality of following bug report and generate analysis summary.
    If it does not look like a bug report, then just say "Not a bug report".
    If bug report does follow all the rules, please rate such bug report as "awesome" by answering just "Quality is awesome".
    If bug report is too abstract then please reject it by answering "Bug report is too abstract".
    Otherwise, please say what needs to be improved, this must contain only 1-2 sentence bullet points, mainly focusing on the context of the bug report, as well as the rules.
    Each bullet point should start with a context-specific comments, please pay attention to a possible examples in the bug report itself.
    Each bullet point should link the bug report context with the violated rule.
    Print only the bullet points, without any other info.
    Please strictly adhere to the example template provided.
    Example of analysis summary:
    ${this.example.value()}.
    Rules=[
    ${this.rules.value()}
    ]
    Bug report:
    ${this.report}
    `;
  }
}
