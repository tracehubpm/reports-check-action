"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueBody = void 0;
/**
 * Issue body.
 *
 * @since 0.0.2
 */
class IssueBody {
    /**
     * Ctor.
     * @param github Github
     * @param issue Issue
     */
    constructor(github, issue) {
        this.github = github;
        this.issue = issue;
    }
    /**
     * Fetch issue's body.
     */
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: object } = yield this.github.issues.get({
                owner: this.issue.owner,
                repo: this.issue.repo,
                issue_number: this.issue.number,
            });
            return object.body;
        });
    }
}
exports.IssueBody = IssueBody;
