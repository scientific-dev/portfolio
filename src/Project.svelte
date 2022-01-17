<script>
    export let project;
</script>

<div class="project-card pre-project-card">
    <header>
        <div class="title"> 
            <i class="far fa-folder-open fa-2x"/>
            <h3>{project.name}</h3>
        </div>

        <p class="description">{project.description}</p>
        <div style="height: 10px;"></div>
    </header>

    <footer>
        <span class="languages">
            {#each project.languages as language}
                <p>{language}</p>
            {/each}
        </span>

        <span class="svg-links">
            {#each project.buttons as button}
                <a href={button.href}>
                    <i class={button.svg}/>
                </a>
            {/each}
        </span>
    </footer>
</div>