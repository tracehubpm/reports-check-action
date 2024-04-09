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
 * Ranged blob.
 */
export class Ranged implements Scalar<Promise<any>> {

  /**
   * Ctor.
   * @param origin Origin
   * @param range Range
   */
  constructor(
    private readonly origin: Scalar<string[]>,
    private readonly range: any
  ) {
  }

  /**
   * Blob as text.
   */
  async value() {
    const content = this.origin.value();
    const value = this.range.value();
    let result;
    if (value.includes('-')) {
      const start = value.split("-")[0] - 1;
      const end = value.split("-")[1];
      result = content.splice(start, end).join("\r\n");
    } else if (parseInt(value)) {
      result = content[parseInt(value) - 1];
    }
    return result;
  }
}
