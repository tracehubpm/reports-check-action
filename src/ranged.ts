export class Ranged {

  constructor(private readonly content: string[], private readonly range: any) {
  }

  asText() {
    let result;
    if (this.range.includes('-')) {
      const start = this.range.split("-")[0] - 1;
      const end = this.range.split("-")[1];
      result = this.content.splice(start, end).join("\r\n");
    } else if (parseInt(this.range)) {
      result = this.content[parseInt(this.range) - 1];
    }
    return result;
  }
}
