describe('nx-rs-front', () => {
  beforeEach(() => cy.visit('/'));

  it('should display container with game of life', () => {
    cy.getByDataTest('game-of-life-title').contains("Game of Life");
  });
});
