// Run with: node --test tests/
const test = require("node:test");
const assert = require("node:assert/strict");
const { SAMPLE_REQUESTS, EMPTY_MESSAGE, filterRequests, countText, priorityLabel } = require("../app.js");

const ids = (list) => list.map((r) => r.id);

test("AC1: All shows every sample request", () => {
  const visible = filterRequests(SAMPLE_REQUESTS, "All");
  assert.equal(visible.length, 8);
  assert.equal(countText(visible.length, SAMPLE_REQUESTS.length), "Showing 8 of 8 requests");
});

test("AC2: High shows exactly #1, #3, #7", () => {
  const visible = filterRequests(SAMPLE_REQUESTS, "High");
  assert.deepEqual(ids(visible), [1, 3, 7]);
  assert.equal(countText(visible.length, SAMPLE_REQUESTS.length), "Showing 3 of 8 requests");
});

test("AC3: Medium shows #4, #6 and Low shows #2, #5", () => {
  assert.deepEqual(ids(filterRequests(SAMPLE_REQUESTS, "Medium")), [4, 6]);
  assert.deepEqual(ids(filterRequests(SAMPLE_REQUESTS, "Low")), [2, 5]);
});

test("AC4: All keeps the original order", () => {
  assert.deepEqual(ids(filterRequests(SAMPLE_REQUESTS, "All")), [1, 2, 3, 4, 5, 6, 7, 8]);
});

test("AC5: request with no priority appears only under All", () => {
  for (const level of ["High", "Medium", "Low"]) {
    assert.ok(!ids(filterRequests(SAMPLE_REQUESTS, level)).includes(8), level);
  }
  assert.ok(ids(filterRequests(SAMPLE_REQUESTS, "All")).includes(8));
});

test("AC7: a priority with no matches returns no rows", () => {
  const noLow = SAMPLE_REQUESTS.filter((r) => r.priority !== "Low");
  const visible = filterRequests(noLow, "Low");
  assert.equal(visible.length, 0);
  assert.equal(countText(visible.length, noLow.length), "Showing 0 of 6 requests");
  assert.equal(EMPTY_MESSAGE, "No requests match this filter.");
});

test("Filtering never changes the source data", () => {
  const before = JSON.stringify(SAMPLE_REQUESTS);
  for (const f of ["All", "High", "Medium", "Low"]) filterRequests(SAMPLE_REQUESTS, f);
  assert.equal(JSON.stringify(SAMPLE_REQUESTS), before);
});

test("Rule 5: unrecognized priorities are labeled Unspecified and shown only under All", () => {
  for (const value of ["", undefined, "Urgent", "high"]) {
    assert.equal(priorityLabel(value), "Unspecified", String(value));
  }
  for (const level of ["High", "Medium", "Low"]) assert.equal(priorityLabel(level), level);
  const withUrgent = [...SAMPLE_REQUESTS, { id: 9, requester: "X", item: "Y", priority: "Urgent", submitted: "2026-11-10" }];
  for (const level of ["High", "Medium", "Low"]) {
    assert.ok(!ids(filterRequests(withUrgent, level)).includes(9), level);
  }
  assert.ok(ids(filterRequests(withUrgent, "All")).includes(9));
});
