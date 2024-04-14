<script lang="ts">
    import FloatingButton from "$lib/components/generics/FloatingButton.svelte";
    import {onMount} from "svelte";

    export let data;
    const {characters, charactersTemplates, charactersPanel} = data;

    let addStyle= "width: 50px; height: 40px;border-radius: 13%";

    function AddEventListener(event: any) {
        const addOptions = document.getElementById('add-options');
        if (addOptions === null) return console.error('Add options not found');
        const add = document.getElementById('add');
        if (add === null) return console.error('Add button not found');
        const addText = document.getElementById('add-text');
        if (addText === null) return console.error('Add text not found');

        if (event.target !== addOptions && event.target !== add && event.target !== addText) {
            Add(true)(event);
        }
    }

    function Add(forceClose: boolean = false) {
        return function _add(event: any) {
            const addOptions = document.getElementById('add-options');
            if (addOptions === null) return console.error('Add options not found');

            const isClosed = addOptions.style.display === 'none' || addOptions.style.display === '';
            if (forceClose && isClosed) {
                return;
            }

            // animate button from text to cross
            const addText = document.getElementById('add-text');
            if (addText === null) return console.error('Add text not found');

            addText.innerHTML = isClosed ? 'X' : 'Add';

            // animate button round the borders
            // with timeout to allow the text to change first
            let time = 5;
            const interval = setInterval(() => {
                time += 5;
                const radius = isClosed ? time : 50 - (time / 50 * (50 - 13));
                addStyle = isClosed ? `border-radius: ${radius}%; width: 40px; height: 40px;` : `border-radius: ${radius}%; width: 50px; height: 40px;`;
                if (time >= 50) {
                    clearInterval(interval);
                }
            }, 20);

            // animate options
            const options = addOptions.children;
            addOptions.style.display = 'flex';
            for (let i = 0; i < options.length; i++) {
                const option = options[i];

                option.style.transform = isClosed ? 'translateY(100%)' : 'translateY(-100)';
                option.style.opacity = isClosed ? '0' : '1';

                let time = 0;
                const interval = setInterval(() => {
                    time += 5;
                    const translate = isClosed ? 100 - (time / 100 * 100) : time / 100 * 100;
                    const fade = isClosed ? (time / 100) : 1 - time / 100;
                    option.style.transform = `translateY(${translate}%)`;
                    option.style.opacity = fade.toString();
                    if (time >= 100) {
                        addOptions.style.display = isClosed ? 'flex' : 'none';
                        clearInterval(interval);
                    }
                }, 10);
            }
        }
    }

    function createCharacter() {
        window.location.href = "characters/add/character";
    }

    async function createTemplate() {
        const response = await fetch('/api/panels/characters/templates/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({panelId: charactersPanel.id}),
        });

        if (response.ok) {
            const newTemplate = await response.json();
            window.location.href = "characters/templates/" + newTemplate.template.id;
        } else {
            console.error('Failed to create template');
        }
    }

    // add event listener to close the options when clicking outside
    onMount(() => {
        window.addEventListener('click', AddEventListener);
    });
</script>

<div>
    <h1>Characters</h1>
    <div class="panel-container">
        <div class="characters-container">
            <h2>Characters</h2>
            <ul >
                {#each characters as character}
                    <li>
                        <a href="characters/characters/{character.id}">
                            {character.name}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
        <div class="templates-container">
            <h2>Templates</h2>
            <ul >
                {#each charactersTemplates as template}
                    <li>
                        <a href="characters/templates/{template.id}">
                            {template.name}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
        <FloatingButton onClick={Add()} style={addStyle} id="add">
            <div id="add-text" class="add-text">Add</div>
        </FloatingButton>
        <div class="add-options" id="add-options">
            <button on:click={createCharacter}>Character</button>
            <button on:click={createTemplate}>Template</button>
        </div>

</div>

<style>
    .add-text {
        display: flex;
        justify-content: center;
    }

    .add-options {
        display: none;
        position: absolute;
        bottom: 80px;
        right: 20px;
        flex-direction: column;
    }

    .add-options button {
        margin: 5px;
        background: rgba(63, 60, 60, 1);
        border: none;
        border-radius: 5px;
        padding: 10px;
        color: white;
        cursor: pointer;
        transition: 0.2s;
    }

    .add-options button:hover {
        background: rgba(63, 60, 60, 0.8);
    }

    .characters-container {
        list-style-type: none;
        padding: 0;
        flex-grow: 0.8;
    }

    .characters-container li {
        margin: 5px;
    }

    .templates-container {
        flex-grow: 0.2;
        list-style-type: none;
        padding: 0;
    }

    .templates-container h2 {
        margin: 0;
    }

    .templates-container ul {
        border-left: 1px solid black;
    }

    .templates-container ul li {
        margin: 5px;
        list-style-type: none;
    }

    .panel-container {
        display: flex;
        flex-direction: row;
    }
</style>