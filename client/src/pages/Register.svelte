<script>
    import router from "page";

    let username = "";
    let password = "";
    let passwordRepeat = "";

    async function handleSubmit(event) {
        event.preventDefault();
        if (password !== passwordRepeat) {
            alert("Passwords do not match.");
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username, password}),
            });

            if (response.ok) {
                alert("Account created successfully.");
                router("/home")
            } else if (response.status === 409) {
                alert("Username already exists.");
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

        <label for="passwordRepeat">Repeat Password: </label>
        <input type="password" id="passwordRepeat" bind:value={passwordRepeat} required/>

        <button type="submit">Log In</button>
    </form>
</main>