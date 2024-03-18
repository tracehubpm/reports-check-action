import {Octokit} from "@octokit/rest";
import {Base64} from "js-base64";

export class Blob {

  constructor(private readonly github: Octokit) {
  }

  async asText() {
    const response = await this.github.repos.getContent({
      owner: 'tracehubpm', // issue.owner
      repo: 'tracehub', // issue.repo
      ref: 'master', // read default branch
      path: 'src/main/java/git/tracehub/tk/TkGitHub.java' // file path after deterministic parsing
    });
    const encoded = JSON.parse(JSON.stringify(response.data)).content;
    console.log(Base64.decode(encoded));
    // const data = response.data.toString();
    // if (data) {
    //   console.log(JSON.parse(data))
      // const decoded = Base64.decode(JSON.parse(data));
      // console.log(decoded);
    // }
  }
}
