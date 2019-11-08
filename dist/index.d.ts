export default function streamPromisesAsGenerator<R>(getter: () => Promise<R>, isComplete: (r: R) => boolean): () => AsyncIterableIterator<R>;
