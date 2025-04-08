export function sum(a: number, b: number): number {
    return a + b;
}


export function fetchData(callback: (data: string) => void): void {
    setTimeout(() => {
      callback('data');
    }, 1000);
}