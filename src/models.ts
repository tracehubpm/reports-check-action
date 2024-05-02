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
import {NamedGoal} from "./goals/named-goal";
import {Default} from "./prompts/default";
import {MdProblems} from "./prompts/md-problems";
import {Validate} from "./prompts/validate";
import {QualityExpert} from "./prompts/quality-expert";
import {Analyze} from "./prompts/analyze";
import {MdSuggestions} from "./prompts/md-suggestions";
import {Suggestions} from "./prompts/suggestions";
import {Polish} from "./prompts/polish";
import {Top} from "./prompts/top";
import {OneSuggestion} from "./prompts/one-suggestion";

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
    const problems = await new NamedGoal(
      "polish",
      this.def,
      new Default(),
      new Polish(
        await new NamedGoal(
          "top",
          this.def,
          new Default(),
          new Top(
            await new NamedGoal(
              "validate.md",
              this.def,
              new Default(),
              new MdProblems(
                await new NamedGoal(
                  "validate",
                  this.validator,
                  new Default(),
                  new Validate(
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
            report
          )
        ).exec()
      )
    ).exec();
    const suggestion = await new NamedGoal(
      "one",
      this.def,
      new Default(),
      new OneSuggestion(
        problems,
        await new NamedGoal(
          "suggestions.md",
          this.def,
          new Default(),
          new MdSuggestions(
            await new NamedGoal(
              "suggestions",
              this.def,
              new Default(),
              new Suggestions(
                report,
                problems
              )
            ).exec()
          )
        ).exec(),
        report
      )
    ).exec();
    return {
      problems: problems,
      suggestion: suggestion
    }
  }
}
