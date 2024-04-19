/**
 * Prompt to minimize amount of problems by keeping the most important ones.
 */
export class Top implements Scalar<string> {

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
    Take a look at these quality problems that were identified during analysis of the outlined bug report.
    Now, please copy the most important problems into new response.
    Max amount of problems must be 3.
    Don't rephrase problems or generate any other info.
    Problems:
${this.problems}

    Bug report:
${this.report}
    `;
  }
}
