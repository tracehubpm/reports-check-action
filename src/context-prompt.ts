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
    Enhance the problem formulations with a more context of provided bug report.
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
