"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithSummary = void 0;
/**
 * With summary.
 */
class WithSummary {
    /**
     * Ctor.
     * @param origin Origin
     * @param summary Summary
     */
    constructor(origin, summary) {
        this.origin = origin;
        this.summary = summary;
    }
    /**
     * Print with summary attached.
     */
    value() {
        return this.origin.value() +
            `
    ${this.summary}
    `;
    }
}
exports.WithSummary = WithSummary;
