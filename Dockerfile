FROM public.ecr.aws/lambda/nodejs:14

COPY main.js package.json ./

RUN npm install

# Command can be overwritten by providing a different command in the template directly.
CMD ["main.handler"]
