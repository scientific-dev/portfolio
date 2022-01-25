<script>
    import Activity from '../components/Activity.svelte';
    import { compileTimeline } from '../scripts/timeline';

    let timelineData = false;
    let failed = false;
    let sliceIndex = 1;
    let viewMore = null;

    $: viewMore = (sliceIndex * 5) < timelineData?.length;

    if (!timelineData) {
        fetch(`/activities.json`)
            .then(res => res.json())
            .then(data => timelineData = compileTimeline(data), error => {
                console.log(error);
                failed = true;
            });
    }
</script>

{#if !timelineData}
    <div class="loading">
        <h1>Loading Timeline</h1>
        <p>It takes us some time to load things.</p>
    </div>
{:else if failed}
    <div class="loading">
        <h1>Failed to load</h1>
        <p>Failed to load timeline.</p>
    </div>
{:else}
    <div class="wrapper">
        {#each timelineData.slice(0, sliceIndex * 5) as activity}
            <Activity {activity}/>
        {/each}

        <div class="activity-wrapper">
            <div class="activity pre-activity">
                <!-- svelte-ignore a11y-missing-attribute -->
                <a on:click={() => sliceIndex = viewMore ? sliceIndex + 1 : 1}>
                    View {viewMore ? 'more' : 'less'}?
                </a>
            </div>
        </div>
    </div>
{/if}

<style>
    .loading {
        text-align: center;
        opacity: .9;
    }

    .loading h1 {
        font-size: 50px;
        margin-bottom: 0;
        line-height: 1.1;
    }

    .loading p {
        margin: 0;
        color: var(--blue);
    }

    a {
        text-align: center;
        text-decoration: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        line-height: 1.1;
    }

    a:hover {
        text-decoration: underline;
    }

    /* .loading a {
        text-decoration: none!important;
        line-height: 1;
        padding: 0 10px;
        border-radius: 3px;
        color: var(--blue);
        border: 2px solid var(--blue);
        margin-top: 10px;
    }

    .loading a:hover {
        background-color: var(--blue);
    } */

    @media (max-width: 700px) {
        .wrapper {
            margin-top: 20px;
        }
    }

    @media (min-width: 700px) {
        .wrapper {
            padding: 50px 60px;
        }
    }
</style>