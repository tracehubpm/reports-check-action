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
  })
  test('returns complex JSON if no backticks', () => {
    const response = `
    {
    "suggestions": [
       "Clear and descriptive title: The title should be more specific, concise, and summarize the issue. For example: \\"Incorrect naming of binding types in Phi.g4 grammar file\\".",
       "Detailed description: The description should include more context and explanation about the issue. Consider including: - A summary of what you were expecting to happen - A description of the exact issue or error message you encountered - The steps you took to reproduce the issue - Any additional information that might be helpful for reproducing or fixing the issue (e.g. a code snippet, a link to a relevant file or documentation, etc.)",
       "Steps to reproduce the issue: It would be helpful to include a step-by-step guide on how to reproduce the issue. This can help developers understand the problem better and more efficiently pinpoint the root cause.",
       "Expected behavior and actual behavior: As mentioned earlier, it is crucial to include details about what you expected to happen versus what actually happened. This information helps developers understand the severity and impact of the bug.",
       "Screenshots or code snippets: If applicable, including screenshots or code snippets can significantly aid in reproducing and understanding the issue.",
       "Version information: It is useful to provide information about the version of the software you are using. This can help developers determine if the issue is specific to a certain version or if it is a general problem.",
       "Priority or Severity: Consider adding a priority or severity level to the bug report, which can help developers understand the urgency of the issue.",
       "Additional labels or tags: Depending on the bug tracking system, you may have the ability to add additional labels or tags to the bug report. These can help categorize and filter the bug report for easier access for developers."
      ]
    }
    `;
    expect(new MdUnbox(response).value())
      .toBe(response);
  });
});
