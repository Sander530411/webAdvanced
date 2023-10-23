<script>
    let username = "";
    let password = "";

    async function handleSubmit() {
        try {
            const response = await fetch("http://localhost:3000/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                // Successful login - Redirect or perform other actions
                alert("Login successful!");
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
        <input type="text" id="username" bind:value={username} required>

        <label for="password">Password:</label>
        <input type="password" id="password" bind:value={password} required>

        <button type="submit">Log In</button>
    </form>
</main>
