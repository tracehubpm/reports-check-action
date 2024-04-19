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
 * Prompt to format suggestions to JSON.
 */
export class MdSuggestions implements Scalar<string> {

  /**
   * Ctor.
   * @param suggestions Suggestions
   */
  constructor(private readonly suggestions: any) {
  }

  value(): string {
    return `
    Please combine provided suggestions text into logical array of suggestions and format these response to Markdown array format. 
    Each suggestion must be represented as an array member.
    It's very important to split text into array members in a smart way using logic.
    Please strictly adhere the provided example template.
    Response must contain only markdown star(*) array without any extra text or info.
    Don't rephrase suggestions or generate any other info.
    Example:
    * ...
    * ...
    * ...
    Suggestions:
${this.suggestions}
    `;
  }
}
