# P2P Share

Secure communications and file sharing over WebRTC. P2P Share is a simple web application that enables two peers to connect to each other over UDP protocol and share files, video call etc securely.

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
