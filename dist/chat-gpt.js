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
exports.ChatGpt = void 0;
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
const quality_expert_1 = require("./quality-expert");
const user_prompt_1 = require("./user-prompt");
const example_1 = require("./example");
const rules_1 = require("./rules");
/**
 * ChatGPT model.
 */
class ChatGpt {
    /**
     * Ctor.
     * @param open Open AI
     * @param model Model name
     */
    constructor(open, model) {
        this.open = open;
        this.model = model;
    }
    analyze(report) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield this.open.chat.completions.create({
                model: this.model,
                temperature: 0.1,
                messages: [
                    {
                        role: "system",
                        content: new quality_expert_1.QualityExpert().value()
                    },
                    {
                        role: "user",
                        content: new user_prompt_1.UserPrompt(new example_1.Example(), new rules_1.Rules(), report).value()
                    }
                ]
            });
            return (_a = response.choices[0].message.content) === null || _a === void 0 ? void 0 : _a.trim();
        });
    }
}
exports.ChatGpt = ChatGpt;
