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
    if (this.response.startsWith("```") && this.response.endsWith("```")) {
      result = this.response.slice(3, -3);
    } else {
      result = this.response;
    }
    return result
  }
}
