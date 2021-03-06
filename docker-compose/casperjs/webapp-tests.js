casper.options.viewportSize = { width: 1600, height: 950 };
casper.options.pageSettings.loadImages = false;
casper.on('page.error', function (msg, trace) {
  this.echo('Error: ' + msg, 'ERROR');
  for (var i = 0; i < trace.length; i++) {
    var step = trace[i];
    this.echo('   ' + step.file + ' (line ' + step.line + ')', 'ERROR');
  }
});


//Get defaults

const INIT_URL = casper.cli.get('initial-url') || 'http://localhost:3000';
const USR = casper.cli.get('username') || 'asdasd';
const PWD = casper.cli.get('password') || 'asdasd';

casper.test.begin('Should Log in to the WebApp', function (test) {
  casper.start(INIT_URL);
  casper.echo("Launching URL " + INIT_URL);

  casper.waitUntilVisible("#qsLogoutBtn",
    function success() {
      this.echo("User was already logged in. Logging out first..");
      this.click('#qsLogoutBtn');
    },
    function timeout() {
      //Ignore this
    }, 5000);
  casper.waitUntilVisible("#qsLoginBtn",
    function success() {
      this.echo("Navigation bar found. Clicking Log In button");
      this.click('#qsLoginBtn');
    },
    function timeout() {
      //Ignore this
      this.capture('screenshots/APP/00-no-navigation.png');
      this.echo("Home Page didn't contain the expected Navigation Bar");
    }, 5000);
  casper.waitForUrl(/.auth0.com\/login\?/,
    function success() {
      test.assertUrlMatch(/.auth0.com\/login\?/, 'Auth0 Login page is shown');
      this.capture('screenshots/APP/00-login-page.png');
    },
    function timeout() {
      this.capture('screenshots/APP/00-login-page-error.png');
      this.test.fail("Failed to load the Auth0 Login page");
    }, 10000);
  casper.waitUntilVisible("input[name='password']",
    function success() {
      this.echo("Lock Username & Password fields are visible");
      if (this.exists("input[name='email']")) {
        this.click("form input[name='email']");
        this.sendKeys("input[name='email']", USR);
      } else {
        this.click("form input[name='username']");
        this.sendKeys("input[name='username']", USR);
      }
      this.click("form input[name='password']");
      this.sendKeys("input[name='password']", PWD);
      this.capture('screenshots/APP/01-form-completed.png');
      this.click(".auth0-lock-widget-container .auth0-lock-submit");
    }, null, 10000);
  casper.wait(1000, function () {
    test.assertNotVisible('.a0-header.a0-top-header .a0-error', "Lock doesn't show errors (A)");
    test.assertNotVisible('.auth0-global-message.auth0-global-message-error', "Lock doesn't show errors (B)");
  });
  casper.waitForText("Authorize App", function success() {
    this.click("#authorize-modal #allow");
  }, function fail() {
    //ignored
  }, 5000);
  casper.waitUntilVisible("#qsLogoutBtn",
    function success() {
      test.assertVisible('#qsLogoutBtn', "User is logged in");
    },
    null, 5000);

  casper.run(function () {
    test.done();
  });
});