# P2P Share

Secure communications and file sharing over WebRTC. P2P Share is a simple web application that enables two peers to connect to each other over UDP protocol and share files, video call etc securely.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fringilla enim egestas vehicula convallis. Sed lobortis convallis sem ac sodales. Donec sollicitudin ornare orci, ac pharetra ipsum convallis vitae. Suspendisse placerat nisl tortor, vel ornare neque ultricies sed. Donec vehicula lacus nisi, ac tempus velit placerat sit amet. Duis cursus purus at enim blandit consequat. Sed accumsan suscipit nunc, non porttitor purus ultrices ut. Morbi eget mattis neque. Integer eu est at ante tristique laoreet in a ex. Sed vehicula leo nibh, et cursus arcu vestibulum id. Donec ut est tincidunt, ultrices lorem vitae, iaculis ante. Phasellus volutpat nunc tincidunt mi volutpat interdum quis et ex.

## Project Folder Structure

```bash
├── README.md
├── backend // Server Side Code
|  ├── package.json
|  ├── src
|  ├── tsconfig.json
|  └── yarn.lock
└── client // Client Code - Next.JS
   ├── README.md
   ├── api
   ├── components
   ├── context
   ├── firebase
   ├── lottie
   ├── next-env.d.ts
   ├── next.config.js
   ├── package.json
   ├── pages
   ├── postcss.config.js
   ├── prettier.config.js
   ├── public
   ├── services
   ├── styles
   ├── tailwind.config.js
   ├── tsconfig.json
   ├── types
   ├── utils
   └── yarn.lock
```

## Setup Instructions

- Clone this repository.
- CD into client folder.
- create a new file named ```.env.local```
- Copy the contents of ```.env.example``` to ```.env.local```
- Add API keys to ```.env.local``` file such as Firebase API keys and server URL.
- yarn install in both client and server folder

### Screenshots

![Main Dashboard](https://raw.githubusercontent.com/piyushgarg-dev/P2PShare/main/assets/images/ConnectMeP2P.png)
