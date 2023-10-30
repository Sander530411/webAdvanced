<script>
  import { writable } from 'svelte/store';

  import logo from './assets/svelte.png';
  import router from 'page';

  import Home from "./pages/Home.svelte";
  import About from "./pages/About.svelte";
  import Login from "./pages/Login.svelte";
  import Header from "./components/Header.svelte";
  import Admin from "./pages/Admin.svelte";
  import Product from "./pages/ProductPage.svelte";

  let page;
  let params;
  let currentRoute;

  router('/', (ctx) => {
    page = Home;
    currentRoute = ctx.pathname;
  });
  router('/about', (ctx) => {
    page = About;
    currentRoute = ctx.pathname;
  });
  router('/login', (ctx) => {
    page = Login;
    currentRoute = ctx.pathname;
  });
  router('/admin', (ctx) => {
    page = Admin;
    currentRoute = ctx.pathname;
  });
  router('/product/:id', (ctx) => {
    page = Product;
    currentRoute = ctx.pathname;
  });

  router.start();

</script>

<main>
  <Header active={currentRoute} />
  <svelte:component this={page} {params}/>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

</style>
