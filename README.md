# Graphcool Dashboard

Official source of [dashboard.graph.cool](https://dashboard.graph.cool/) written in Typescript 2 and based on React & Relay

## Changelog

### [Milestone M1](https://github.com/graphcool/dashboard/milestone/1)

* Managing relations between models was not as straightforward as it should be. This is a lot easier now with the new **Relations Page**. Give your data model some relation love ❣️.
* The colors of the dashboard looked a bit washed out over time, so we decided to repaint it. The paint still needs to dry... 🖌
* You're now automatically redirected to a newly created project.
* Migration and default values now also work for lists.
* Something special happend to our codebase: Javascript evolved into **Typescript**. It was very effective against Bug-Type Pokemons. 🔥
* *Fixed*: You can now edit list values in the Data Browser.
* *Fixed*: Sometimes deleted nodes remained visible in the Data Browser. Now you won't see them again. We promise.
* *Fixed*: We finally defeated the infinite loop monster which showed up after renaming a project.

See **[here](CHANGELOG.md)** for a full list of all changes (features/bug fixes).

## Development


master | dev
--- | ---
[![CircleCI](https://circleci.com/gh/graphcool/dashboard/tree/master.svg?style=svg)](https://circleci.com/gh/graphcool/dashboard/tree/master) | [![CircleCI](https://circleci.com/gh/graphcool/dashboard/tree/dev.svg?style=svg)](https://circleci.com/gh/graphcool/dashboard/tree/dev)

```sh
# install dependencies
npm install
# run local server on :4000 using the offical Graphcool API
BACKEND_ADDR="https://api.graph.cool" npm start
```
### IDE Setup (Webstorm)

We use a different version of TypeScript than the default Webstorm TypeScript compiler. That's why you have to do the following to get rid of all TypeScript errors.
Please run `npm install` before the setup.

1. Go to the `Preferences` _(macOS: "⌘ + ,")_ window
2. In the left list menu **select** `Languages & Frameworks > TypeScript`
3. **Click** on the `Edit...` button in the `Common` Panel
4. **Select** `Custom directory`
5. **Browse** to your `project directory` and then **select** `node_modules/typescript/lib` and **click** `OK`
6. **Click** `OK` again in the `Configure TypeScript Compiler`
7. **Click** `OK` in the `Preference` window



## Help & Community [![Slack Status](https://slack.graph.cool/badge.svg)](https://slack.graph.cool)

Join our [Slack community](http://slack.graph.cool/) if you run into issues or have questions. We love talking to you!

![](http://i.imgur.com/5RHR6Ku.png)
