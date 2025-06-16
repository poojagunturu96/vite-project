export {};

declare global {
  interface Window {
    drupalSettings: {
      path: {
        baseUrl: string;
        currentPath: string;
      };
    };
    MicroModal: any;
    Chart: any;
  }
}
