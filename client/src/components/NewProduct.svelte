<script>
    import {products, query, webToken} from "../store.js";

    let data = {
        title: "",
        description: "",
        img: null
    };

    async function submit(event) {
        event.preventDefault();
        fetch("http://localhost:3000/products", {
            method: 'POST',
            headers: {
                'Authorization': $webToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json());
    }

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                data.img = reader.result;
            };

            reader.readAsDataURL(file);
        } else {
            data.img = null;
        }
    }
</script>

<main>
    <form on:submit={submit}>
        <h2>New product</h2>
        <p>Fill out all the data to add a new product</p>
        <br>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" bind:value={data.title} required>

        <label for="description">Description</label>
        <textarea id="description" name="description" bind:value={data.description} required></textarea>

        <label for="product-image">Product image</label>
        <input type="file" name="product image" id="product-image" on:change={handleFileChange} accept="image/png, image/jpeg">
        <img id="image-preview" alt="Preview" src={data.image}>

        <button type="submit">Add product</button>
    </form>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 350px;
        background: #333333;
    }

    label {
        display: block;
        margin-bottom: 8px;
    }

    input {
        width: 60%;
        padding: 8px;
        margin-left: 20px;
        margin-bottom: 20px;
        margin-right: 20px;
    }

    button {
        width: 67%;
        padding: 8px;
        margin-left: 20px;
        margin-bottom: 20px;
        margin-right: 20px;
    }

    img {
        display: block;
        margin: 0 auto;
        width: 200px;
        height: 200px;
        margin-bottom: 20px;
    }
</style>