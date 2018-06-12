describe("Maaaath", function() {

  it("should be able to add two numbers", function() {
    expect(add(2,3)).toEqual(5);
  });

  it("should be able to subtract numbers", function() {
    expect(subtract(5,8)).toEqual(-3);
  });

  it("should be able to multiply two integers", function() {
    expect(multiply(2,3)).toEqual(6);
  });

  it("should be able to divide an integer by a non-zero integer", function() {
    expect(divide(6,2)).toEqual(3);
  });

  it("should be able to handle division by zero", function() {
    expect(divide(6,0)).toBeNaN();
  });
});
