export class BM25 {
  private k1: number;
  private b: number;
  private docTokens: string[][];
  private docLengths: number[];
  private avgDocLength: number;
  private docFrequencies: Map<string, number>;
  private N: number;

  constructor(documents: string[], k1 = 1.5, b = 0.75) {
    this.k1 = k1;
    this.b = b;
    this.N = documents.length;
    this.docTokens = documents.map(doc => this.tokenize(doc));
    this.docLengths = this.docTokens.map(toks => toks.length);
    this.avgDocLength = this.docLengths.reduce((a, b) => a + b, 0) / (this.N || 1);
    this.docFrequencies = new Map();

    for (const tokens of this.docTokens) {
      const uniqueTokens = new Set(tokens);
      for (const token of uniqueTokens) {
        this.docFrequencies.set(token, (this.docFrequencies.get(token) || 0) + 1);
      }
    }
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase().match(/[a-z0-9#+.]+/g) || [];
  }

  public score(queryTerms: string[], docIndex: number): number {
    if (docIndex >= this.N) return 0;
    const tokens = this.docTokens[docIndex];
    const docLen = this.docLengths[docIndex];

    const termCounts = new Map<string, number>();
    for (const t of tokens) {
      termCounts.set(t, (termCounts.get(t) || 0) + 1);
    }

    let score = 0;
    for (const term of queryTerms) {
      const q = term.toLowerCase();
      const tf = termCounts.get(q) || 0;
      if (tf === 0) continue;

      const df = this.docFrequencies.get(q) || 0;
      const idf = Math.log(1 + (this.N - df + 0.5) / (df + 0.5));
      const tfComponent = (tf * (this.k1 + 1)) / (tf + this.k1 * (1 - this.b + this.b * (docLen / this.avgDocLength)));

      score += idf * tfComponent;
    }

    return score;
  }
}
