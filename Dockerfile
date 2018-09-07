FROM node:9.5

# Install the application's dependencies
ADD package.json yarn.lock /app/
WORKDIR /app
RUN mkdir lib
RUN yarn install

# Add the library's code.
ADD . /app

