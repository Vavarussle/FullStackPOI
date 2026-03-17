import { assert } from "chai";

export function assertSubset(subset, superset) {
  // If subset is null/undefined, it's only a subset if superset is also null/undefined
  if (subset === null || subset === undefined) {
    assert.equal(subset, superset);
    return;
  }

  // If subset is a primitive, compare directly
  if (typeof subset !== "object") {
    assert.equal(subset, superset);
    return;
  }

  // If subset is an object but superset is not, they can't match
  if (typeof superset !== "object" || superset === null) {
    assert.fail("Superset is not aa matching object");
    return;
  }

  // Handle Date objects - both must be Dates with equal values
  if (subset instanceof Date) {
    assert.isInstanceOf(superset, Date);
    assert.equal(subset.valueOf(), superset.valueOf());
    return;
  }

  // Handle arrays - every element in subset must exist in superset
  if (Array.isArray(subset)) {
    assert.isArray(superset);
    assert.equal(subset.length, superset.length);
    // For each element in subset, find a matching element in superset
    for (let i = 0; i < subset.length; i += 1) {
      assertSubset(subset[i], superset[i]);
    }
    return;
  }

  // Handle objects - every key-value pair in subset must exist in superset
  Object.keys(subset).forEach((key) => {
    assert.property(superset, key);
    const subsetValue = subset[key];
    const supersetValue = superset[key];

    if (
      subsetValue &&
      supersetValue &&
      typeof subsetValue === "object" &&
      typeof supersetValue === "object" &&
      subsetValue.toString &&
      supersetValue.toString &&
      subsetValue.constructor?.name === "ObjectId"
    ) {
      assert.equal(supersetValue.toString(), subsetValue.toString());
    } else {
      assertSubset(subsetValue, supersetValue);
    }
  });
}