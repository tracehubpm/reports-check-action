/**
 * Markdown unboxed object.
 */
export class MdUnbox implements Scalar<any> {

  /**
   * Ctor.
   * @param response JSON response
   */
  constructor(private readonly response: any) {
  }

  value(): any {
    let result;
    const trimmed = this.response.trim();
    const start = 7;
    if (trimmed.endsWith("```")) {
      const index = trimmed.lastIndexOf("```");
      const sliced = trimmed.slice(0, index) + trimmed.slice(index + 3);
      result = sliced.slice(start).trim();
    } else {
      result = this.response;
    }
    return result;
  }
}
