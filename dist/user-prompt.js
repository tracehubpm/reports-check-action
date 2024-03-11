"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPrompt = void 0;
/**
 * User prompt.
 */
class UserPrompt {
    /**
     * Ctor.
     *
     * @param example Example
     * @param rules Rules
     * @param report Bug report
     */
    constructor(example, rules, report) {
        this.example = example;
        this.rules = rules;
        this.report = report;
    }
    /**
     * Build user prompt.
     */
    value() {
        return `
    Please review the quality of following bug report.
    If it does not look like a bug report, then just say "Not a bug report".
    If bug report does follow all the rules, please rate such bug report as "awesome" by answering just "Quality is awesome".
    Otherwise, please say what needs to be improved, this must contain only 1-2 sentence bullet points, mainly focusing on the context of the bug report, as well as the rules.
    Each bullet point should link the bug report context with rules.
    Bullet point should contain comments that are context-specific.
    Print only the statements, without any other info.
    Please strictly adhere to the example template provided.
    Example of analysis summary:
    ${this.example.value()}.
    Rules=[
    ${this.rules.value()}
    ]
    Bug report:
    ${this.report}
    `;
    }
}
exports.UserPrompt = UserPrompt;
