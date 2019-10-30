# Esqlate Promise Returning Function To Generator

Converts a function that returns a Promise, along with a check to decide whether we should continue into a `for-of` generator.


```javascript
type DBLine = [string, string, number];
interface Result<R> {
    command: string;
    fields: { name: string }[],
    rows: R[]
}

function getQueryArrayResults(r: DBLine[]): Result<DBLine> {
    return {
        command: 'SELECT',
        fields: [
            { name: "first_name" },
            { name: "last_name" },
            { name: "age" }
        ],
        rows: r
    };
}

let rows: Result<DBLine>[] = [
    getQueryArrayResults(
        [["matt", "forrester", 39], ["james", "jon", 44], ["bill", "bob", 33]]
    ),
    getQueryArrayResults(
        [["susan", "smith", 39], ["sara", "james", 44], ["boris", "black", 33]]
    ),
    getQueryArrayResults(
        [["alice", "james", 39], ["alex", "halt", 44], ["carl", "blue", 33]]
    ),
];

let cursorIndex: number = 0;

function getter(): Promise<Result<DBLine>> {
    if (cursorIndex++ >= rows.length) {
        return Promise.resolve(getQueryArrayResults([]));
    }
    if (cursorIndex == 2) {
        throw new Error("Error getting result");
    }
    return Promise.resolve(rows[cursorIndex - 1]);
}

function isComplete(r: Result<DBLine>) {
    return r.rows.length === 0;
}

let r: Result<DBLine>[] = [];
try {
    for await (const qar of streamUntil(getter, isComplete)()) {
        r.push(qar);
    }
} catch (e) {
    assert.deepEqual(r, [rows[0]]);
}
```
