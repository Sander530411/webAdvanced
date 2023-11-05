<script>
    import {user, accountType} from "../store.js";
    import {get} from "svelte/store";

    let userLoginText = get(user) ? get(user) : "Login";

    user.subscribe(() => {
        userLoginText = get(user) ? get(user) : "Login";
    });

    export let active;
</script>
<nav>
    <div class="logo">
        <img src="..\src\assets\svelte.png" alt="Logo">
    </div>
    <ul>
        <li><a class:active={active === "/"} href="/">Home</a></li>
        <li><a class:active={active === "/about"} href="/about">About</a></li>
        <li><a class:active={active === "/register"} href="/register">Register</a></li>
        {#if $accountType === "admin"}
            <li><a class:active={active === "/admin"} href="/admin">Admin</a></li>
        {/if}
        {#if $accountType === "user"}
            <li><a class:active={active === "/user"} href="/user">User</a></li>
        {/if}
    </ul>
    <div class="user">
        <a href="/login">{userLoginText}</a>
    </div>
</nav>

<style>
    nav {
        background-color: #333;
        color: #fff;
        padding: 10px 0;
        display: flex;
        justify-content: space-between;
    }

    .logo img {
        width: 50px;
        height: auto;
        margin: 0 10px;
    }

    ul {
        list-style-type: none;
    }

    ul li {
        display: inline;
        margin: 20px;
    }

    a {
        text-decoration: none;
        color: #fff;
    }

    nav a:hover {
        text-decoration: underline;
    }

    a.active {
        font-weight: bold;
    }

    .user {
        margin: 20px;
    }
</style>