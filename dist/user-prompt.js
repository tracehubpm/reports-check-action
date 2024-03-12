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
    Please review the quality of following bug report and generate analysis summary.
    If it does not look like a bug report, then just say "Not a bug report".
    If bug report does follow all the rules, please rate such bug report as "awesome" by answering just "Quality is awesome".
    If bug report is too abstract then please reject it by answering "Bug report is too abstract".
    Otherwise, please say what needs to be improved, this must contain only 1-2 sentence bullet points, mainly focusing on the context of the bug report, as well as the rules.
    Each bullet point should start with a context-specific comments, please pay attention to a possible examples in the bug report itself.
    Each bullet point should link the bug report context with the violated rule.
    Print only the bullet points, without any other info.
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
