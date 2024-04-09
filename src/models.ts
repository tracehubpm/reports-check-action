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
import {TopGoal} from "./goals/top-goal";
import {NamedGoal} from "./goals/named-goal";
import {Default} from "./prompts/default";
import {JsonProblemsPrompt} from "./prompts/json-problems-prompt";
import {ValidatePrompt} from "./prompts/validate-prompt";
import {QualityExpert} from "./prompts/quality-expert";
import {Analyze} from "./prompts/analyze";
import {SuggestionsJsonPrompt} from "./prompts/suggestions-json-prompt";
import {SuggestionsPrompt} from "./prompts/suggestions-prompt";

/**
 * Models.
 */
export class Models {

  /**
   * Ctor.
   * @param def Default model
   * @param validator Model for validation
   */
  constructor(
    private readonly def: Model,
    private readonly validator: Model
  ) {
  }

  async compose(report: string) {
    const candidate = await new TopGoal(
      this.def,
      report,
      await new NamedGoal(
        "json-validate",
        this.def,
        new Default(),
        new JsonProblemsPrompt(
          await new NamedGoal(
            "validate",
            this.validator,
            new Default(),
            new ValidatePrompt(
              report,
              await new NamedGoal(
                "analyze",
                this.def,
                new QualityExpert(),
                new Analyze(report)
              ).exec()
            )
          ).exec()
        )
      ).exec(),
    ).exec();
    const suggestions = await new NamedGoal(
      "json-suggestions",
      this.def,
      new Default(),
      new SuggestionsJsonPrompt(
        await new NamedGoal(
          "suggestions",
          this.def,
          new Default(),
          new SuggestionsPrompt(
            report,
            candidate
          )
        ).exec()
      )
    ).exec();
    return {
      problems: candidate,
      suggestions: suggestions
    }
  }
}
