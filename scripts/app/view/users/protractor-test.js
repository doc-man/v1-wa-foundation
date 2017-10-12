describe('Create a new user from masterdb', function() {
	it('from Master DB ;authorUID=760;url=https://gitlab.com/savantcare/sc-wa-masterdb/blob/master/scripts/app/view/users/protractor-test.js', function () {
		browser.get('https://staging.savantcare.com/v3/app/masterdb/');

		exports.getRandomEmail = function () {
			var strValues = "abcdefghijklmnopz123456789";
			var strEmail = "protector-";
			for (var i = 0; i < strValues.length; i++) {
				strEmail = strEmail + strValues.charAt(Math.round(strValues.length * Math.random()));
			}
			return strEmail + "@test.com";
		};
		element(by.id('userOfMasterDb')).click();
		element(by.id('addUserFromMdb')).click();
		element(by.id('fname')).sendKeys('Protractor');
		element(by.id('lname')).sendKeys('User');
		element(by.id('dob')).sendKeys('02-05-1995');
		element(by.id('email')).sendKeys(exports.getRandomEmail());
		element(by.id('gender')).click().sendKeys(protractor.Key.ARROW_DOWN).sendKeys(protractor.Key.ENTER);
		element(by.id('role')).click().sendKeys(protractor.Key.ARROW_DOWN).sendKeys(protractor.Key.ARROW_DOWN).sendKeys(protractor.Key.ARROW_DOWN).sendKeys(protractor.Key.ARROW_DOWN).sendKeys(protractor.Key.ARROW_DOWN).sendKeys(protractor.Key.ENTER);
		element(by.id('password')).click().sendKeys('123');
		var submitButton = element(by.id('forProtractorTestSubmit'));
		submitButton.click();
		expect(submitButton.isPresent()).toBe(true);
	}, 80000);
});
