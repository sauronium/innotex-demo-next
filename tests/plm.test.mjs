import test from "node:test";
import assert from "node:assert/strict";
import { canRelease, initialState, instantiate, reviseProduct, stages } from "../lib/plm.ts";

test("a shared SKU creates independent specifications and approvals", () => {
  const master = structuredClone(initialState.skus[0]);
  const first = instantiate(master);
  const second = instantiate(master);
  first.spec.colour = "Red";
  first.checks.push("0-0");
  assert.notEqual(first.id, second.id);
  assert.equal(second.spec.colour, "Navy");
  assert.equal(master.colour, "Navy");
  assert.deepEqual(second.checks, []);
  master.fabric = "New master fabric";
  master.revision++;
  assert.notEqual(first.spec.fabric, master.fabric);
  assert.equal(first.baseRevision, 1);
});

test("release requires every lifecycle check and an approved latest sample", () => {
  const product = structuredClone(initialState.projects[0].products[0]);
  assert.equal(canRelease(product), true);
  product.checks.pop();
  assert.equal(canRelease(product), false);
  product.checks.push("7-1");
  product.samples.push({ ...product.samples[0], result: "Pending" });
  assert.equal(canRelease(product), false);
  product.samples.at(-1).result = "Rejected";
  assert.equal(canRelease(product), false);
  product.samples = [];
  assert.equal(canRelease(product), false);
});

test("a revision invalidates release and preserves earlier evidence", () => {
  const previous = structuredClone(initialState.projects[0].products[0]);
  const revised = reviseProduct(previous, { ...previous.spec, branding: "Updated logo" });
  assert.equal(revised.revision, 2);
  assert.equal(revised.released, false);
  assert.equal(canRelease(revised), false);
  assert.deepEqual(revised.checks, []);
  assert.deepEqual(revised.samples, []);
  assert.deepEqual(revised.history[0].samples, previous.samples);
  assert.equal(revised.history[0].spec.branding, previous.spec.branding);
  assert.equal(previous.released, true);
  assert.equal(reviseProduct(revised, revised.spec).history.length, 2);
});

test("product categories have specialised testing and fit requirements", () => {
  const apparel = stages("Performance apparel");
  const workwear = stages("Industrial workwear");
  const textiles = stages("Technical textiles");
  assert.equal(apparel.length, 8);
  assert.match(apparel[5].tasks[0], /moisture/);
  assert.match(workwear[5].tasks[0], /safety/);
  assert.match(textiles[5].tasks[0], /tensile/);
  assert.notDeepEqual(apparel[4].tasks, textiles[4].tasks);
});
