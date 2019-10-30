
export function streamUntil<R>(getter: () => Promise<R>, isComplete: (r: R) => boolean): () => AsyncIterableIterator<R> {

    return async function* i() {
        let lastResult: R = await getter();
        while (!isComplete(lastResult)) {
            yield lastResult;
            lastResult = await getter();
        }
    };
}
