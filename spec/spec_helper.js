// Add more matchers via Jest extended
import 'jest-extended';

expect.extend({

  toHaveBeenCalledWithMatch(received, ...parameters) {
    try {
      parameters.forEach((parameter, i) => {
        expect(received.mock.calls[0][i]).toMatch(parameters[i]);
      });
    }

    catch (error) {
      return {
        pass: false,
        message: () => {
          let matcherHint = this.utils.matcherHint('.toHaveBeenCalledWithMatch');
          return `${ matcherHint }\n${ error.message.replace(/^.*?\n/m, '') }`;
        }
      };
    }

    return {
      pass: true,
      message: () => {
        let formattedExpected = parameters
          .map(parameter => `  ${ this.utils.printExpected(parameter) }`)
          .join("\n");

        let formattedReceived = received.mock.calls[0]
          .map(parameter => `  ${ this.utils.printReceived(parameter) }`)
          .join("\n");

        return [
          this.utils.matcherHint('.not.toHaveBeenCalledWithMatch'),
          "\n",
          `Expected mock to not have been called with parameters:\n${ formattedExpected }\n`,
          `Received:\n${ formattedReceived }`
        ].join("\n");
      }
    };
  }
});
