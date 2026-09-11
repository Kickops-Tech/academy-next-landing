declare module "baffle" {
  interface BaffleOptions {
    characters?: string | string[];
    exclude?: string[];
    speed?: number;
  }

  interface BaffleInstance {
    set(options: BaffleOptions): BaffleInstance;
    start(): BaffleInstance;
    stop(): BaffleInstance;
    once(): BaffleInstance;
    reveal(duration?: number, delay?: number): BaffleInstance;
    text(fn: (text: string) => string): BaffleInstance;
  }

  function baffle(
    elements: HTMLElement | HTMLElement[] | NodeList | string,
    options?: BaffleOptions,
  ): BaffleInstance;

  export default baffle;
}
