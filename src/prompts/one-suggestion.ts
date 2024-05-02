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
 * One suggestion.
 */
export class OneSuggestion implements Scalar<string> {

  /**
   * Ctor.
   * @param probmels Problems
   * @param suggestions Suggestions
   * @param report Report
   */
  constructor(
    private readonly probmels: any,
    private readonly suggestions: any,
    private readonly report: string
  ) {
  }

  value(): string {
    return `
    Take a look at suggestions we propose for solving outlined problems with quality
    of following bug report. Such long list of suggestions is absolutely useless.
    Nobody reads it and nobody pays attention. In order to be useful,
    please suggest only one specific improvement to be made.
    The suggestion must be short, less than 30 words.
    Start suggestion with the text "I would recommend ...".
    
    Suggestions:
${this.suggestions}

    Problems:
${this.probmels}

    Report:
${this.report}
    `
  }
}
