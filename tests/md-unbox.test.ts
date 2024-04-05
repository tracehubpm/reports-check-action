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
import {MdUnbox} from "../src/md-unbox";

/**
 * Test cases for MdUnbox.
 */
describe('Test cases for MdUnbox', () => {
  test('unboxes markdown from JSON object', () => {
    const response = `
    \`\`\`json
    {"test": true}
    \`\`\`
    `;
    expect(new MdUnbox(response).value()).toBe("{\"test\": true}");
  });
  test('returns origin response', () => {
    const response = `
    {"test": true}
    `;
    expect(new MdUnbox(response).value()).toBe(`
    {"test": true}
    `
    );
  });
  test('unboxes more complex case', () => {
    const response = `
    \`\`\`json
{
  "suggestions": [
    "Clear and concise description: Please add a clear and concise description of the issue. This will help developers understand the problem and work on a solution efficiently. For example, 'There are two typos in the \`binding\` rule of the Phi.g4 grammar file. The correct grammar rules should be \`deltaBinding\` and \`lambdaBinding\` instead of \`deltaBidning\` and \`lambdaBidning\`.'",
    "Expected and current behavior: It would be helpful to know when these typos occur, what is the expected behavior, and the current behavior with the typos. This information will assist in verifying the solution and ensuring that the issue is resolved completely.",
    "Severity and impact: Mention the severity and impact of the issue on the code or functionality. This will help developers prioritize the bug and decide when to fix it. For example, 'These typos might cause the parser to misunderstand the \`binding\` rule and lead to unexpected parsing results.'",
    "Suggested fix: If you have already identified a possible solution, please provide a suggestion on how to fix the issue. For example, 'A possible fix for this issue is to replace \`deltaBidning\` and \`lambdaBidning\` with their correct counterparts, \`deltaBinding\` and \`lambdaBinding\`, in the \`binding\` rule of the Phi.g4 grammar file.'",
    "\`\`\`antlr binding : alphaBinding | emptyBinding | deltaBinding | lambdaBinding ; \`\`\`"
  ]
}
\`\`\`
    `;
    expect(new MdUnbox(response).value())
      .toBe(
`{
  "suggestions": [
    "Clear and concise description: Please add a clear and concise description of the issue. This will help developers understand the problem and work on a solution efficiently. For example, 'There are two typos in the \`binding\` rule of the Phi.g4 grammar file. The correct grammar rules should be \`deltaBinding\` and \`lambdaBinding\` instead of \`deltaBidning\` and \`lambdaBidning\`.'",
    "Expected and current behavior: It would be helpful to know when these typos occur, what is the expected behavior, and the current behavior with the typos. This information will assist in verifying the solution and ensuring that the issue is resolved completely.",
    "Severity and impact: Mention the severity and impact of the issue on the code or functionality. This will help developers prioritize the bug and decide when to fix it. For example, 'These typos might cause the parser to misunderstand the \`binding\` rule and lead to unexpected parsing results.'",
    "Suggested fix: If you have already identified a possible solution, please provide a suggestion on how to fix the issue. For example, 'A possible fix for this issue is to replace \`deltaBidning\` and \`lambdaBidning\` with their correct counterparts, \`deltaBinding\` and \`lambdaBinding\`, in the \`binding\` rule of the Phi.g4 grammar file.'",
    "\`\`\`antlr binding : alphaBinding | emptyBinding | deltaBinding | lambdaBinding ; \`\`\`"
  ]
}`
      );
  });
});
