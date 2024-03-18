import {Octokit} from "@octokit/rest";

export class Blob {

  constructor(private readonly github: Octokit) {
  }

  async asText() {
    const content = await this.github.repos.getContent({
      owner: 'tracehubpm', // issue.owner
      repo: 'tracehub', // issue.repo
      ref: 'master', // read default branch
      path: 'src/main/java/git/tracehub/tk/TkGitHub.java' // file path after deterministic parsing
    });
    console.log(content);
  }
}
