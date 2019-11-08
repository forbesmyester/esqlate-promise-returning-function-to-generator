"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function streamPromisesAsGenerator(getter, isComplete) {
    return async function* i() {
        let lastResult = await getter();
        while (!isComplete(lastResult)) {
            yield lastResult;
            lastResult = await getter();
        }
    };
}
exports.default = streamPromisesAsGenerator;
