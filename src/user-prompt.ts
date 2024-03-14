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
    Pay attention to a problem statement that can be:
    1. Something is broken
    2. Lack of functionality
    3. Lack of tests
    4. Lack of documentation
    5. Suboptimal implementation
    6. Design inconsistency
    7. Naming is weird
    8. Unstable test
    9. Typos
    And everything that "doesn't look right".
    If it does not have a clear problem statement, then just say "Not a bug report".
    Please tell if bug report has some quality problems with it formulation (according to our rules),
    summarize them into bullet-points-only sentences filled with context semantics and what needs to be fixed.
    Tell only negative things.
    If bug report fits all the rules, don't generate summary, instead, rate such bug report as "awesome" by answering just "Quality is awesome".
    Even it does not look like a bug report still don't copy the example.
    Rules=[
    ${this.rules.value()}
    ]
    Bug report:
    ${this.report}
    `;
  }
}
