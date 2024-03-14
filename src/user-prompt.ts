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
   * Ctor.
   *
   * @param example Example
   * @param rules Rules
   * @param report Bug report
   */
  constructor(
    private readonly example: Example,
    private readonly rules: Rules,
    private readonly report: string | null | undefined
  ) {
    this.example = example;
    this.rules = rules;
    this.report = report;
  }

  /**
   * Build user prompt.
   */
  value(): string {
    return `
    Please review the quality of following bug report and generate an analysis summary.
    If it does not have a clear problem statement, then just say "Not a bug report".
    Please tell if bug report has some quality problems according to our rules,
    summarize them into bullet points sentences filled with context semantics and what needs to be fixed.
    Print only the bullet points, without any other info.
    If bug report does follow all the rules, don't formulate summary, instead, rate such bug report as "awesome" by answering just "Quality is awesome".
    Please adhere to the example template provided, but don't ever copy it, adjust this template to the issue context instead.
    Even it does not look like a bug report still don't copy the example.
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
