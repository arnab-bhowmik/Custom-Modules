# Execute the following steps to publish this NPM Library post any code changes.
git add .
git commit -m <COMMIT_MESSAGE>
npm version patch   # Update the version number
npm run build
npm publish

# To clean the contents
npm run clean && tsc
del ./build/*
