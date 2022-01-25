<script>
    import { breakSimpleMarkdown } from "../scripts/timeline";

    export let activity; 
</script>

<div class="activity-wrapper">
    <div class="activity pre-activity">
        <div class="flex">
            <div class="content">
                <a href={activity.link} target="_blank">
                    <h1>{activity.name}</h1>
                </a>

                <div style="margin-top: 4px; margin-bottom: 4px;">
                    {#each activity.labels as label}
                        <p class="label">{label}</p>
                    {/each}
                </div>
    
                <p class="text-description">
                    {@html breakSimpleMarkdown(activity.description)}
                </p>
            </div>
    
            {#if activity.img}
                <div class="thumbnail" style="background-image: url({activity.img});"/>
            {/if}
        </div>
    
        <p class="date">{activity.date}</p>
    </div>
</div>

<style>
    :global(.activity-wrapper) {
        padding-left: 20px;
        padding-top: 30px;
        margin-left: 20px;
        border-left: 4px solid var(--light-grey);
    }

    :global(.activity) {
        background-color: var(--project-color);
		border-radius: 30px;
		padding: 40px 35px;
		width: calc(100% - 60px);
    }

    :global(.activity::before) {
        content: " ";
        display: inline-block;
        position: relative;
        left: -64.5px;
        z-index: 100;
        border-radius: 100%;
        background: var(--blue);
        box-shadow: 0 0 0 6px rgba(29, 161, 242, .6);
        height: 16px;
        width: 16px;
    }

    :global(.text-description a) {
        text-decoration: underline;
        color: white;
    }

    :global(.activity:not(.pre-activity)) {
		animation: section-animation .5s forwards;
	}

    a {
        text-decoration: none;
    }

    h1, p {
        margin: 0;
    }

    h1 {
        margin-top: -28px;
        font-size: 40px;
        font-weight: bold;
        line-height: 1.1;
        opacity: .9;
        color: white;
        cursor: pointer;
    }

    h1:hover {
        text-decoration: underline;
    }

    .date {
        color: var(--blue);
        margin-top: 10px;
        font-size: 25px;
    }

    .label {
        padding: 4px;
        border-radius: 2px;
        margin: 2px;
        color: rgb(247, 247, 247);
        background-color: var(--blue);
        line-height: 1;
        display: inline-block;
        font-weight: bold;
        text-transform: capitalize;
    }

    .content {
        width: 75%;
    }

    .thumbnail {
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 10px;
    }

    @media (max-width: 700px) {
        .flex {
            flex-direction: column;
        }

        .thumbnail {
            width: 100%;
            height: calc(80vw - 108.5px);
            margin: 20px 0;
        }
    }

    @media (min-width: 700px) {
        .text-description {
            padding-right: 10px;
            padding-left: 2px;
        }

        .thumbnail {
            width: 200px;
            height: 200px;
        }
    }
</style>