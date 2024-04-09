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
import {BlobPath} from "../../src/pdd/blob-path";

/**
 * Test cases for BlobPath.
 */
describe("Test cases for BlobPath", () => {
  test("parses blob path from text", () => {
    expect(
      new BlobPath(
        `
The puzzle \`148-2e63b3d7\` from #148 has to be resolved:

https://github.com/tracehubpm/tracehub/blob/8d2aca048e33a5c9d83a49af4246c9ad7fde9998/parser.ts#L1-L2

The puzzle was created by Aliaksei Bialiauski on 12-Feb-24. 

Estimate: 25 minutes,  role: DEV.
 
If you have any technical questions, don't ask me, submit new tickets instead. The task will be \\"done\\" when the problem is fixed and the text of the puzzle is _removed_ from the source code. Here is more about [PDD](http://www.yegor256.com/2009/03/04/pdd.html) and [about me](http://www.yegor256.com/2017/04/05/pdd-in-action.html). 
`
      ).value()
    ).toEqual("parser.ts#L1-L2");
  });
});
