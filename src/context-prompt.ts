/**
 * Prompt to enhance problems formulation.
 */
export class ContextPrompt implements Scalar<string> {

  /**
   * Ctor.
   * @param problems Problems
   * @param report Report
   */
  constructor(
    private readonly problems: any,
    private readonly report: string
  ) {
  }

  value(): string {
    return `
    Transform existing problem statements into more context-specific statements,
    related to the provided bug report. 
    Please strictly adhere the provided response template.
    Don't generate any other info.
    Response example: 
    [
      "...",
      "...",
      "...",
      "...",
      "..." 
    ]
    Problems:
${this.problems}

    Bug report:
${this.report}
    `;
  }
}
