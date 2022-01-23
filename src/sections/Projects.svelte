<script>
    import Project from '../components/Project.svelte';
    import { Projects } from '../constants';
</script>

<div class="project-list">
    {#each Projects as project}
        <Project {project}/>
    {/each}
</div>

<style>
    @media (min-width: 1200px) {
	    .project-list {
		    --card-flex: 25%!important;
		    --card-count: 3!important;
	    }
    }

    @media (min-width: 800px) {
        .project-list {
		    --card-flex: 40%;
		    --card-count: 2;
		    display: flex;
	    	flex-wrap: wrap;
            margin-left: calc(50% - (var(--card-count) / 2) * (var(--card-flex) + 60px));
	    }
    }
</style>