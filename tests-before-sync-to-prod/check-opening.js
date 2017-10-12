// spec.js content e.g.
describe('SC MasterDb', function() {
    it('SC masterdb section is loading properly', function () {
        browser.get('https://staging.savantcare.com/v3/app/masterdb/#/');
        loginURL = 'https://staging.savantcare.com/v3/app/masterdb/#/';
        expect(browser.getCurrentUrl()).toEqual(loginURL);
    });

    it('checking title @Kiran Kumar', function() {
        browser.get('https://staging.savantcare.com/v3/app/masterdb/#/');
        expect(browser.getTitle()).toEqual('Master DB');
    });
});


