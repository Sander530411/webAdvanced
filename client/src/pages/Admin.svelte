<script>
    import {accountType, user} from "../store.js";
    import {get} from "svelte/store";
    import router from "page";
    import NewProduct from "../components/NewProduct.svelte";

    if ($accountType === "") {
        alert("You are not logged in. You will be redirected to the login page.");
        router.redirect("/login");
    } else if ($accountType !== "admin") {
        alert("You are not authorized to view this page. You will be redirected to the home page.");
        router.redirect("/");
    }

    export let params;
</script>

<main>
    <h1>welcome {get(user)}</h1>
    <div class="newProduct">
        <NewProduct/>
    </div>
</main>

<style>
    main {
        margin: 0;
        padding: 10px;
    }

    .newProduct {
        float: left;
        margin-left: 0;
        max-width: 13%;
    }
</style>