const nL = async (comment) => {
  // Imports the Google Cloud client library
  const language = require('@google-cloud/language');

  // Instantiates a client
const option={
	credentials:{
		client_email:'lollinserver@lollinserver.iam.gserviceaccount.com',
		private_key:'-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDMI3VTwZVL7YOj\ngEc3hn3H3F/bTh/DhQNGeeV4QJRRAALqpvSPcPsecAo7mqOSbx1sisDXU7EkhNk6\nyGLY0pEx6ez5nffduZOEuuAV1Pn44nA2lo0IhhzYCa2vRngebwxRTGQpP6bP3Y4+\nDBjaboUuwm34++yDaWQiyiYhZzgBY/KsACy6EM0/Piq8wG6zpXoYulrOn42wtuYd\nukabjH3y/a7hYB6cQPoKfavuD/FjqYRMQuKvPKhc12b9odDKiWgH+SBNwDY576QP\nqIBM295s0zMb48DqRDNku0roR0puLb5177qcYtqAGwD3CacIQByCJTcIhfEXSno4\nFb0Y6fepAgMBAAECggEACgpucW2yobbvhCHBnv4K/sMcpeVMU6odtKA3RLhscyV8\nfz0yB0In3+Hj5vWeuQulF1slzBGOQ30TUDxd/EszIBDg+pAmCm5fzqYAcqJ0nyTI\nHy89hZ9PGOM0+0uMifatVOxcetjqJAxCPFQM/uVzwI6IqTf+9KHA7qMhx//TNeI1\npXJx/0aSDkv8dLlaMEDSN3tZDzGF9IzN6Pe2xC8CsT7hIb7R8uMw4xI/JZHQozZl\nUW7OUqLl8y/WNj5PwNQksF8qBKAF9PeARb/Uev/7mTmR4yB+lB4H1NHLNHnSQegw\nJnJe2TKyDBIp6C808CLWWg4OaIdr+UmzXe7+ubtjOQKBgQDp0kY4yLAGnToaguYp\n6KUpFw0hBgWHYzUSOnameyAoKgEHZMU0v2YqSPLZcEqHj5bVOSMiEsIlke94Q4sw\nLtpgI88T+2wpxWKYAUlIWdGHMi+leQsl9DJScOp5dLsbF6KlIz1EInwgsbo6WhBw\niTkD9q3LMLQJBwGvJ6wTgJc5jQKBgQDfgGo5DsHB1rSgY/Vvq26rHttxaWoBX4Oe\nJATJyfS+RvnYPR1/vtL3mjho9gLdk4Emc6UxJj/GfRgvrvfaiBNzssdXgZ4jU/5Q\n7ikJvghY9bEVvaifCtQi4VdjUY4cslp9xkle9p8xB4Bs2DWZgG9zU6TPlXDmD8EY\n6+6DnaKZjQKBgHxYGofwEcwyqMeYfRYkZlCntY+uSBpro7mB5b87EyrIy6tG56jZ\ncFdkW+FOWhQlRC04KXrhRuX76cGnCcoh4HfoEyOpPSgpk/kKFhKn0Ul4YuY4rLkO\nWASHj+nvLeGGfDQdvWMSg7hPS53kb4GpN+znrhy0VcnHNBoVmuj0JXexAoGBAMPR\n8z+CmmiHAUL10XjBrvjm1EWNon8JfHv1+uwBshl0fjrjcREX1Cd0S7BKuz//mMxj\nznw9kusJd0Nv/WDOkJxyKw2UV0WEtfGaeQI8KXwn57uwrCiMiEj3PmWacvTZn0dL\nj8VQNzHx7Kdw16ViTkOxKVlnCb/IVdrL+/H9DxWRAoGBAIbeuiR00LFZ3YH5jCXr\nsG2mbsMrleLNcJGAona6UtX3/OqWJiHuxC9hCtuYMrEcvhR/+3MGrVFKNwsNDMo5\n9weOfR2aoNuILe0gCbtI0n0qGOqNCoJLz8JdqtsC8iyoD/Rye2+bDLqAJaU9w3ik\nVifxOmmAL/G7l7rj8m9Bm6z4\n-----END PRIVATE KEY-----\n'
		}
	}
  const client = new language.LanguageServiceClient(option);

  // The text to analyze
  const text = comment;

  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  // Detects the sentiment of the te
  const result = await client.analyzeSentiment({ document: document });
  return result;
};

module.exports = nL;
