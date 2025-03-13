# Mbaza Admin

This project is a React.js application built with Vite.js. It provides an admin interface for managing Mbaza.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

Mbaza Admin provides the following features:

- Login page that allows adimin to login with.
- Dashboard to view USSD information.
- Form for adding USSD information.

## Technologies

Mbaza Admin is built using the following technologies:

- [React.js](https://reactjs.org/)
- [Tailwindcss](https://tailwindcss.com/)

## Installation

To install Mbaza Admin, follow these steps:

1. Clone the repository:

```shell
git clone https://github.com/Mbaza-Product/infrastructure.mbaza.knowledge-base.git
```

2. Install the dependencies:

```shell
yarn install
```

or

```shell
npm install
```

## Usage

To run Mbaza Admin, follow these steps:

### Configuration

1. Create a `.env.local` file in the root directory of the project.
2. Create a `.env.local` file by copying and renaming the .env.example file: `cp .env.example .env.local`
3. Update the values in the `.env.local` file.

### Development

1. Run the application:

```shell
yarn dev
```

2. Open [http://localhost:$PORT](http://localhost:$PORT) in a web browser.

### Build

```shell
yarn build
```

or

```shell
npm run build
```

Then deploy the dist folder

### Preview

Preview the app after build

```shell
yarn preview
```

or

```shell
npm run preview
```

Open [http://localhost:$PORT](http://localhost:$PORT) in a web browser to view the preview.

## Contributing

Contributions to Mbaza Admin are welcome! To contribute, follow these steps:

1. Fork the repository: `https://github.com/Mbaza-Product/infrastructure.mbaza.knowledge-base.git`
2. Create a new branch: `git checkout -b feat-branch-name`
3. Make changes and commit them: `git commit -m "Add new feature"`
4. Push to the branch: `git push origin my-feature-branch`
5. Create a pull request to the develop branch of the original repository.

## License

Mbaza Admin is licensed under the [MIT License](https://opensource.org/licenses/MIT).
