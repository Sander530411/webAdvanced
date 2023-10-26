<script>

    import {webToken, user, accountType} from "../store.js";
    import jwtDecode from "jwt-decode";
    import {get} from "svelte/store";
    import router from "page";

    let username = "";
    let password = "";

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username, password}),
            });

            if (response.ok) {
                // successful authentication
                let token = await response.json();

                webToken.set(token.token);
                console.log(jwtDecode(token.token));
                let decode = jwtDecode(token.token);
                user.set(decode["username"]);
                accountType.set(decode["type"]);
                if (get(accountType) === "admin")
                    router.redirect("/admin");
                else
                    router.redirect("/");
            } else {
                // Authentication failed
                alert("Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    export let params;
</script>

<main>
    <h1>Login</h1>
    <form on:submit={handleSubmit}>
        <label for="username">Username:</label>
        <input type="text" id="username" bind:value={username} required/>

        <label for="password">Password:</label>
        <input type="password" id="password" bind:value={password} required/>

        <button type="submit">Log In</button>
    </form>
</main>