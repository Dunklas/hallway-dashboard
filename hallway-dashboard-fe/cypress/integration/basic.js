describe('Hallway Dashboard', () => {
    beforeEach(() => {
        cy.viewport(2560,1440)
        cy.server();
        cy.route({
            method: 'GET',
            url: '**/weather',
            response: 'fixture:weather'
        });
        cy.route({
            method: 'GET',
            url: '**/public_transport',
            response: 'fixture:public-transport'
        });
    });

    it('Shows some data correct', () => {
        cy.visit('localhost:3000');
        cy.get('[data-test="departure-time"]')
          .first()
          .contains('22:54');
        cy.get('[data-test="weather-temperature"]')
          .first()
          .contains('12');
    });
});