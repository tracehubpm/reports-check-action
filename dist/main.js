"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.github = void 0;
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
const core = __importStar(require("@actions/core"));
const rest_1 = require("@octokit/rest");
const smart_issue_1 = require("./smart-issue");
const comment_1 = require("./comment");
const openai_1 = __importDefault(require("openai"));
const deep_infra_1 = require("./deep-infra");
const chat_gpt_1 = require("./chat-gpt");
const feedback_1 = require("./feedback");
if (process.env.GITHUB_ACTIONS) {
    exports.github = require("@actions/github");
}
else {
    exports.github = {
        context: {
            issue: {
                owner: "test",
                repo: "test",
                number: 123,
                user: {
                    login: "test"
                }
            }
        }
    };
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        console.log("Running bug report check...");
        try {
            const ghToken = core.getInput("github_token");
            if (!ghToken) {
                core.setFailed("`github_token` was not provided");
            }
            const issue = exports.github.context.issue;
            if (issue) {
                console.log(`Found new issue: #${issue.number}`);
                const octokit = new rest_1.Octokit({ auth: ghToken });
                const smart = yield new smart_issue_1.SmartIssue(octokit, issue).fetch();
                const body = smart.body;
                if (!body) {
                    yield new comment_1.Comment(octokit, issue, "@" + ((_a = smart.user) === null || _a === void 0 ? void 0 : _a.login)
                        + " the issue body is empty, please provide more details for this problem.").post();
                    core.setFailed("The issue body is empty");
                }
                const openai = core.getInput("openai_token");
                if (openai) {
                    const model = core.getInput("openai_model");
                    yield new feedback_1.Feedback(yield new chat_gpt_1.ChatGpt(new openai_1.default({ apiKey: core.getInput("openai_token") }), model).analyze(body), octokit, issue, (_b = smart.user) === null || _b === void 0 ? void 0 : _b.login).post();
                }
                else if (core.getInput("deepinfra_token")) {
                    const deepinfra = core.getInput("deepinfra_token");
                    const model = core.getInput("deepinfra_model");
                    const answer = yield new deep_infra_1.DeepInfra(deepinfra, model)
                        .analyze(body);
                    yield new feedback_1.Feedback(answer, octokit, issue, (_c = smart.user) === null || _c === void 0 ? void 0 : _c.login).post();
                }
                else {
                    core.setFailed("Neither `openai_token` nor `deepinfra_token` was not provided");
                }
            }
            else {
                console.log("No opened issue found");
            }
        }
        catch (error) {
            if (error instanceof Error) {
                core.setFailed(error.message);
            }
            else {
                core.setFailed(`An unknown error occurred.
         Please report it here:
         https://github.com/tracehubpm/reports-check-action/issues`);
            }
        }
    });
}
run();
