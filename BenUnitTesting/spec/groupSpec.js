describe("Nothing entered into the person constructor can break it", () => {
  it("normal string", function () {
    let ben = new person("ben");
    expect(ben.name).toBe("ben");
  });
  it("undef", function () {
    expect(function () {
      new person(undefined);
    }).toThrow(new Error("string req"));
  });
  it("numbers", function () {
    expect(function () {
      new person(12);
    }).toThrow(new Error("string req"));
  });
  it("objects", function () {
    let ben = new person("ben");
    expect(function () {
      new person(ben);
    }).toThrow(new Error("string req"));
  });
});
describe("group creating", () => {
  beforeEach(() => {
    a = new person("a");
    b = new person("b");
    c = new person("c");
    d = new person("d");
    e = new person("e");
  });
  it("normal", function () {
    let g = new group([a, b]);
    expect(g.groupsize).toBe(2);
  });
  it("non array", function () {
    expect(function () {
      new group(a);
    }).toThrow(new Error("array req"));
  });
  it("array of non people", function () {
    let g = new group([1, 2]);
    expect(g.groupsize).toBe(2);
  });
});
describe("making payments", () => {
  beforeEach(() => {
    a = new person("a");
    b = new person("b");
    c = new person("c");
    g = new group([a, b, c]);
  });
  it("make payment splits up correctly", function () {
    g.makePayment(a, 12);
    expect(a.total).toBe(8);
    expect(b.total).toBe(-4);
    expect(c.total).toBe(-4);
  });
  it("make payment splits up correctly with gross numbers", function () {
    g.makePayment(a, 11);
    expect(a.total + b.total + c.total).toBeCloseTo(0);
  });
  it("make payment splits up correctly with gross numbers", function () {
    g.makePayment(a, 153.21);
    expect(a.total + b.total + c.total).toBeCloseTo(0);
  });
  it("make payment splits up correctly with multiple payments", function () {
    g.makePayment(a, 11);
    g.makePayment(b, 21);
    g.makePayment(c, 2);
    expect(a.total + b.total + c.total).toBeCloseTo(0);
  });
});
describe("creating lists", () => {
  beforeEach(() => {
    a = new person("a");
    b = new person("b");
    c = new person("c");
    g = new group([a, b, c]);
  });
  it("make lists fills pos and neg", function () {
    g.makePayment(a, 12);
    g.makeLists();
    expect(g.neg[0]).toBe(b);
    expect(g.neg[1]).toBe(c);
    expect(g.pos[0]).toBe(a);
  });
  it("pos and neg are undefined when no transactions", () => {
    g.makeLists();
    expect(g.neg[0]).toBe(undefined);
    expect(g.pos[0]).toBe(undefined);
  });
});
describe("calculating payments", () => {
  beforeEach(() => {
    a = new person("a");
    b = new person("b");
    c = new person("c");
    g = new group([a, b, c]);
  });
  it("calculate fill the transaction log", function () {
    g.makePayment(a, 12);
    g.calculate();
    expect(g.transaction).toHaveSize(2);
    expect(g.transaction).toContain([b, a, 4]);
    expect(g.transaction).toContain([c, a, 4]);
  });
  it("calculate with multiple payments", function () {
    g.makePayment(a, 12);
    g.makePayment(a, 9);
    g.makePayment(c, 18);
    g.calculate();
    console.log(g.transaction[0]);
    expect(g.transaction).toHaveSize(2);
    expect(g.transaction).toContain([b, a, 8]);
  });
  it("calculate with no payments", function () {
    g.calculate();
    expect(g.transaction).toHaveSize(1);
  });
});
