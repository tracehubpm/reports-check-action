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
    const match = this.response.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match.length > 1) {
      result = match[1];
    } else {
      result = this.response;
    }
    return result;
  }
}
