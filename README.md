# Next JS & Open AI / GPT: Next-generation Next JS & AI apps
This is the starter repo for the [Next JS & Open AI / GPT: Next-generation Next JS & AI apps course](https://www.udemy.com/course/next-js-ai/?referralCode=CF9492ACD4991930F84E).

# Starting DEV server
1. Make sure your dependencies are built
```
npm install
```
2. Run the DEV server
```
npm run dev
```
3. Should there be any issues starting try deleting the .next, package-lock.json, and the node_modules folder and try re-installing the dependencies, i.e. :
```
npm install
```
# Starting the PROD server
1. Make sure the dependencies are built
```
npm install
```
2. Make sure any ".env" file is renamed to ".env.prod"
3. Run the build command
```
npm run build
```
4. Run the PROD server
```
npm start
```
# Stripe testing steps
1. login to stripe to confirm 90 day access
```
..\..\stripe_1.19.4_windows_x86_64\stripe.exe login
```
1. run listener on local site
```
..\..\stripe_1.19.4_windows_x86_64\stripe.exe listen --load-from-webhooks-api --forward-to localhost:3000/api/webhook
```
1. Should now be able to receive any completion webhook broadcast and have local endpoint process it.


